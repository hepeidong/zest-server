const types = {
    object: '[object Object]',
    array: '[object Array]',
    function: '[object Function]',
    null: '[object Null]',
    undefined: '[object Undefined]'
};
export function isObject(arg) {
    return Object.prototype.toString.call(arg) === types.object || typeof arg === 'object';
}
export function isArray(arg) {
    return Object.prototype.toString.call(arg) === types.array;
}
export function isFunction(arg) {
    return Object.prototype.toString.call(arg) === types.function || typeof arg === 'function';
}
export function isNumber(arg) {
    return typeof arg === 'number' || arg instanceof Number;
}
export function isString(arg) {
    return typeof arg === 'string' || arg instanceof String;
}
export function isNull(arg) {
    return Object.prototype.toString.call(arg) === types.null;
}
export function isUndefined(arg) {
    return Object.prototype.toString.call(arg) === types.undefined || typeof arg === 'undefined';
}
