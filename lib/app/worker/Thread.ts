import { Worker } from "worker_threads";
import { IHandler, IWorkerTask, thread_result } from "@types";
import { Handler, StringUtil } from "../../utils";
import { Debug } from "../../debug";

// 工作线程的逻辑
export class Thread {
    private _isBusy: boolean; //线程是否处于工作中
    private _worker: Worker;
    private _messageHandler: IHandler;
    private _errorHandler: IHandler;
    private _exitHandler: IHandler;
    constructor(scriptPath: string) {
        this._isBusy = false;
        this._worker = new Worker(scriptPath);
        this._worker.on("message", this.onHandleMessage.bind(this));
        this._worker.on("error", this.onHandleError.bind(this));
        this._worker.on("exit", this.onHandleExit.bind(this));
    }

    public get isBusy() { return this._isBusy; }
    public get threadId() { return this._worker.threadId; }

    public setIsBusy(isBusy: boolean)  { this._isBusy = isBusy; }

    public postMessage(task: IWorkerTask) {
        Debug.log(`开始执行任务${task.name}...`);
        const data = {
            id: task.id,
            name: task.name,
            args: task.args
        }
        this._worker.postMessage(data);
    }

    public stop() {
        if (this._worker) {
            this._worker.terminate();
        }
    }

    public onMessage(callback: (worker: Thread, data: thread_result) => void, caller: any) {
        this._messageHandler = Handler.create(callback, caller);
    }

    public onExit(callback: (worker: Thread, exitCode: number) => void, caller: any) {
        this._exitHandler = Handler.create(callback, caller);
    }

    public onError(callback: (error: Error) => void, caller: any) {
        this._errorHandler = Handler.create(callback, caller);
    }

    private onHandleMessage(data: thread_result) {
        this._messageHandler.apply([this, data]);
    }

    private onHandleExit(exitCode: number) {
        this._exitHandler.apply([this, exitCode]);
    }

    private onHandleError(error: Error) {
        this._errorHandler.apply([error]);
    }
}