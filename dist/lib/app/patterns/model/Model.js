var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Application } from "../application/Application";
/**
 * 作者：何沛东
 *
 * 描述：管理数据缓存和操作，子类继承该类，保存对数据库数据的操作行为.
 *
 * 一个 Model 类就负责对一张数据表的操作。
 */
export class Model {
    constructor() { }
    get name() { return this._name; }
    get sql() { return this["_sqlMap"]; }
    init(name) {
        this._name = name;
        this.onCreate();
    }
    remove() {
        this.onRemove();
    }
    query(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield Application.getInstance().connection();
            const result = yield new Promise((resolve, reject) => {
                connection.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
            return result;
        });
    }
    /**数据库表模型被调用时，该函数会在其它函数之前被调用 */
    onCreate() { }
    /**数据库表模型被移除时，该函数会被调用，数据库表每次使用后，随着功能系统被关闭，该函数就会被调用 */
    onRemove() { }
}
