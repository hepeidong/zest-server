import { IWorkerTask } from "@types";
import { Debug } from "../../debug";
import { UUID } from "../../utils";


export class WorkerTask implements IWorkerTask {
    private _id: string;
    private _name: string;
    private _delay: number;
    private _priority: number;
    private _method: Function;
    private _caller: any;
    private _args: any[];

    private constructor(caller: any, method: Function, args: any[]) {
        this._caller   = caller;
        this._method   = method;
        this._args     = args;
        this._delay    = 0;
        this._priority = 0;
        this._id       = UUID.randomUUID();
    }

    public get id() { return this._id; }
    public get name() { return this._name; }
    public get delay() { return this._delay; }
    public get priority() { return this._priority; }
    public get args() { return this._args; }

    public static create(caller: any, method: Function, ...args: any[]) {
        return new WorkerTask(caller, method, args);
    }

    public setName(name: string) {
        this._name = name;
    }

    public setDelay(delay: number) {
        this._delay = delay;
    }

    public setPriority(priority: number) {
        if (priority > Number.MAX_VALUE) {
            priority = Number.MAX_VALUE;
        }
        this._priority = priority;
    }

    public execute(data: any) {
        if (typeof this._method === 'function') {
            Debug.log("执行工作线程任务...");
            this._method.apply(this._caller, [data]);
            this._args = undefined;
        }
    }
}