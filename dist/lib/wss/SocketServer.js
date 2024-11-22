import { WebSocket } from "ws";
import { Debug } from "../debug";
import { SocketClient } from "./SocketClient";
import { Signal } from "../utils";
export class SocketServer {
    constructor() {
        this._msg = "";
        this._isEnd = false;
        this._clients = new Set();
        this._connectionSignal = new Signal();
        this._errorSignal = new Signal();
        this._closeSignal = new Signal();
        this._headerSignal = new Signal();
    }
    get server() { return this._server; }
    get clients() { return this._clients; }
    ws(message = "") {
        this._msg = message;
        return this;
    }
    catch(callback) {
        this._errorSignal.add(callback);
        return this;
    }
    onHeaders(callback) {
        this._headerSignal.add(callback);
        return this;
    }
    onClose(callback) {
        this._closeSignal.add(callback);
        return this;
    }
    onConnect(callback) {
        this._connectionSignal.add(callback);
        return this;
    }
    close() {
        if (this._server) {
            this._server.close();
        }
        else {
            this._isEnd = true;
        }
    }
    listen(options, callback) {
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
    onWatchClient(client) {
        Debug.log("有客户端主动断开");
        this.clients.delete(client);
    }
    onConnectionHnadle(client) {
        const socketClient = new SocketClient(client, this._protocol);
        socketClient.onClose(this.onWatchClient.bind(this));
        this._clients.add(socketClient);
        if (this._connectionSignal.active) {
            this._connectionSignal.dispatch(socketClient);
        }
    }
    onCloseHandle() {
        this.deregistServerEvents(this._server);
        if (this._closeSignal.active) {
            this._closeSignal.dispatch();
        }
    }
    onErrorHandle(error) {
        if (this._errorSignal.active) {
            this._errorSignal.dispatch(error);
        }
    }
    onHeadersHandle(headers, request) {
        if (this._headerSignal.active) {
            this._headerSignal.dispatch(headers, request);
        }
    }
    registServerEvents(server) {
        server.on("connection", this.onConnectionHnadle.bind(this));
        server.on("close", this.onCloseHandle.bind(this));
        server.on("error", this.onErrorHandle.bind(this));
        server.on("headers", this.onHeadersHandle.bind(this));
    }
    deregistServerEvents(server) {
        server.off("connection", this.onConnectionHnadle.bind(this));
        server.off("close", this.onCloseHandle.bind(this));
        server.off("error", this.onErrorHandle.bind(this));
        server.off("headers", this.onHeadersHandle.bind(this));
    }
}
