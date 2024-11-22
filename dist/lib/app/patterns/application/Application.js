import { MessageProcessor } from "../../core/MessageProcessor";
import { SystemProcessor } from "../../core/SystemProcessor";
import { SocketServer } from "../../../wss/SocketServer";
import { config } from "../../../../config";
import { Debug } from "../../../debug";
import { setParentType } from "../../../decorators";
import { ScriptLoader } from "../../util/ScriptLoader";
import { ThreadProcessor } from "../../core/ThreadProcessor";
export class Application {
    constructor() {
        Application._instance = this;
        this._server = new SocketServer();
        this.init();
    }
    static getInstance() { return this._instance; }
    get server() { return this._server; }
    get clients() { return this._server.clients; }
    handleMessage(client, str) {
        MessageProcessor.getInstance().handleMessage(client, str);
    }
    sendNotice(notification) {
        SystemProcessor.getInstance().sendNotice(notification);
    }
    addTask(task) {
        ThreadProcessor.getInstance().addTask(task);
    }
    dispatchTasks() {
        ThreadProcessor.getInstance().dispatchTasks();
    }
    init() {
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
    listen(port, host) {
        //打开服务器
        this._server.listen({ port, host }, this.startup.bind(this));
    }
    /**
     * 服务器启动完成
     * @returns 返回服务器消息协议的类型
     */
    startup() { return Application.ProtocolType.JSON; }
    /**
     * 发生客户端连接服务器时的回调
     * @param socketClient 连接服务器的客户端
     */
    onConnect(socketClient) { }
    /**服务器关闭时的回调 */
    onClose() { }
    onHeaders(headers, request) { }
    /**
     * 服务器发生错误时的回调
     * @param error 错误信息
     */
    onError(error) { }
}
(function (Application) {
    let ProtocolType;
    (function (ProtocolType) {
        /**JSON字符串类型 */
        ProtocolType[ProtocolType["JSON"] = 0] = "JSON";
        /**普通二进制类型 */
        ProtocolType[ProtocolType["ARRAY_BUFFER"] = 1] = "ARRAY_BUFFER";
        /**protoBuffer类型 */
        ProtocolType[ProtocolType["PROTO_BUFFER"] = 2] = "PROTO_BUFFER";
    })(ProtocolType = Application.ProtocolType || (Application.ProtocolType = {}));
})(Application || (Application = {}));
setParentType("Application", Application);
