import { js } from "../../decorators";
import { Assert } from "../../exceptions/Assert";
export class MessageProcessor {
    constructor() {
        if (MessageProcessor._instance) {
            throw Error(MessageProcessor.SINGLETON_MSG);
        }
        this._messageMap = new Map();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new MessageProcessor();
        }
        return this._instance;
    }
    /**
     *
     * 和客户端约定，给服务器传输的数据是以‘|’分割开来的字符串或者这种形式的字符串转换后的二进制数据
     *
     * 数据格式为 “消息名字符串|错误码字符串|具体的数据转换后的字符串”
     *
     * 当客户端向服务器转发数据时，数据格式为 “消息名字符串|具体的数据字符串”
     */
    handleMessage(client, str) {
        const proxyName = str.split("|")[0];
        if (this._messageMap.has(proxyName)) {
            const message = this._messageMap.get(proxyName);
            message.handle(client, str);
        }
        else {
            this.registerMessage(client, str);
        }
    }
    registerMessage(client, str) {
        const proxyName = str.split("|")[0];
        const classRef = js.getClassByName(proxyName);
        if (Assert.handle(Assert.Type.GetMessageClassException, classRef, `‘${proxyName}’消息`)) {
            const message = new classRef();
            this._messageMap.set(proxyName, message);
            message.handle(client, str);
        }
    }
}
MessageProcessor.SINGLETON_MSG = "MessageProcessor singleton already constructed!";
