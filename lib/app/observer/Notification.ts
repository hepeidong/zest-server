import { INotification, ISocketClient, socket_data_type } from "@types";
import { StringUtil } from "../../utils";

export class Notification implements INotification {
    private _client: ISocketClient;
    private _dataType: socket_data_type;
    private _name: string;
    private _code: number;
    private _data: any;
    private _system: string;
    constructor(client: ISocketClient, type: socket_data_type, str: string, system: string) {
        this._client = client;
        this._dataType = type;
        this._system = system;
        this.parseData(str);
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
    private parseData(str: string) {
        const result = str.split("|");
        let body: any;
        if (this._dataType == "array" || this._dataType == "object") {
            body = JSON.parse(result[1]);
        }
        else if (this._dataType == "boolean") {
            if (result[1] == "true") {
                body = true;
            }
            else if (result[1] == "false") {
                body = false;
            }
        }
        else if (this._dataType == "float") {
            body = parseFloat(result[1]);
        }
        else if (this._dataType == "int") {
            body = parseInt(result[1]);
        }
        else {
            body = result[1];
        }
        this._name = result[0];
        this._data = body;
    }

    public getName(): string {
        return this._name;
    }

    public getSystemName() {
        return this._system;
    }

    public setCode(code: number = 0): void {
        this._code = code;
    }

    public setData(data: any): void {
        this._data = data;
    }

    public getData(): any {
        return this._data;
    }

    public sendData(): void {
        if (this._client) {
            let str = this._name + "|" + this._code.toString() + "|";
            if (this._dataType == "array" || this._dataType == "object") {
                str += JSON.stringify(this._data);
            }
            else if(this._dataType == "boolean") {
                str += this._data ? "true" : "false";
            }
            else if (this._dataType == "int" || this._dataType == "float") {
                str += this._data.toString();
            }
            else {
                str += this._data;
            }
            //当服务器向客户端转发数据时，数据格式为 “消息名字符串|错误码字符串|具体的数据字符串”
            this._client.send(str);
        }
    }

    public toString(): string {
        return StringUtil.format("Notification [%s] 数据：%s", this._name, JSON.stringify(this._data));
    }
}