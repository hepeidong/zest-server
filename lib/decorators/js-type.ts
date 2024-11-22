import { Constructor, Prototype } from "../../@types";
import { Debug } from "../debug";
import { IDGenerator } from "./IDGenerator";

const classNameTag = '__classname__';
const classIdTag = '__cid__';
const tempCIDGenerator = new IDGenerator('Message');

export function createMap (forceDictMode?: boolean): any {
    const map = Object.create(null);
    if (forceDictMode) {
        const INVALID_IDENTIFIER_1 = '.';
        const INVALID_IDENTIFIER_2 = '/';
        // assign dummy values on the object
        map[INVALID_IDENTIFIER_1] = 1;
        map[INVALID_IDENTIFIER_2] = 1;
        delete map[INVALID_IDENTIFIER_1];
        delete map[INVALID_IDENTIFIER_2];
    }
    return map;
}


export const _idToClass: Record<string, Constructor> = createMap(true);
export const _nameToClass: Record<string, Constructor> = createMap(true);

/**
 * @zh 获取父类。
 * @param constructor @en The constructor to get super class.
 * @zh 要获取父类的构造函数。
 * @returns @en Super class. @zh 父类。
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getSuper (constructor: Function) {
    const proto = constructor.prototype; // bound function do not have prototype
    const dunderProto = proto && Object.getPrototypeOf(proto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dunderProto && dunderProto.constructor;
}

/**
 * @en
 * Checks whether a class is child of another class, or is the same type as another class.
 * @zh 判断一类型是否是另一类型的子类或本身。
 * @param subclass @en Sub class to check. @zh 子类类型。
 * @param superclass @en Super class to check. @zh 父类类型。
 * @return @en True if sub class is child of super class, or they are the same type. False else.
 * @zh 如果子类类型是父类类型的子类，或者二者是相同类型，那么返回 true，否则返回 false。
 */
export function isChildClassOf<T extends Constructor>(subclass: unknown, superclass: T): subclass is T;
export function isChildClassOf(subclass: unknown, superclass: unknown): boolean;
export function isChildClassOf (subclass: unknown, superclass: unknown) {
    if (subclass && superclass) {
        if (typeof subclass !== 'function') {
            return false;
        }
        if (typeof superclass !== 'function') {
            return false;
        }
        if (subclass === superclass) {
            return true;
        }
        for (; ;) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            subclass = getSuper(subclass as Function);
            if (!subclass) {
                return false;
            }
            if (subclass === superclass) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @en
 * Gets class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code of stackoverflow post</a>)
 * @zh
 * 获取对象的类型名称，如果对象是 {} 字面量，将会返回 ""。参考了 stackoverflow 的代码实现：
 * <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">stackoverflow 的实现</a>
 * @param objOrCtor @en An object instance or constructor. @zh 类实例或者构造函数。
 * @returns @en The class name. @zh 类名。
 */
export function getClassName (objOrCtor: any): string {
    if (typeof objOrCtor === 'function') {
        const prototype = objOrCtor.prototype;
        // eslint-disable-next-line no-prototype-builtins
        if (prototype && prototype.hasOwnProperty(classNameTag) && prototype[classNameTag]) {
            return prototype[classNameTag] as string;
        }
        let ret = '';
        //  for browsers which have name property in the constructor of the object, such as chrome
        if (objOrCtor.name) {
            ret = objOrCtor.name;
        }
        if (objOrCtor.toString) {
            let arr: any[];
            const str = objOrCtor.toString();
            if (str.charAt(0) === '[') {
                // str is "[object objectClass]"
                // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                arr = /\[\w+\s*(\w+)\]/.exec(str);
            } else {
                // str is function objectClass () {} for IE Firefox
                // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                arr = /function\s*(\w+)/.exec(str);
            }
            if (arr && arr.length === 2) {
                ret = arr[1];
            }
        }
        return ret !== 'Object' ? ret : '';
    } else if (objOrCtor && objOrCtor.constructor) {
        return getClassName(objOrCtor.constructor);
    }
    return '';
}

const value = (() => {
    const descriptor: PropertyDescriptor = {
        value: undefined,
        enumerable: false,
        writable: false,
        configurable: true,
    };
    return (object: Prototype, propertyName: string, value_: any, writable?: boolean, enumerable?: boolean) => {
        descriptor.value = value_;
        descriptor.writable = writable;
        descriptor.enumerable = enumerable;
        Object.defineProperty(object, propertyName, descriptor);
        descriptor.value = undefined;
    };
})();

export function setup (tag: string, table: Record<string | number, any>, allowExist: boolean) {
    return function (id: any, constructor: Function) {
        if (constructor.prototype.hasOwnProperty(tag)) {
            delete table[constructor.prototype[tag]];
        }
        value(constructor.prototype, tag, id);
        if (id) {
            const registered = table[id];
            if (!allowExist && registered && registered !== constructor) {
                let err = `A Class already exists with the same ${tag} : "${id}".`;
                Debug.error(err);
            } else {
                table[id] = constructor;
            }
        }
    };
}

/**
 * @en
 * Register the class by specified id, if its classname is not defined, the class name will also be set.
 * @zh
 * 通过 id 注册类型
 * @method _setClassId
 * @param classId
 * @param constructor
 */
export const _setClassId = setup('__cid__', _idToClass, false);

const doSetClassName = setup('__classname__', _nameToClass, true);

/**
 * @en Registers a class by specified name manually.
 * @zh 通过指定的名称手动注册类型
 * @param className @en Class name to register. @zh 注册的类名。
 * @param constructor @en Constructor to register. @zh 注册的构造函数。
 */
export function setClassName (className: string, constructor: Constructor) {
    doSetClassName(className, constructor);
    // auto set class id
    // eslint-disable-next-line no-prototype-builtins
    if (!constructor.prototype.hasOwnProperty(classIdTag)) {
        const id = className || tempCIDGenerator.getNewId();
        if (id) {
            _setClassId(id, constructor);
        }
    }
}

/**
 * @en
 * Gets the registered class by class name.
 * @zh
 * 通过类名获取已注册的类型。
 * @param classname @en The class name used to get class. @zh 获取类的类名。
 * @returns @en The constructor of the registered class. @zh 注册的类构造函数。
 */
export function getClassByName (classname: string) {
    return _nameToClass[classname];
}