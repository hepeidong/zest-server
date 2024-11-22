import { StringUtil } from "../../utils";
export class Notification {
    constructor(client, type, str, system) {
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
    parseData(str) {
        const result = str.split("|");
        let body;
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
    getName() {
        return this._name;
    }
    getSystemName() {
        return this._system;
    }
    setCode(code = 0) {
        this._code = code;
    }
    setData(data) {
        this._data = data;
    }
    getData() {
        return this._data;
    }
    sendData() {
        if (this._client) {
            let str = this._name + "|" + this._code.toString() + "|";
            if (this._dataType == "array" || this._dataType == "object") {
                str += JSON.stringify(this._data);
            }
            else if (this._dataType == "boolean") {
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
    toString() {
        return StringUtil.format("Notification [%s] 数据：%s", this._name, JSON.stringify(this._data));
    }
}
