import { BufferIO } from "./BufferIO";
export class BinaryProtocol {
    constructor() {
        this._bufferIO = new BufferIO();
    }
    encode(str) {
        return this._bufferIO.stringToArrayBuffer(str);
    }
    decode(data) {
        return this._bufferIO.arrayBufferToString(data);
    }
}
