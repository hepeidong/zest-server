import { DEBUG } from "../define";
import { StringUtil } from "../utils";
export class Debug {
    static initDebugSetting(logTag) {
        if (DEBUG) {
            this.log = console.log.bind(console, StringUtil.logFormat(logTag, "Log"));
            this.warn = console.warn.bind(console, StringUtil.logFormat(logTag, "Warn"));
            this.error = console.error.bind(console, StringUtil.logFormat(logTag, "Error"));
        }
    }
}
Debug.log = function log(msg, ...subst) { };
Debug.warn = function warn(msg, ...subst) { };
Debug.error = function error(msg, ...subst) { };
