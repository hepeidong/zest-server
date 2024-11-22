import { isArray, isNull, isUndefined } from "./TypeUtil";
/**
 * 回调处理类
 */
export class Handler {
    constructor(caller, method, args, once = false) {
        this._id = ++Handler.creatorIdx === Number.MAX_VALUE ? 0 : Handler.creatorIdx;
        this._caller = caller;
        this._method = method;
        this._args = args;
        this._once = once;
    }
    /**
     *创建回调处理类对象
     * @param method 回调函数
     * @param caller 执行域
     * @param args 参数
     * @param once
     * @returns Handler
     */
    static create(method, caller, args, once = false) {
        return new Handler(caller, method, args, once);
    }
    /**
     * 回调执行函数
     * @param data
     * @returns any
     */
    apply(data) {
        if (typeof this._method === 'function') {
            if (isNull(data) || isUndefined(data)) {
                if (this._caller) {
                    this._method.apply(this._caller, this._args);
                }
                else {
                    this._method(...this._args);
                }
            }
            else if (isArray(this._args)) {
                if (this._caller) {
                    this._method.apply(this._caller, this._args.concat(data));
                }
                else {
                    this._method(...this._args);
                }
            }
            else if (isNull(this._args) || isUndefined(this._args)) {
                if (this._caller) {
                    this._method.apply(this._caller, data);
                }
                else {
                    if (isArray(data)) {
                        this._method(...data);
                    }
                    else {
                        this._method(data);
                    }
                }
            }
        }
    }
    get id() { return this._id; }
    get once() { return this._once; }
    get method() { return this._method; }
    get caller() { return this._caller; }
}
Handler.creatorIdx = 0;
