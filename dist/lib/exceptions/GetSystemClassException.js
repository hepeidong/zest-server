import { GetClassException } from "./GetClassException";
export class GetSystemClassException extends GetClassException {
    constructor(message, classRef) {
        super(`不存在“${message}”类！`, classRef);
    }
}
