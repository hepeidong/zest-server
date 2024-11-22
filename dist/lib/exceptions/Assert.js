import { Debug } from "../debug";
import { GetMessageClassException } from "./GetMessageClassException";
import { GetSystemClassException } from "./GetSystemClassException";
const _excetions = {};
export class Assert {
    static handle(exceptionType, condition, message) {
        try {
            const exception = this.getException(exceptionType, condition, message);
            return exception.handle();
        }
        catch (error) {
            Debug.error(error);
            return false;
        }
    }
    static getException(exceptionType, condition, message) {
        const exceptionRef = _excetions[exceptionType];
        const exception = new exceptionRef(message, condition);
        return exception;
    }
}
(function (Assert) {
    let Type;
    (function (Type) {
        Type["GetMessageClassException"] = "GetMessageClassException";
        Type["GetSystemClassException"] = "GetSystemClassException";
    })(Type = Assert.Type || (Assert.Type = {}));
})(Assert || (Assert = {}));
_excetions[Assert.Type.GetMessageClassException] = GetMessageClassException;
_excetions[Assert.Type.GetSystemClassException] = GetSystemClassException;
