import { StringUtil } from "./StringUtil";

interface DateFormatArgs {
    date: string;   //时间字符，格式为xxxx-xx-xxTxx:xx:xx
    tm: number;     //时间戳
    format: string; //时间日期表达格式
}

export class DateUtil {
    /**
     * 时间格式
     * @param tm 时间戳
     */
    public static dateFormat(format: string, tm: number): string;
    public static dateFormat(tm: number): string;
    public static dateFormat(format: string): string;
    public static dateFormat(): string {
        let args: DateFormatArgs = this.makeArgs.apply(null, arguments);
        let now: Date;
        if (args === null || (args.tm === null && args.date === null)) {
            now = new Date();
        }
        else if (args.date) {
            now = new Date(args.date);
        }
        else if (args.tm) {
            now = new Date(args.tm);
        }

        const year: string = now.getFullYear().toString();
        const month: string = (now.getMonth() + 1).toString();
        const day: string = now.getDate().toString();
        const hours: string = this.timeStr(now.getHours(), 2);
        const minutes: string = this.timeStr(now.getMinutes(), 2);
        const seconds: string = this.timeStr(now.getSeconds(), 2);
        const milliseconds: string = this.timeStr(now.getMilliseconds(), 3);
        if (args === null || args.format === null || args.format === '') {
            if (args && args.date) {
                return this.normalFormat(year, month, day, null, null, null, null);
            }
            else {
                return this.normalFormat(year, month, day, hours, minutes, seconds, milliseconds);
            }
        }
        else {
            return StringUtil.format(args.format, year, month, day, hours, minutes, seconds, milliseconds);
        }
    }

    private static timeStr(timeNum: number, len: number): string {
        const str: string = String(timeNum);
        const strLen: number = len - str.length;
        if (strLen < 0) {
            return str;
        }
        else {
            let tempStr: string = '';
            for (let i: number = 0; i < strLen; ++i) {
                tempStr += '0';
            }
            return `${tempStr}${str}`;
        }
    }

    private static makeArgs(): DateFormatArgs {
        if (arguments.length === 0) {
            return null;
        }
        let args: DateFormatArgs = { date: null, tm: null, format: null };
        for (let i: number = 0; i < arguments.length; ++i) {
            if (typeof arguments[i] === 'string') {
                let strArr: string[] = arguments[i].split('T');
                if (strArr.length === 2 && strArr[0].split('-').length === 3 && strArr[1].split(':').length === 3) {
                    args.date = arguments[i];
                }
                else {
                    args.format = arguments[i];
                }
            }
            else if (typeof arguments[i] === 'number') {
                args.tm = arguments[i];
            }
        }
        return args;
    }

    private static normalFormat(
        year: string,
        month: string,
        day: string,
        hours: string,
        minutes: string,
        seconds: string,
        milliseconds: string
    ): string {
        let dateList: string[] = [];
        if (year) dateList.push(year);
        if (month) dateList.push(month);
        if (day) dateList.push(day);
        let timeList: string[] = [];
        if (hours) timeList.push(hours);
        if (minutes) timeList.push(minutes);
        if (seconds) timeList.push(seconds);
        if (milliseconds) timeList.push(milliseconds);
        const date: string = dateList.join('-');
        const times: string = timeList.join(':');
        return `${date} ${times}`;
    }
}