import { DEBUG } from "../define";
import { StringUtil } from "../utils";

export class Debug {
    static log = function log(msg: any, ...subst: any[]){}
    static warn = function warn(msg: any, ...subst: any[]){}
    static error = function error(msg: any, ...subst: any[]){}

    static initDebugSetting(logTag: string): void {
        if (DEBUG) {
            this.log = console.log.bind(console, StringUtil.logFormat(logTag, "Log"));
            this.warn = console.warn.bind(console, StringUtil.logFormat(logTag, "Warn"));
            this.error = console.error.bind(console, StringUtil.logFormat(logTag, "Error"));
        }
    }
}