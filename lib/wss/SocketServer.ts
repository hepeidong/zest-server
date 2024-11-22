import { ServerOptions, WebSocket, WebSocketServer } from "ws";
import { Debug } from "../debug";
import { SocketClient } from "./SocketClient";
import { IConnectionSignal, IHeaderSignal, IServerCloseSignal, IServerErrorSignal, ISocketClient, ISocketServer } from "@types";
import { IncomingMessage } from "http";
import { Application } from "../app";
import { Signal } from "../utils";



export class SocketServer implements ISocketServer {
    private _msg: string;
    private _isEnd: boolean;
    private _protocol: Application.ProtocolType;
    private _server: WebSocketServer;
    private _clients: Set<ISocketClient>;
    private _connectionSignal: IConnectionSignal;
    private _errorSignal: IServerErrorSignal;
    private _closeSignal: IServerCloseSignal;
    private _headerSignal: IHeaderSignal;

    constructor() {
        this._msg     = "";
        this._isEnd   = false;
        this._clients = new Set();
        this._connectionSignal = new Signal();
        this._errorSignal      = new Signal();
        this._closeSignal      = new Signal();
        this._headerSignal     = new Signal();
    }

    public get server() { return this._server; }
    public get clients() { return this._clients; }

    public ws(message = "") {
        this._msg = message;
        return this;
    }

    public catch(callback: (error: Error) => void) {
        this._errorSignal.add(callback);
        return this;
    }

    public onHeaders(callback: (headers: string[], request: WebSocket) => void) {
        this._headerSignal.add(callback);
        return this;
    }

    public onClose(callback: () => void) {
        this._closeSignal.add(callback);
        return this;
    }

    public onConnect(callback: (socketClient: ISocketClient) => void) {
        this._connectionSignal.add(callback);
        return this;
    }

    public close() {
        if (this._server) {
            this._server.close();
        }
        else {
            this._isEnd = true;
        }
    }

    public listen(options: ServerOptions, callback: () => Application.ProtocolType) {
        //打开websocket服务器
        const server = new WebSocket.Server(options, () => {
            Debug.log(this._msg);
            this._server = server;
            this.registServerEvents(server);
            this._protocol = callback();
        });
        if (this._isEnd) {
            this._isEnd = false;
            this._server.close();
            this.deregistServerEvents(this._server);
        }
    }

    private onWatchClient(client: ISocketClient) {
        Debug.log("有客户端主动断开");
        this.clients.delete(client);
    }

    private onConnectionHnadle(client: WebSocket) {
        const socketClient = new SocketClient(client, this._protocol);
        socketClient.onClose(this.onWatchClient.bind(this));
        this._clients.add(socketClient);
        if (this._connectionSignal.active) {
            this._connectionSignal.dispatch(socketClient);
        }
    }

    private onCloseHandle() {
        this.deregistServerEvents(this._server);
        if (this._closeSignal.active) {
            this._closeSignal.dispatch();
        }
    }

    private onErrorHandle(error: Error) {
        if (this._errorSignal.active) {
            this._errorSignal.dispatch(error);
        }
    }   

    private onHeadersHandle(headers: string[], request: IncomingMessage) {
        if (this._headerSignal.active) {
            this._headerSignal.dispatch(headers, request);
        }
    }

    private registServerEvents(server: WebSocketServer) {
        server.on("connection", this.onConnectionHnadle.bind(this));
        server.on("close", this.onCloseHandle.bind(this));
        server.on("error", this.onErrorHandle.bind(this));
        server.on("headers", this.onHeadersHandle.bind(this));
    }

    private deregistServerEvents(server: WebSocketServer) {
        server.off("connection", this.onConnectionHnadle.bind(this));
        server.off("close", this.onCloseHandle.bind(this));
        server.off("error", this.onErrorHandle.bind(this));
        server.off("headers", this.onHeadersHandle.bind(this));
    }
}