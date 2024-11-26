import { ISocketClient } from "@types";
import { Application, Debug, tssclass } from "@tsss";
import { EventEnum } from "./message/EventEnum";
import { createConnection } from "mysql";
import { config } from "../config";


@tssclass("GameServer")
export class GameServer extends Application {

    /**
     * 服务器启动完成
     * @returns 返回服务器消息协议的类型
     */
    protected startup() {
        // this.testDatabase();
        this.cteateConnection();
        return Application.ProtocolType.ARRAY_BUFFER; 
    }

    private testDatabase() {
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
    protected onConnect(socketClient: ISocketClient) {
        socketClient.onHeartbeat(EventEnum.HEARTBEAT, 15);
    }
    /**服务器关闭时的回调 */
    protected onClose() {}
    protected onHeaders(headers: string[], request: WebSocket) {}
    /**
     * 服务器发生错误时的回调
     * @param error 错误信息
     */
    protected onError(error: Error) {}
}