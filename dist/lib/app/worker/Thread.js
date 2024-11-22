import { Worker } from "worker_threads";
import { Handler } from "../../utils";
import { Debug } from "../../debug";
// 工作线程的逻辑
export class Thread {
    constructor(scriptPath) {
        this._isBusy = false;
        this._worker = new Worker(scriptPath);
        this._worker.on("message", this.onHandleMessage.bind(this));
        this._worker.on("error", this.onHandleError.bind(this));
        this._worker.on("exit", this.onHandleExit.bind(this));
    }
    get isBusy() { return this._isBusy; }
    get threadId() { return this._worker.threadId; }
    setIsBusy(isBusy) { this._isBusy = isBusy; }
    postMessage(task) {
        Debug.log(`开始执行任务${task.name}...`);
        const data = {
            id: task.id,
            name: task.name,
            args: task.args
        };
        this._worker.postMessage(data);
    }
    stop() {
        if (this._worker) {
            this._worker.terminate();
        }
    }
    onMessage(callback, caller) {
        this._messageHandler = Handler.create(callback, caller);
    }
    onExit(callback, caller) {
        this._exitHandler = Handler.create(callback, caller);
    }
    onError(callback, caller) {
        this._errorHandler = Handler.create(callback, caller);
    }
    onHandleMessage(data) {
        this._messageHandler.apply([this, data]);
    }
    onHandleExit(exitCode) {
        this._exitHandler.apply([this, exitCode]);
    }
    onHandleError(error) {
        this._errorHandler.apply([error]);
    }
}
