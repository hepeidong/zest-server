import { StringUtil } from "./StringUtil";
export class DateUtil {
    static dateFormat() {
        let args = this.makeArgs.apply(null, arguments);
        let now;
        if (args === null || (args.tm === null && args.date === null)) {
            now = new Date();
        }
        else if (args.date) {
            now = new Date(args.date);
        }
        else if (args.tm) {
            now = new Date(args.tm);
        }
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString();
        const day = now.getDate().toString();
        const hours = this.timeStr(now.getHours(), 2);
        const minutes = this.timeStr(now.getMinutes(), 2);
        const seconds = this.timeStr(now.getSeconds(), 2);
        const milliseconds = this.timeStr(now.getMilliseconds(), 3);
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
    static timeStr(timeNum, len) {
        const str = String(timeNum);
        const strLen = len - str.length;
        if (strLen < 0) {
            return str;
        }
        else {
            let tempStr = '';
            for (let i = 0; i < strLen; ++i) {
                tempStr += '0';
            }
            return `${tempStr}${str}`;
        }
    }
    static makeArgs() {
        if (arguments.length === 0) {
            return null;
        }
        let args = { date: null, tm: null, format: null };
        for (let i = 0; i < arguments.length; ++i) {
            if (typeof arguments[i] === 'string') {
                let strArr = arguments[i].split('T');
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
    static normalFormat(year, month, day, hours, minutes, seconds, milliseconds) {
        let dateList = [];
        if (year)
            dateList.push(year);
        if (month)
            dateList.push(month);
        if (day)
            dateList.push(day);
        let timeList = [];
        if (hours)
            timeList.push(hours);
        if (minutes)
            timeList.push(minutes);
        if (seconds)
            timeList.push(seconds);
        if (milliseconds)
            timeList.push(milliseconds);
        const date = dateList.join('-');
        const times = timeList.join(':');
        return `${date} ${times}`;
    }
}
