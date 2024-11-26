import { IProtocol } from "@types";

export class JsonPprotocol implements IProtocol {

    public encode(str: string) {
        return str;
    }

    public decode(data: string): string {
        return data;
    }
}