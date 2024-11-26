import { IApplication, INotification, INotifier } from "@types";
import { Application } from "../patterns/application/Application";

export class Notifier implements INotifier {
	private app: IApplication = null;
    constructor() {
        this.app = Application.getInstance();
    }
	
    public sendNotice(notification: INotification): void {
        this.app.sendNotice(notification);
    }
}