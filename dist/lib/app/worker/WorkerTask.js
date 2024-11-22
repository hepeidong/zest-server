import { Debug } from "../../debug";
import { UUID } from "../../utils";
export class WorkerTask {
    constructor(caller, method, args) {
        this._caller = caller;
        this._method = method;
        this._args = args;
        this._delay = 0;
        this._priority = 0;
        this._id = UUID.randomUUID();
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get delay() { return this._delay; }
    get priority() { return this._priority; }
    get args() { return this._args; }
    static create(caller, method, ...args) {
        return new WorkerTask(caller, method, args);
    }
    setName(name) {
        this._name = name;
    }
    setDelay(delay) {
        this._delay = delay;
    }
    setPriority(priority) {
        if (priority > Number.MAX_VALUE) {
            priority = Number.MAX_VALUE;
        }
        this._priority = priority;
    }
    execute(data) {
        if (typeof this._method === 'function') {
            Debug.log("执行工作线程任务...");
            this._method.apply(this._caller, [data]);
            this._args = undefined;
        }
    }
}
