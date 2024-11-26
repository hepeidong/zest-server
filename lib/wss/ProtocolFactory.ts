import { Application } from "../app";
import { BinaryProtocol } from "./BinaryProtocol";
import { JsonPprotocol } from "./JsonPprotocol";

export class ProtocolFactory {

    public static create(protocol: Application.ProtocolType) {
        switch(protocol) {
            case Application.ProtocolType.ARRAY_BUFFER:
                return new BinaryProtocol();
            case Application.ProtocolType.JSON:
                return new JsonPprotocol();
            default:
                return null;
        }
    }
}