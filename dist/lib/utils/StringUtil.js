import { SHOW_DATE } from "../define";
import { DateUtil } from "./DateUtil";
export class StringUtil {
    /**
     * 日志格式
     * @param logTag 标签
     * @param type 日志类型
     */
    static logFormat(logTag, type) {
        if (SHOW_DATE) {
            return `${logTag ? `[${logTag}]` : ''}${DateUtil.dateFormat('%s-%s-%s %s:%s:%s:%s')} ${type}`;
        }
        return `${logTag ? `[${logTag}]` : ''} ${type}`;
    }
    /**
     * 构建字符串格式
     * @param strFm 字符串格式
     * @param replaceValue 替换的值
     * @example
     * format('[%s-%s-%s]', 2020, 05, 01); //2020-05-01
     */
    static format(strFm, ...replaceValue) {
        let retStr = strFm;
        for (let i = 0; i < replaceValue.length; ++i) {
            if (replaceValue[i] !== null && typeof replaceValue[i] !== "undefined") {
                retStr = retStr.replace(/%s/, replaceValue[i]);
            }
        }
        return retStr;
    }
    //字符串取反
    static reverse(str) {
        let temp1 = '';
        let temp2 = '';
        let hard = Math.floor(str.length / 2) - 1;
        let end = str.length - 1;
        if (str.length % 2 > 0) {
            temp2 += str[hard + 1];
        }
        while (1) {
            if (hard < 0) {
                break;
            }
            temp1 += str[end];
            temp2 += str[hard];
            hard--;
            end--;
        }
        return temp1 + temp2;
    }
}
