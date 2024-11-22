import { GetClassException } from "./GetClassException";


export class GetMessageClassException extends GetClassException {
    constructor(message: string, classRef: Function) {
        super(`不存在“${message}”类！`, classRef);
    }
}