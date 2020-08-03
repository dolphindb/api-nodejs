'use strict';

const Util = require('./util');
const constants = require("./constants");

const TimeObj = require("./TimeObj");

class BasicMinute extends TimeObj{
    constructor (value) {
        super();
        this.dtype = 9;
        if (value != null) {
            if (typeof value === 'number'){
                this.value = value
                this.timeObj = this.parseInt(value)
            } else if (typeof value === 'string') {
                let {hour, minute} = Util.timeFromStr(value);
                this.timeObj = {hour: hour, minute: minute};
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
        let hour, minute
        hour = Math.floor(value / 60)
        minute = value % 60
        return {
            hour: hour,
            minute: minute,
            toString: function () {
                return `${this.hour}:${this.minute}`;
            }
        }
    }

    parseObj(minuteObj) {
        let {hour, minute} = minuteObj;
        return hour * 60 + minute;
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
module.exports = BasicMinute;