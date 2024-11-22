import { tssclass, System, Debug } from "@tsss";
import { SystemEnum } from "./SystemEnum";
import { INotification } from "@types";

@tssclass(SystemEnum.TestSystem)
export class TestSystem extends System {

    onStart(): void {
        
    }

    private testThread(result: any) {
        Debug.log("这是一个测试线程任务", result);
    }

    async execute(notification: INotification): Promise<this> {
        Debug.log(notification.toString());
        notification.setCode();
        notification.sendData();
        // return this.schedule(this.testThread, 0, 100, 200).dispatch();
        return this;
    }
}