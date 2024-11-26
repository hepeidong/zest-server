import { QueryOptions } from "mysql";
import { Application } from "../application/Application";
import { IModel } from "@types";

/**
 * 作者：何沛东
 * 
 * 描述：管理数据缓存和操作，子类继承该类，保存对数据库数据的操作行为.
 *  
 * 一个 Model 类就负责对一张数据表的操作。
 */
export class Model<SQL_T> implements IModel {
    private _name: string;
    constructor() {}

    public get name() { return this._name; }
    protected get sql(): SQL_T { return this["_sqlMap"]; }

    public init(name: string) {
        this._name = name;
        this.onCreate();
    }

    public remove() {
        this.onRemove();
    }

    protected async query(sql: string|QueryOptions) {
        const connection = await Application.getInstance().connection();
        const result = await new Promise<any>((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
        return result;
    }

    /**数据库表模型被调用时，该函数会在其它函数之前被调用 */
    protected onCreate() {}
    /**数据库表模型被移除时，该函数会被调用，数据库表每次使用后，随着功能系统被关闭，该函数就会被调用 */
    protected onRemove() {}
}