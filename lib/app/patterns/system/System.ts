import { INotification, ISystem } from "@types";
import { WorkerTask } from "../../worker/WorkerTask";
import { Application } from "../application/Application";
import { js } from "../../../decorators";


export class System implements ISystem {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public get name() { return this._name; }

    onStart(): void {
        
    }

    async execute(notification: INotification) {
        return this;
    }

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