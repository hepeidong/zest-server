import { IProtocol } from "@types";
import { BufferIO } from "./BufferIO";

export class BinaryProtocol implements IProtocol {
    private _bufferIO: BufferIO;

    constructor() {
        this._bufferIO = new BufferIO();
    }

    public encode(str: string) {
        return this._bufferIO.stringToArrayBuffer(str);
    }

    public decode(data: ArrayBuffer): string {
        return this._bufferIO.arrayBufferToString(data);
    }
}