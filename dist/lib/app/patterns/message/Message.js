var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Notification } from "../../observer/Notification";
import { Notifier } from "../../observer/Notifier";
import { Debug } from "../../../debug";
export class Message extends Notifier {
    constructor() {
        super();
        this._systemName = "";
        this._queue = [];
        this._dataType = this.onCreate();
    }
    /**
     * 设置该消息隶属于哪个功能系统模块
     * @param system 功能系统名
     */
    setSystem(system) {
        this._systemName = system;
    }
    handle(client, str) {
        this._queue.push(new Notification(client, this._dataType, str, this._systemName));
        this.asyncHandleMessage();
    }
    asyncHandleMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this._queue.shift();
                //对于没有设置依赖的功能系统，直接发回客户端，一般是像心跳这类消息会直接转发回客户端
                if (this._systemName.length === 0) {
                    data.setCode();
                    data.sendData();
                }
                else {
                    this.sendNotice(data);
                }
                //调用系统模块的代码处理消息
            }
            catch (error) {
                Debug.error("消息处理错误：", error);
            }
            finally {
                if (this._queue.length > 0) {
                    this.asyncHandleMessage();
                }
            }
        });
    }
}
