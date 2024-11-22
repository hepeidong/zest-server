var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Application, tssclass } from "../lib";
import { EventEnum } from "./message/EventEnum";
let MyGameServer = class MyGameServer extends Application {
    startup() {
        return Application.ProtocolType.ARRAY_BUFFER;
    }
    onConnect(socketClient) {
        socketClient.onHeartbeat(EventEnum.HEARTBEAT, 15);
    }
};
MyGameServer = __decorate([
    tssclass("MyGameServer")
], MyGameServer);
export { MyGameServer };
