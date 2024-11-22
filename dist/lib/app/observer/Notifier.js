import { Application } from "../patterns/application/Application";
export class Notifier {
    constructor() {
        this.app = null;
        this.app = Application.getInstance();
    }
    sendNotice(notification) {
        this.app.sendNotice(notification);
    }
}
