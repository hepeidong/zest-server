import { IHandler, ISignal } from "@types";
import { Handler } from "./Handler";

export class Signal<T extends Function = Function> implements ISignal<T> {
    private _handlers: IHandler[];
    constructor() {
        this._handlers = [];
    }

    public get active(): boolean { return this._handlers.length > 0; }

    public add(listener: T): void {
        this._handlers.push(Handler.create(listener));
    }

    public dispatch(...args: any[]): void {
        this._handlers.forEach(handle => {
            handle.apply(args);
        });
    }

    public remove(listener: T): void {
        const result = this._handlers.filter(handle => { return handle.method === listener; });
        for (const handle of result) {
            const index = this._handlers.indexOf(handle);
            if (index > -1) {
                this._handlers.splice(index, 1);
            }
        }
    }

    public clear(): void {
        this._handlers.splice(0, this._handlers.length);
    }
}