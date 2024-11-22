import { IHandler } from "@types";
import { isArray, isNull, isUndefined } from "./TypeUtil";

/**
 * 回调处理类
 */
export class Handler implements IHandler {
    private static creatorIdx: number = 0;
    private _id: number;
    /** 回调函数 */
    private _method: Function;
    /** 是否只执行一次 */
    private _once: boolean;
    /** 回掉函数的参数 */
    private _args: any[];
    /** 执行域 */
    private _caller: any;

    private constructor(caller: any, method: Function, args?:  any[], once: boolean = false) {
        this._id     = ++Handler.creatorIdx === Number.MAX_VALUE ? 0 : Handler.creatorIdx;
        this._caller = caller;
        this._method = method;
        this._args   = args;
        this._once   = once;
    }

    /**
     *创建回调处理类对象
     * @param method 回调函数
     * @param caller 执行域
     * @param args 参数
     * @param once
     * @returns Handler
     */
    public static create(method: Function, caller?: any, args?:  any[], once: boolean = false): IHandler {
        return new Handler(caller, method, args, once);
    }

    /**
     * 回调执行函数
     * @param data
     * @returns any
     */
    public apply(data: any): void {
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

    public get id() { return this._id; }
    public get once(): boolean { return this._once; }
    public get method(): Function { return this._method; }
    public get caller(): any { return this._caller; }
}
