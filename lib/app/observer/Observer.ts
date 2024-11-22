import { INotification, IObserver } from "@types";

export class Observer implements IObserver {
	private notify: Function = null;
	private context: any = null;
	
	constructor(notifyMethod: Function, notifyContext: any) {
		this.setNotifyMethod(notifyMethod);
		this.setNotifyContext( notifyContext);
	}
	
	private getNotifyMethod(): Function {
		return this.notify;
	}
	
	private setNotifyMethod(notifyMethod:Function): void {
		this.notify = notifyMethod;
	}
	
	private getNotifyContext(): any {
		return this.context;
	}
		
	private setNotifyContext(notifyContext:any): void {
		this.context = notifyContext;
	}
	
	public notifyObserver(notification: INotification): void {
		this.getNotifyMethod().call(this.getNotifyContext(), notification);
	}

    public compareNotifyContext(object:any): boolean {
	 	return object === this.context;
	 }		
}