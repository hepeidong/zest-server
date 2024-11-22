
export class ObjectPool<T> {
    private _pool: T[];
    constructor() {
        this._pool = [];
    }


    public size(): number { return this._pool.length; }
    public isEmpty(): boolean { return this._pool.length === 0; }

    public clear() {
        this._pool.splice(0, this._pool.length);
    }

    public get() {
        return this._pool.pop();
    }

    public put(e: T) {
        if (e && this._pool.indexOf(e) === -1) {
            this._pool.push(e);
        }
    }
}