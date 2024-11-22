export class ObjectPool {
    constructor() {
        this._pool = [];
    }
    size() { return this._pool.length; }
    isEmpty() { return this._pool.length === 0; }
    clear() {
        this._pool.splice(0, this._pool.length);
    }
    get() {
        return this._pool.pop();
    }
    put(e) {
        if (e && this._pool.indexOf(e) === -1) {
            this._pool.push(e);
        }
    }
}
