import WebSocket, { ServerOptions, WebSocketServer } from "ws";

/**socket消息的数据结构 */
interface ISocketData {
    /**消息协议的类型，提供给服务器识别，客户端和服务器约定的此消息的身份id */
    proxyName: string;
    /**请求时的数据参数 */
    data: any;
}
interface IResponseSocketData extends ISocketData {
    /**错误码，对于socket长连接，错误码为0时，消息正确返回，错误码不为0时，消息处理出错 */
    code: number;
}

type socket_data_type = "object"|"array"|"int"|"float"|"string"|"boolean";

interface IServer<T> {
    /**
     * 服务器发生异常的回调
     * @param cb 
     */
    catch(cb: (error: Error) => void): T;
    onClose(cb: () => void): T;
}

interface ISocketClient extends IServer<ISocketClient> {
    readonly server: WebSocket;
    onMessage(cb: () => void): ISocketClient;
    onClose(cb: (client: ISocketClient) => void): ISocketClient;
    /**
     * 设置心跳的事件和超时时间
     * @param event 心跳的事件名
     * @param interval 心跳超时时间，超过这个时间还没有收到心跳包，则视为客户端已经断开连接，服务器主动断开连接
     */
    onHeartbeat(event: string, interval: number): ISocketClient;
    /**
     * 关闭服务器或者结束连接
     * @param code 错误码
     * @param data 错误描述
     */
    close(code?: number, data?: string | Buffer): void;
    send(data: string): void;
}

interface ISocketServer extends IServer<ISocketServer> {
    readonly server: WebSocketServer;
    readonly clients: Set<ISocketClient>;
    onHeaders(cb: (headers: string[], request: WebSocket) => void): ISocketServer;
    /**
     * 
     * @param message 打开服务器时的一段文字描述
     */
    ws(message?: string): ISocketServer;
    /**
     * 连接服务器的客户端
     * @param cb 
     */
    onConnect(cb: (ws: ISocketClient) => void): ISocketServer;
    /**
     * 开启一个websocket服务
     * @param options
     */
    listen(options: ServerOptions, callback: () => number): void;
    /**
     * 关闭服务器或者结束连接
     * @param cb 
     */
    close(cb?: (err?: Error) => void): void;
}

interface IConfig {
    host: string;
    port: number;
    path: string;
}

interface ILogs {
    socketCode: {
        Normal_Closure: string,
        Connection_Timeout: string,
        Poor_Network: string,
        Not_Network: string
    };
    [n: string]: string;
}

declare type Constructor<T = unknown> = new (...args: any[]) => T;

type Prototype = {
    constructor: Function;
}

type ParentType = {
    Application: Function
}

interface IMessageProcessor {
    handleMessage(client: ISocketClient, str: string): void;
}

interface ISystemProcessor {
    sendNotice(notification: INotification): void;
}

interface INotification {
    getName(): string;
    getSystemName(): string;
    /**
     * 设置错误码，默认正常为 0
     * @param code 
     */
    setCode(code?: number): void;
    setData(data: any): void;
    getData(): any;
    sendData(): void;
    toString(): string;
}

interface IObserver {
    notifyObserver(notification: INotification): void;
    compareNotifyContext(object: any): boolean;
}

interface IMessage {
    handle(client: ISocketClient, str: string): void;
}

interface IApplication {
    handleMessage(client: ISocketClient, str: string): void;
    sendNotice(notification: INotification): void;
    addTask(task: IWorkerTask): void;
    dispatchTasks(): void;
}

interface INotifier {
    sendNotice(notification: INotification): void;
}

interface ISystem {
    readonly name: string;
    /**功能系统开始执行前调用，在execute之前被调用，可以在这里做一些必要的初始化，每次功能系统被执行前都会调用此函数 */
    onStart(): void;
    /**
     * 异步执行消息处理逻辑，通过返回一个自身对象来告诉系统结束消息处理
     * @param notification 
     */
    async execute(notification: INotification): Promise<ISystem>;
}

interface IHandler {
    /**handler唯一的id */
    readonly id: number;
    /**是否只执行一次 */
    readonly once: boolean;
    /**回调函数体 */
    readonly method: Function;
    /**执行域 */
    readonly caller: any;
    /**
     * 回调执行函数
     * @param data
     */
    apply(data: any): void;
}

interface ISignal<T> {
    readonly active: boolean;
    add(listener: T): void;
    dispatch(...args: any[]): void;
    remove(listener: T): void;
    clear(): void;
}
interface IMessageListener { (): void; }
interface IMessageSignal extends ISignal<IMessageListener> { dispatch: IMessageListener; }
interface IClientCloseListener { (client: ISocketClient): void; }
interface ICLientCloseSignal extends ISignal<IClientCloseListener> { dispatch: IClientCloseListener; }
interface IClientErrorListener { (error:Error): void; }
interface IClientErrorSignal extends ISignal<IClientErrorListener> { dispatch: IClientErrorListener; }
interface IConnectionListener { (client: ISocketClient): void; }
interface IConnectionSignal extends ISignal<IConnectionListener> { dispatch: IConnectionListener; }
interface IServerCloseListener { (): void; }
interface IServerCloseSignal extends ISignal<IServerCloseListener> { dispatch: IServerCloseListener; }
interface IServerErrorListener { (error: Error): void; }
interface IServerErrorSignal extends ISignal<IServerErrorListener> { dispatch: IServerErrorListener; }
interface IHeaderListener { (headers: string[], request: IncomingMessage): void; }
interface IHeaderSignal extends ISignal<IHeaderListener> { dispatch: IHeaderListener; }

interface IWorkerTask {
    readonly id: string;
    readonly args: any;
    readonly name: string;
    readonly delay: number;
    readonly priority: number;
    setName(name: string): void;
    setDelay(delay: number): void;
    setPriority(priority: number): void;
    execute(data: any): void;
}

type thread_result = {
    id: string,
    args: any
}