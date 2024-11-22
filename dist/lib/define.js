/**调试模式 */
export const DEBUG = true;
/**日志显示时间 */
export const SHOW_DATE = true;
export const global = {
    enabled: false
};
export function SAFE_CALLBACK(func, ...args) {
    if (typeof func === 'function') {
        func(...args);
        return true;
    }
    return false;
}
export function SAFE_CALLBACK_CALLER(func, caller, ...args) {
    if (typeof func === 'function') {
        func.apply(caller, args);
        return true;
    }
    return false;
}
