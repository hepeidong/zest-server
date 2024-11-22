import { ISocketClient } from "@types";
import { Application, tssclass } from "@tsss";
import { EventEnum } from "./message/EventEnum";

@tssclass("GameServer")
export class GameServer extends Application {

    /**
     * 服务器启动完成
     * @returns 返回服务器消息协议的类型
     */
    protected startup() {
        return Application.ProtocolType.ARRAY_BUFFER;
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