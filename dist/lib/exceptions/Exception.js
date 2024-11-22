export class Exception {
    /**
     * Base exception class
     * @constructot
     * @param message
     */
    constructor(message) {
        this.message = message;
    }
    /** @return {string} */
    toString() {
        return `Exception: ${this.message}`;
    }
    /**异常处理 */
    handle() { return true; }
}
