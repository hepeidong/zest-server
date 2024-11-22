export class Observer {
    constructor(notifyMethod, notifyContext) {
        this.notify = null;
        this.context = null;
        this.setNotifyMethod(notifyMethod);
        this.setNotifyContext(notifyContext);
    }
    getNotifyMethod() {
        return this.notify;
    }
    setNotifyMethod(notifyMethod) {
        this.notify = notifyMethod;
    }
    getNotifyContext() {
        return this.context;
    }
    setNotifyContext(notifyContext) {
        this.context = notifyContext;
    }
    notifyObserver(notification) {
        this.getNotifyMethod().call(this.getNotifyContext(), notification);
    }
    compareNotifyContext(object) {
        return object === this.context;
    }
}
