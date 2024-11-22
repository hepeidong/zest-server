const types = {
    object: '[object Object]',
    array: '[object Array]',
    function: '[object Function]',
    null: '[object Null]',
    undefined: '[object Undefined]'
}

export function isObject(arg: any): boolean {
    return Object.prototype.toString.call(arg) === types.object || typeof arg === 'object';
}

export function isArray(arg: any): boolean {
    return Object.prototype.toString.call(arg) === types.array;
}

export function isFunction(arg: any): boolean {
    return Object.prototype.toString.call(arg) === types.function || typeof arg === 'function';
}

export function isNumber(arg: any): boolean {
    return typeof arg === 'number' || arg instanceof Number;
}

export function isString(arg: any): boolean {
    return typeof arg === 'string' || arg instanceof String;
}

export function isNull(arg: any): boolean {
    return Object.prototype.toString.call(arg) === types.null;
}

export function isUndefined(arg: any): boolean {
    return Object.prototype.toString.call(arg) === types.undefined || typeof arg === 'undefined';
}