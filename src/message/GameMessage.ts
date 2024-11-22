import { tssclass, Message } from "@tsss";
import { EventEnum } from "./EventEnum";
import { SystemEnum } from "../system/SystemEnum";
import { socket_data_type } from "@types";


@tssclass(EventEnum.HEARTBEAT)
export class HeartbeatMessage extends Message {
    protected onCreate(): socket_data_type {
        return "int";
    }
}

@tssclass(EventEnum.TEST_MESSAGE)
export class TestMessage extends Message {
    constructor() {
        super();
        this.setSystem(SystemEnum.TestSystem);
    }
    
    protected onCreate(): socket_data_type {
        return "object";
    }
}