import { Exception } from "./Exception";
export class GetClassException extends Exception {
    constructor(message, classRef) {
        super(`${message}\n请检查该类是否使用ccsclass装饰器进行装饰。`);
        this._classRef = classRef;
    }
    handle() {
        if (typeof this._classRef === "function") {
            return true;
        }
        throw new Error(this.toString());
    }
}
