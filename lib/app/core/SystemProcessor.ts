import { INotification, IObserver, ISystem, ISystemProcessor } from "@types";
import { Observer } from "../observer/Observer";
import { ObjectPool } from "../../utils";
import { js } from "../../decorators";
import { Debug } from "../../debug";
import { Assert } from "../../exceptions/Assert";


export class SystemProcessor implements ISystemProcessor {
    private _observerMap: Map<string, IObserver>;
    private _poolMap: Map<string, ObjectPool<ISystem>>;
    constructor() {
        if (SystemProcessor._instance) {
            throw Error(SystemProcessor.SINGLETON_MSG);
        }
        this._observerMap = new Map();
        this._poolMap = new Map();
    }

    private static _instance: ISystemProcessor;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new SystemProcessor();
        }
        return this._instance;
    }

    public sendNotice(notification: INotification) {
        const name = notification.getName();
        let observer: IObserver;
        if (this._observerMap.has(name)) {
            observer = this._observerMap.get(name);
        }
        else {
            this.registerObserver(notification);
            observer = this._observerMap.get(name);
        }
        observer.notifyObserver(notification);
    }

    private registerObserver(notification: INotification) {
        this._observerMap.set(notification.getName(), new Observer(this.executeSystem, this));
    }

    private executeSystem(notification: INotification) {
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
            const pool: ObjectPool<ISystem> = new ObjectPool();
            this._poolMap.set(systemName, pool);
            this.createSystem(systemName, notification);
        }
    }

    private createSystem(systemName: string, notification: INotification) {
        const classRef = js.getClassByName(systemName);
        if (Assert.handle(Assert.Type.GetSystemClassException, classRef, `‘${systemName}’系统`)) {
            const system = new classRef(systemName) as ISystem;
            this.execute(system, notification);
        }
    }

    private execute(system: ISystem, notification: INotification) {
        system.onStart();
        system.execute(notification).then(sys => {
            this._poolMap.get(sys.name).put(sys);
        }).catch(error => {
            Debug.error(error);
        });
    }

    private static SINGLETON_MSG: string = "SystemProcessor singleton already constructed!";
}