import { Data, WebSocket } from "ws";
import { ICLientCloseSignal, IClientErrorSignal, IMessageSignal, ISocketClient } from "@types";
import { UUID } from "../utils/UUID";
import { Debug } from "../debug";
import { Application } from "../app";
import { logs } from "../../config";
import { BufferIO } from "./BufferIO";
import { Signal } from "../utils";


export class SocketClient implements ISocketClient {
    private _id: string;
    private _server: WebSocket;
    private _heartbeatEvent: string;
    private _timeoutInterval: number;
    private _heartbeatTimeout: NodeJS.Timeout;
    private _code: number;
    private _protocol: Application.ProtocolType;
    // private _encoder: TextEncoder;
    // private _decoder: TextDecoder;
    private _bufferIO: BufferIO;
    private _messageSignal: IMessageSignal;
    private _errorSignal: IClientErrorSignal;
    private _closeSignal: ICLientCloseSignal;


    constructor(server: WebSocket, protocol: Application.ProtocolType) {
        this._server   = server;
        this._protocol = protocol;
        this._id       = UUID.randomUUID();
        this._heartbeatEvent  = "";
        this._timeoutInterval = 0;
        this._code = 1000;
        // this._encoder = new TextEncoder();
        // this._decoder = new TextDecoder("utf-8", {fatal: true});
        this._bufferIO      = new BufferIO();
        this._messageSignal = new Signal();
        this._errorSignal   = new Signal();
        this._closeSignal   = new Signal();
        this.registClientEvents();
    }

    public get server() { return this._server; }
    public get id() { return this._id; }

    public onMessage(callback: () => void) {
        this._messageSignal.add(callback);
        return this;
    }

    public onHeartbeat(event: string, interval: number) {
        this._heartbeatEvent = event;
        this._timeoutInterval = interval;
        return this;
    }

    public catch(callback: (error: Error) => void) {
        this._errorSignal.add(callback);
        return this;
    }

    public onClose(callback: (client: ISocketClient) => void) {
        this._closeSignal.add(callback);
        return this;
    }

    public close(code: number, data: string) {
        //只有客户端的服务关闭时才有错误码等参数
        if (typeof code === "undefined") {
            code = this._code;
        }
        this._server.close(code, data);
    }

    public send(str: string) {
        if (this.server.readyState === WebSocket.OPEN) {
            //当服务器向客户端转发数据时，数据格式为 “消息名字符串|错误码字符串|具体的数据字符串”
            const proxyName = str.split("|")[0];
            this.timeoutTaskHandle(proxyName);
            let result: any;
            if (this._protocol === Application.ProtocolType.ARRAY_BUFFER) {
                result = this.stringToBianry(str);
            }
            else if (this._protocol === Application.ProtocolType.JSON) {
                result = str;
            }
            this.server.send(result, error => {
                if (error) {
                    Debug.error("消息发送错误：", error);
                }
            });
        }
    }

    private stringToBianry(str: string) {
        // const uint8Array = this._encoder.encode(str);
        // return uint8Array.buffer;
        return this._bufferIO.stringToArrayBuffer(str);
    }

    private onMessageHandle(data: Data, isBinary: boolean) {
        if (isBinary) {
            let str: string;
            if (this._protocol === Application.ProtocolType.ARRAY_BUFFER) {
                // str = this._decoder.decode(buffer, {stream: true});
                str = this._bufferIO.arrayBufferToString(data as ArrayBuffer);
            }
            Application.getInstance().handleMessage(this, str);
            if (this._messageSignal.active) {
                this._messageSignal.dispatch();
            }
        }
        else if (typeof data === "string") {
            Application.getInstance().handleMessage(this, data);
            if (this._messageSignal.active) {
                this._messageSignal.dispatch();
            }
        }
        else {
            Debug.error("SocketClient[onMessageHandle] 出现了未知错误！");
        }
    }

    private onCloseHandle() {
        this.deregistClientEvents();
        if (this._closeSignal.active) {
            this._closeSignal.dispatch(this);
        }
    }

    private onErrorHandle(error: Error) {
        if (this._errorSignal.active) {
            this._errorSignal.dispatch(error);
        }
    }

    private registClientEvents() {
        this.server.on("message", this.onMessageHandle.bind(this));
        this.server.on("close", this.onCloseHandle.bind(this));
        this.server.on("error", this.onErrorHandle.bind(this));
    }

    private timeoutTaskHandle(event: string) {
        if (this._heartbeatEvent === event) {
            if (this._heartbeatTimeout) {
                clearTimeout(this._heartbeatTimeout);
            }
            this._heartbeatTimeout = setTimeout(() => {
                const code = logs.socketCode.Connection_Timeout;
                const msg = logs[code] as string;
                this.close(parseInt(code), msg);
            }, this._timeoutInterval * 1000);
        }
    }

    private deregistClientEvents() {
        this.server.off("message", this.onMessageHandle.bind(this));
        this.server.off("close", this.onCloseHandle.bind(this));
        this.server.off("error", this.onErrorHandle.bind(this));
    }
}