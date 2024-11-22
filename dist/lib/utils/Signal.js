import { Handler } from "./Handler";
export class Signal {
    constructor() {
        this._handlers = [];
    }
    get active() { return this._handlers.length > 0; }
    add(listener) {
        this._handlers.push(Handler.create(listener));
    }
    dispatch(...args) {
        this._handlers.forEach(handle => {
            handle.apply(args);
        });
    }
    remove(listener) {
        const result = this._handlers.filter(handle => { return handle.method === listener; });
        for (const handle of result) {
            const index = this._handlers.indexOf(handle);
            if (index > -1) {
                this._handlers.splice(index, 1);
            }
        }
    }
    clear() {
        this._handlers.splice(0, this._handlers.length);
    }
}
