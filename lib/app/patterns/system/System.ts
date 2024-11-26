import { IModel, INotification, ISystem } from "@types";
import { WorkerTask } from "../../worker/WorkerTask";
import { Application } from "../application/Application";
import { js } from "../../../decorators";


export class System implements ISystem {
    private _name: string;
    private _cacheModel: Map<string, IModel>;
    constructor(name: string) {
        this._name = name;
        this._cacheModel = new Map();
    }

    public get name() { return this._name; }

    public open(): void {
        this.onStart();
    }

    public remove(): void {
        this._cacheModel.forEach(model => {
            Application.getInstance().putModel(model);
        });
        this._cacheModel.clear();
        this.onClose();
    }

    public async execute(notification: INotification) {
        return this;
    }

    /**
     * 获取数据库表操作模型
     * @param model 
     * @param type 
     * @returns 
     */
    protected getModel<T extends IModel>(model: string, type: new() => T): T {
        const obj = Application.getInstance().getModel(model, type);
        if (!this._cacheModel.has(obj.name)) {
            this._cacheModel.set(obj.name, obj);
        }
        return obj;
    }

    /**是生命周期函数，功能系统开始执行前调用，在execute之前被调用，可以在这里做一些必要的初始化，每次功能系统被执行前都会调用此函数 */
    protected onStart(): void {}
    /**是生命周期函数，系统执行完后会自动调用该接口 */
    protected onClose(): void {}

    /**
     * 增加一个工作线程执行任务。该函数会开启一个线程，用于执行调度任务。
     * 
     * 应该知道，线程应用于计算量大的任务，如某些数学运算。如果是IO操作，则不需要用多线程，且线程并非越多越好。
     * 
     * @param taskCallback 任务的执行函数
     * @param priority 优先级，数值越大，优先级越高，就越早被执行
     * @param args 传入的taskCallback的参数
     */
    protected schedule(taskCallback: Function, priority: number, ...args: any[]) {
        const task = WorkerTask.create(this, taskCallback, ...args);
        task.setName(js.getClassName(taskCallback));
        task.setPriority(priority);
        Application.getInstance().addTask(task);
        return this;
    }

    /**
     * 增加一个可被延迟执行的任务。该函数会开启一个线程，用于执行调度任务。
     * 
     * 应该知道，线程应用于计算量大的任务，如某些数学运算。如果是IO操作，则不需要用多线程，且线程并非越多越好。
     * 
     * @param taskCallback 任务的执行函数
     * @param delay 延迟多少秒执行
     * @param args 传入的taskCallback的参数
     */
    protected scheduleDelay(taskCallback: Function, delay: number, ...args: any[]) {
        const task = WorkerTask.create(this, taskCallback, ...args);
        task.setName(js.getClassName(taskCallback));
        task.setDelay(delay);
        Application.getInstance().addTask(task);
        return this;
    }

    /**开始分配任务 */
    protected dispatch() {
        Application.getInstance().dispatchTasks();
        return this;
    }
}