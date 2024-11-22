var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WorkerTask } from "../../worker/WorkerTask";
import { Application } from "../application/Application";
import { js } from "../../../decorators";
export class System {
    constructor(name) {
        this._name = name;
    }
    get name() { return this._name; }
    onStart() {
    }
    execute(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
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
    schedule(taskCallback, priority, ...args) {
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
    scheduleDelay(taskCallback, delay, ...args) {
        const task = WorkerTask.create(this, taskCallback, ...args);
        task.setName(js.getClassName(taskCallback));
        task.setDelay(delay);
        Application.getInstance().addTask(task);
        return this;
    }
    /**开始分配任务 */
    dispatch() {
        Application.getInstance().dispatchTasks();
        return this;
    }
}
