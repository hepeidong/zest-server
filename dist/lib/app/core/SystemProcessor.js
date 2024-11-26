import { Observer } from "../observer/Observer";
import { ObjectPool } from "../../utils";
import { js } from "../../decorators";
import { Debug } from "../../debug";
import { Assert } from "../../exceptions/Assert";
export class SystemProcessor {
    constructor() {
        if (SystemProcessor._instance) {
            throw Error(SystemProcessor.SINGLETON_MSG);
        }
        this._observerMap = new Map();
        this._poolMap = new Map();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new SystemProcessor();
        }
        return this._instance;
    }
    sendNotice(notification) {
        const name = notification.getName();
        let observer;
        if (this._observerMap.has(name)) {
            observer = this._observerMap.get(name);
        }
        else {
            this.registerObserver(notification);
            observer = this._observerMap.get(name);
        }
        observer.notifyObserver(notification);
    }
    registerObserver(notification) {
        this._observerMap.set(notification.getName(), new Observer(this.executeSystem, this));
    }
    executeSystem(notification) {
        const systemName = notification.getSystemName();
        if (this._poolMap.has(systemName)) {
            const pool = this._poolMap.get(systemName);
            if (pool.isEmpty()) {
                this.createSystem(systemName, notification);
            }
            else {
                const system = pool.get();
                this.execute(system, notification);
            }
        }
        else {
            this._poolMap.set(systemName, new ObjectPool());
            this.createSystem(systemName, notification);
        }
    }
    createSystem(systemName, notification) {
        const classRef = js.getClassByName(systemName);
        if (Assert.handle(Assert.Type.GetSystemClassException, classRef, `‘${systemName}’系统`)) {
            const system = new classRef(systemName);
            this.execute(system, notification);
        }
    }
    execute(system, notification) {
        system.open();
        system.execute(notification).then(sys => {
            sys.remove();
            this._poolMap.get(sys.name).put(sys);
        }).catch(error => {
            Debug.error(error);
        });
    }
}
SystemProcessor.SINGLETON_MSG = "SystemProcessor singleton already constructed!";
