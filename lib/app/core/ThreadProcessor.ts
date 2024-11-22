import OS from "os";
import { PriorityQueue } from "../../utils/PriorityQueue";
import { Thread } from "../worker/Thread";
import { Debug } from "../../debug";
import { IWorkerTask, thread_result } from "@types";
import { join } from "path";



export class ThreadProcessor {
    private _scriptPath: string;
    private _workerTasks: PriorityQueue<IWorkerTask>; //待完成的任务队列
    private _awaitQueue: PriorityQueue<IWorkerTask>; //因所有线程都处于工作中，导致无法及时被执行的任务队列
    private _runningTasks: Map<string, IWorkerTask>;
    private _workers: Set<Thread>; //存活的工作线程集合
    private _maxWorkers: number; //最大工作线程数

    constructor() {
        this._workerTasks  = new PriorityQueue((a, b) => a.priority > b.priority);
        this._awaitQueue   = new PriorityQueue((a, b) => a.priority > b.priority);
        this._runningTasks = new Map();
        this._workers      = new Set();
        this._maxWorkers   = OS.cpus().length;
        this._scriptPath   = join(this.getRootPath(), "lib/app/worker/WorkerThread.js");
    }

    private static _instance: ThreadProcessor;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new ThreadProcessor();
        }
        return this._instance;
    }

    private getRootPath() {
        //E:\游戏服务器\node\MyServer\dist\lib\app\core
        const p = OS.platform();
        let rootPath = "";
        if (p === "darwin") {
            const result = __dirname.split("/");
            //目录只保留从根目录到dist的目录
            result.pop();
            result.pop();
            result.pop();
            rootPath = result.join("/");
        }
        else if (p === "win32") {
            const result = __dirname.split("\\");
            //目录只保留从根目录到dist的目录
            result.pop();
            result.pop();
            result.pop();
            rootPath = result.join("\\");
        }
        return rootPath;
    }

    // 添加任务到队列
    public addTask(task: IWorkerTask) {
        this._workerTasks.push(task);
        if (this._workers.size < this._maxWorkers) {
            const worker = this.createWorker();
            this._workers.add(worker);
        }
    }

    // 分发任务
    public dispatchTasks() {
        while(this._workerTasks.length > 0) {
            const task = this._workerTasks.pop();
            if (task.delay > 0) {
                setTimeout(() => this.dispatch(task), task.delay * 1000);
            }
            else {
                this.dispatch(task);
            }
        }
    }

    private dispatch(task: IWorkerTask) {
        const worker = [...this._workers].find(worker => !worker.isBusy);
        if (worker) {
            this._runningTasks.set(task.id, task);
            worker.setIsBusy(true);
            worker.postMessage(task);
        } else {
            this._awaitQueue.push(task); //所有工作线程都忙，任务将在队列中等待
        }
    }

    // 创建工作线程执行任务
    private createWorker() {
        const worker = new Thread(this._scriptPath); // 使用当前文件作为工作线程的脚本
        worker.setIsBusy(false);
        worker.onMessage(this.onWorkerMessageHandle, this);
        worker.onExit(this.onWorkerExitHandle, this);
        worker.onError(this.onWorkerErrorHandle, this);
        return worker;
    }

    private onWorkerExitHandle(worker: Thread, exitCode: number) {
        Debug.log(`线程退出，退出码${exitCode}。`);
        this._workers.delete(worker);
    }

    private onWorkerMessageHandle(worker: Thread, data: thread_result|string) {
        worker.setIsBusy(false);
        worker.stop();//执行完后的线程必须要及时关闭，否则会造成阻塞
        if (typeof data === "string") {
            if (data === "no-threadFile") {
                Debug.error("线程异常终止，原因是找不到相应的执行脚本！");
            }
        }
        else {
            if (this._runningTasks.has(data.id)) {
                const task = this._runningTasks.get(data.id);
                task.execute(data.args);
                Debug.log(`任务${task.name}执行完毕！`);
                this._runningTasks.delete(data.id);
            }
            else {
                Debug.error("线程发生未知错误！");
            }
            if (this._awaitQueue.length > 0) {
                const task = this._awaitQueue.pop();
                this.dispatch(task);
            }
        }
    }

    private onWorkerErrorHandle(error: Error) {
        Debug.error("线程执行错误：", error);
    }
}