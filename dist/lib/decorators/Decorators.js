import { Debug } from "../debug";
import * as js from "./js-type";
import { parentType } from "./parent-class";
function run(name, constructor) {
    Debug.initDebugSetting(name);
    if (constructor) {
        new constructor();
        Debug.log("服务器开始启动！");
    }
    else {
        Debug.error("服务器主程序入口类");
    }
}
export function tssclass() {
    if (typeof arguments[0] === "string") {
        const className = arguments[0];
        if (className.length === 0) {
            throw new Error('装饰器无法获取到类名，请使用 tssclass("该类的类名") 方式装饰你的类！');
        }
        return function (constructor) {
            if (js.isChildClassOf(constructor, parentType.Application)) {
                run(className, constructor);
            }
            js.setClassName(className, constructor);
            return constructor;
        };
    }
    else {
        let constructor = arguments[0];
        const className = js.getClassName(constructor);
        if (className.length === 0) {
            throw new Error('装饰器无法获取到类名，请使用 tssclass("该类的类名") 方式装饰你的类！');
        }
        if (js.isChildClassOf(constructor, parentType.Application)) {
            run(className, constructor);
        }
        js.setClassName(className, constructor);
        return constructor;
    }
}
export function setParentType(key, type) {
    parentType[key] = type;
}
