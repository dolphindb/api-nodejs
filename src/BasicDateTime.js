'use strict';

const Util = require('./util');
const constants = require("./constants");

const BasicDate = require('./BasicDate');
const BasicTime = require('./BasicTime');
const TimeObj = require('./TimeObj');
var basicDate = new BasicDate();
var basicTime = new BasicTime();

class BasicDateTime extends TimeObj{
    constructor (value) {
        super();
        this.dtype = 11;
        if (value != null) {
            if (typeof value === 'number'){
                this.value = value
                this.timeObj = this.parseInt(value)
            } else if (typeof value === 'string') {
                let {year, month, day, hour, minute, second} = Util.timeFromStr(value);
                this.timeObj = {year: year, month: month, day: day, hour: hour, minute: minute, second: second};
                this.value = this.parseObj(this.timeObj);
            } else if (typeof value === 'object') {
                this.timeObj = value
                this.value = this.parseObj(value)
            }
        } else {
            this.value = constants.intMin;
        }
    }

    parseInt(value) {
        var days = Math.floor(value / 86400)
        var date = basicDate.parseInt(days)
        let sec = value % 86400
        if (sec < 0) 
            sec += 86400
        var time = basicTime.parseInt(sec*1000)
        return {
            year: date.year,
            month: date.month,
            day: date.day,
            hour: time.hour,
            minute: time.minute,
            second: time.second,
            toString: function () {
                return `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`;
            }
        }
    }

    parseObj (datetimeObj) {
        let {year, month, day, hour, minute, second} = datetimeObj;
        let days = basicDate.parseObj({year: year, month: month, day: day});
        return days * 86400 + hour*3600 + minute*60 + second;
    }

    get() {
        return this.timeObj
    }

    tobytes () {
        let buf = Buffer.alloc(4);
        if (this.isSmall)
            buf.writeInt32LE(this.value);
        else
            buf.writeInt32BE(this.value);
        return buf;
    }

    // toString() {
    //     return this.timeObj.toString();
    // }
}
module.exports = BasicDateTime;