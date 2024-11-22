import { IMessage, INotification, ISocketClient, socket_data_type } from "@types";
import { Notification } from "../../observer/Notification";
import { Notifier } from "../../observer/Notifier";
import { Debug } from "../../../debug";


export abstract class Message extends Notifier implements IMessage {
    private _dataType: socket_data_type;
    private _systemName: string;
    private _queue: INotification[];
    constructor() {
        super();
        this._systemName = "";
        this._queue = [];
        this._dataType = this.onCreate();
    }

    /**
     * 在这里返回消息体中数据的类型，即ISocketData结构体中data的数据类型
     * 
     * 和服务器约定，给服务器传输的数据是以‘|’分割开来的字符串或者这种形式的字符串转换后的二进制数据
     * 
     * 数据格式为 “消息名字符串|具体的数据转换后的字符串” 
     * 
     * 当服务器向客户端转发数据时，数据格式为 “消息名字符串|错误码字符串|具体的数据字符串”
     */
    protected abstract onCreate():socket_data_type;

    /**
     * 设置该消息隶属于哪个功能系统模块
     * @param system 功能系统名
     */
    protected setSystem(system: string) {
        this._systemName = system;
    }

    public handle(client: ISocketClient, str: string): void {
        this._queue.push(new Notification(client, this._dataType, str, this._systemName));
        this.asyncHandleMessage();
    }

    private async asyncHandleMessage() {
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
        }catch(error) {
            Debug.error("消息处理错误：", error);
        }finally {
            if (this._queue.length > 0) {
                this.asyncHandleMessage();
            }
        }
    }
}