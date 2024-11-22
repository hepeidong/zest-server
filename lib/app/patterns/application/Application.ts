import { IApplication, INotification, ISocketClient, ISocketServer, IWorkerTask } from "@types";
import { MessageProcessor } from "../../core/MessageProcessor";
import { SystemProcessor } from "../../core/SystemProcessor";
import { SocketServer } from "../../../wss/SocketServer";
import { config } from "../../../../config";
import { Debug } from "../../../debug";
import { setParentType } from "../../../decorators";
import { ScriptLoader } from "../../util/ScriptLoader";
import { ThreadProcessor } from "../../core/ThreadProcessor";

export class Application implements IApplication {
    private _server: ISocketServer;

    private static _instance: IApplication;
    constructor() {
        Application._instance = this;
        this._server = new SocketServer();
        this.init();
    }

    public static getInstance() { return this._instance; }

    public get server() { return this._server; }
    public get clients() { return this._server.clients; }

    public handleMessage(client: ISocketClient, str: string) {
        MessageProcessor.getInstance().handleMessage(client, str);
    }

    public sendNotice(notification: INotification): void {
        SystemProcessor.getInstance().sendNotice(notification);
    }

    public addTask(task: IWorkerTask) {
        ThreadProcessor.getInstance().addTask(task);
    }

    public dispatchTasks() {
        ThreadProcessor.getInstance().dispatchTasks();
    }

    private init() {
        ScriptLoader.getInstance().loadScript();
        //初始化端口
        const PORT = config.port;
        const HOST = config.host;
        Debug.log(`Server is running on port ${PORT}`);
        this._server.ws(`WebSocket server is active at ws://${HOST}:${PORT}`)
        .onConnect(this.onConnect.bind(this))
        .onClose(this.onClose.bind(this))
        .onHeaders(this.onHeaders.bind(this))
        .catch(this.onError.bind(this));
        //开启一个服务器
        this.listen(PORT, HOST);
    }

    private listen(port: number, host: string) {
        //打开服务器
        this._server.listen({port, host}, this.startup.bind(this));
    }

    /**
     * 服务器启动完成
     * @returns 返回服务器消息协议的类型
     */
    protected startup(): Application.ProtocolType { return Application.ProtocolType.JSON; }
    /**
     * 发生客户端连接服务器时的回调
     * @param socketClient 连接服务器的客户端
     */
    protected onConnect(socketClient: ISocketClient) {}
    /**服务器关闭时的回调 */
    protected onClose() {}
    protected onHeaders(headers: string[], request: WebSocket) {}
    /**
     * 服务器发生错误时的回调
     * @param error 错误信息
     */
    protected onError(error: Error) {}
}

export namespace Application {
    export enum ProtocolType {
        /**JSON字符串类型 */
        JSON,
        /**普通二进制类型 */
        ARRAY_BUFFER,
        /**protoBuffer类型 */
        PROTO_BUFFER
    }
}

setParentType("Application", Application);