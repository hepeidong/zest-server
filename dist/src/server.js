var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Application, Debug, tssclass } from "../lib";
import { EventEnum } from "./message/EventEnum";
import { createConnection } from "mysql";
import { config } from "../config";
let GameServer = class GameServer extends Application {
    /**
     * 服务器启动完成
     * @returns 返回服务器消息协议的类型
     */
    startup() {
        // this.testDatabase();
        this.cteateConnection();
        return Application.ProtocolType.ARRAY_BUFFER;
    }
    testDatabase() {
        //连接数据库
        const connection = createConnection(config.database);
        connection.connect((err) => {
            if (err) {
                Debug.error("数据库连接失败：", err);
                return;
            }
            Debug.log("数据库连接成功！");
        });
        const sql1 = `INSERT INTO user(userId, userName, userLevel, exp) VALUE(1001, "张三", 20, 202400)`;
        const sql2 = `SELECT userId FROM user`;
        connection.query(sql1, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(result);
        });
        connection.end();
    }
    /**
     * 发生客户端连接服务器时的回调
     * @param socketClient 连接服务器的客户端
     */
    onConnect(socketClient) {
        socketClient.onHeartbeat(EventEnum.HEARTBEAT, 15);
    }
    /**服务器关闭时的回调 */
    onClose() { }
    onHeaders(headers, request) { }
    /**
     * 服务器发生错误时的回调
     * @param error 错误信息
     */
    onError(error) { }
};
GameServer = __decorate([
    tssclass("GameServer")
], GameServer);
export { GameServer };
