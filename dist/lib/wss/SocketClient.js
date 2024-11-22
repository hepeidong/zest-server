import { WebSocket } from "ws";
import { UUID } from "../utils/UUID";
import { Debug } from "../debug";
import { Application } from "../app";
import { logs } from "../../config";
import { BufferIO } from "./BufferIO";
import { Signal } from "../utils";
export class SocketClient {
    constructor(server, protocol) {
        this._server = server;
        this._protocol = protocol;
        this._id = UUID.randomUUID();
        this._heartbeatEvent = "";
        this._timeoutInterval = 0;
        this._code = 1000;
        // this._encoder = new TextEncoder();
        // this._decoder = new TextDecoder("utf-8", {fatal: true});
        this._bufferIO = new BufferIO();
        this._messageSignal = new Signal();
        this._errorSignal = new Signal();
        this._closeSignal = new Signal();
        this.registClientEvents();
    }
    get server() { return this._server; }
    get id() { return this._id; }
    onMessage(callback) {
        this._messageSignal.add(callback);
        return this;
    }
    onHeartbeat(event, interval) {
        this._heartbeatEvent = event;
        this._timeoutInterval = interval;
        return this;
    }
    catch(callback) {
        this._errorSignal.add(callback);
        return this;
    }
    onClose(callback) {
        this._closeSignal.add(callback);
        return this;
    }
    close(code, data) {
        //只有客户端的服务关闭时才有错误码等参数
        if (typeof code === "undefined") {
            code = this._code;
        }
        this._server.close(code, data);
    }
    send(str) {
        if (this.server.readyState === WebSocket.OPEN) {
            //当服务器向客户端转发数据时，数据格式为 “消息名字符串|错误码字符串|具体的数据字符串”
            const proxyName = str.split("|")[0];
            this.timeoutTaskHandle(proxyName);
            let result;
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
    stringToBianry(str) {
        // const uint8Array = this._encoder.encode(str);
        // return uint8Array.buffer;
        return this._bufferIO.stringToArrayBuffer(str);
    }
    onMessageHandle(data, isBinary) {
        if (isBinary) {
            let str;
            if (this._protocol === Application.ProtocolType.ARRAY_BUFFER) {
                // str = this._decoder.decode(buffer, {stream: true});
                str = this._bufferIO.arrayBufferToString(data);
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
    onCloseHandle() {
        this.deregistClientEvents();
        if (this._closeSignal.active) {
            this._closeSignal.dispatch(this);
        }
    }
    onErrorHandle(error) {
        if (this._errorSignal.active) {
            this._errorSignal.dispatch(error);
        }
    }
    registClientEvents() {
        this.server.on("message", this.onMessageHandle.bind(this));
        this.server.on("close", this.onCloseHandle.bind(this));
        this.server.on("error", this.onErrorHandle.bind(this));
    }
    timeoutTaskHandle(event) {
        if (this._heartbeatEvent === event) {
            if (this._heartbeatTimeout) {
                clearTimeout(this._heartbeatTimeout);
            }
            this._heartbeatTimeout = setTimeout(() => {
                const code = logs.socketCode.Connection_Timeout;
                const msg = logs[code];
                this.close(parseInt(code), msg);
            }, this._timeoutInterval * 1000);
        }
    }
    deregistClientEvents() {
        this.server.off("message", this.onMessageHandle.bind(this));
        this.server.off("close", this.onCloseHandle.bind(this));
        this.server.off("error", this.onErrorHandle.bind(this));
    }
}
