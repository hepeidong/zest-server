import mysql from "mysql";
import { js } from "../../decorators";
import { Assert } from "../../exceptions/Assert";
import { ObjectPool } from "../../utils";
import { Debug } from "../../debug";
export class ModelProcessor {
    constructor() {
        this._poolMap = new Map();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new ModelProcessor();
        }
        return this._instance;
    }
    createConnection(config) {
        this._pool = mysql.createPool(config);
    }
    connetion() {
        return new Promise((resolve, reject) => {
            this._pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        });
    }
    getModel(model, _type) {
        if (this._poolMap.has(model)) {
            const pool = this._poolMap.get(model);
            if (pool.isEmpty()) {
                return this.cerateModel(model);
            }
            else {
                const obj = pool.get();
                obj.init(model);
                return obj;
            }
        }
        else {
            this._poolMap.set(model, new ObjectPool());
            return this.cerateModel(model);
        }
    }
    putModel(model) {
        if (this._poolMap.has(model.name)) {
            this._poolMap.get(model.name).put(model);
        }
        else {
            Debug.error(`错误，缺少‘${model.name}’对象池！`);
        }
    }
    cerateModel(model) {
        const classRef = js.getClassByName(model);
        if (Assert.handle(Assert.Type.GetModelClassException, classRef, `‘${model}’模型`)) {
            const obj = new classRef();
            obj.init(model);
            return obj;
        }
        return null;
    }
}
