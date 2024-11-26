import { Debug } from "../debug";
import { Constructor } from "@types";
import * as js from "./js-type";
import { parentType } from "./parent-class";

function run(name: string, constructor: Constructor) {
    Debug.initDebugSetting(name);
    if (constructor) {
        new constructor();
        Debug.log("服务器开始启动！");
    }
    else {
        Debug.error("服务器主程序入口类");
    }
}


/**
 * 框架的类装饰器，用于声明类，当你需要通过js.getClassByName获取该类时，则可以使用此装饰器装饰你的类，
 * 要注意，框架中有些类是必须要使用此装饰器装饰的。
 * @param className 你的类名
 */
export function tssclass(className: string): Function;
export function tssclass<T>(constructor: {new (): T}): new () => T;
export function tssclass() {
    if (typeof arguments[0] === "string") {
        const className = arguments[0];
        if (className.length === 0) {
            throw new Error('装饰器无法获取到类名，请使用 tssclass("该类的类名") 方式装饰你的类！');
        }
        return function (constructor: Function) {
            if (js.isChildClassOf(constructor, parentType.Application)) {
                run(className, constructor as Constructor);
            }
            js.setClassName(className, constructor as Constructor);
            return constructor;
        }
    }
    else {
        let constructor = arguments[0];
        const className = js.getClassName(constructor);
        if (className.length === 0) {
            throw new Error('装饰器无法获取到类名，请使用 tssclass("该类的类名") 方式装饰你的类！');
        }
        if (js.isChildClassOf(constructor, parentType.Application)) {
            run(className, constructor as Constructor);
        }
        js.setClassName(className, constructor);
        return constructor;
    }   
}

export function setParentType(key: string, type: Function) {
    parentType[key] = type;
}

function setTag(tag: string) {
    return function (key: string, sql: string, constructor: Function) {
        if (!constructor.prototype.hasOwnProperty(tag)) {
            const obj = {};
            obj[key] = sql;
           js.value(constructor.prototype, tag, obj);
        }
        else {
            const value = constructor.prototype[tag];
            value[key] = sql;
        }
    };
}

const setSql = setTag("_sqlMap");

export function tssql(sqlKey: string, sql: string) {
    return function (constructor: Function) {
        setSql(sqlKey, sql, constructor);
    }
}
