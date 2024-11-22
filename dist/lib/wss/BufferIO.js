//websocket不需要处理粘包问题，因为websocket本身是基于帧来传输数据的，传输层会把消息分割成多个帧进行传输。
//每一个帧的第一个字节是FIN标志位，如果FIN位1，则表示该帧是消息最后的一个部分；如果FIN为0，则表示没有后续帧。
//正因为这种设计，使得websocket传输的消息都是完整的，不会和其它消息混杂在一起。
export class BufferIO {
    constructor() {
    }
    uint8ArrayToString(array) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx 10xx xxxx 10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
    //字符串转ArrayBuffer
    stringToArrayBuffer(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            }
            else {
                bytes.push(c & 0xFF);
            }
        }
        const array = new Int8Array(bytes.length);
        for (var i = 0; i <= bytes.length; i++) {
            array[i] = bytes[i];
        }
        return array;
    }
    //ArrayBuffer转字符串
    arrayBufferToString(buffer) {
        const uint = new Uint8Array(buffer);
        return this.uint8ArrayToString(uint);
    }
}
