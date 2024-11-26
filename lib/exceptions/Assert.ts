import { Constructor } from "@types";
import { js } from "../decorators";
import { Debug } from "../debug";
import { Exception } from "./Exception";
import { GetMessageClassException } from "./GetMessageClassException";
import { GetSystemClassException } from "./GetSystemClassException";
import { GetModelClassException } from "./GetModelClassException";

const _excetions = {}

export class Assert {
    public static handle(exceptionType: string, condition: any, message?: string) {
        try {
            const exception = this.getException(exceptionType, condition, message);
            return exception.handle();
        } catch (error) {
            Debug.error(error);
            return false;
        }
    }

    private static getException(exceptionType: string, condition: any, message?: string) {
        const exceptionRef = _excetions[exceptionType] as Constructor;
        const exception = new exceptionRef(message, condition);
        return exception as Exception;
    }
}


export namespace Assert {
    export enum Type {
        GetMessageClassException = "GetMessageClassException",
        GetSystemClassException = "GetSystemClassException",
        GetModelClassException = "GetModelClassException"
    }
}

_excetions[Assert.Type.GetMessageClassException] = GetMessageClassException;
_excetions[Assert.Type.GetSystemClassException] = GetSystemClassException;
_excetions[Assert.Type.GetModelClassException] = GetModelClassException;