
import mysql from "mysql";
import { js } from "../../decorators";
import { Assert } from "../../exceptions/Assert";
import { Model } from "../patterns/model/Model";
import { ObjectPool } from "../../utils";
import { IModel, IModelProcessor } from "@types";
import { Debug } from "../../debug";

export class ModelProcessor implements IModelProcessor {
    private _pool: mysql.Pool;
    private _poolMap: Map<string, ObjectPool<IModel>>;
    constructor() {
        this._poolMap = new Map();
    }

    private static _instance: IModelProcessor;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new ModelProcessor();
        }
        return this._instance;
    }

    public createConnection(config: mysql.PoolConfig) {
        this._pool = mysql.createPool(config);
    }

    public connetion() {
        return new Promise<mysql.PoolConnection>((resolve, reject) => {
            this._pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        });
    }

    public getModel<T extends IModel>(model: string, _type: new () => T): T {
        if (this._poolMap.has(model)) {
            const pool = this._poolMap.get(model);
            if (pool.isEmpty()) {
                return this.cerateModel(model) as T;
            }
            else {
                const obj = pool.get() as T;
                obj.init(model);
                return obj;
            }
        }
        else {
            this._poolMap.set(model, new ObjectPool());
            return this.cerateModel(model) as T;
        }
    }

    public putModel(model: IModel) {
        if (this._poolMap.has(model.name)) {
            this._poolMap.get(model.name).put(model);
        }
        else {
            Debug.error(`错误，缺少‘${model.name}’对象池！`);
        }
    }

    private cerateModel(model: string): IModel {
        const classRef = js.getClassByName(model);
        if (Assert.handle(Assert.Type.GetModelClassException, classRef, `‘${model}’模型`)) {
            const obj = new classRef() as Model<any>;
            obj.init(model);
            return obj;
        }
        return null;
    }
}