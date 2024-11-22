/**调试模式 */
export const DEBUG: boolean = true;
/**日志显示时间 */
export const SHOW_DATE: boolean = true;

export const global = {
    enabled: false
};

export function SAFE_CALLBACK(func: Function, ...args: any) {
    if (typeof func === 'function') {
        func(...args);
        return true;
    }
    return false;
}

export function SAFE_CALLBACK_CALLER(func: Function, caller: any, ...args: any) {
    if (typeof func === 'function') {
        func.apply(caller, args);
        return true;
    }
    return false;
}