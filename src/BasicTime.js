'use strict';

const Util = require('./util');
const constants = require("./constants");

const TimeObj = require("./TimeObj");

class BasicTime extends TimeObj{
    constructor (value) {
        super();
        this.dtype = 8;
        if (value != null) {
            if (typeof value === 'number'){
                this.value = value
                this.timeObj = this.parseInt(value)
            } else if (typeof value === 'string') {
                let {hour, minute, second, nS} = Util.timeFromStr(value);
                this.timeObj = {hour: hour, minute: minute, second: second, nanoSecond: nS};
                this.value = this.parseObj(this.timeObj);
            } else if (typeof value === 'object') {
                this.timeObj = value
                this.value = this.parseObj(value)
            }
        } else {
            this.value = constants.intMin;
        }
    }

    parseInt (value) {
        var hour, minute, second, nanoSecond
        hour = Math.floor(value / 3600000)
        minute = Math.floor(value / 60000) % 60
        second = Math.floor( value / 1000) % 60
        nanoSecond = value % 1000 * 1000000
        return {
            hour: hour,
            minute: minute,
            second: second,
            nanoSecond: nanoSecond,
            toString: function () {
                return `${this.hour}:${this.minute}:${this.second}.${this.nanoSecond}ns`;
            }
        }
    }

    parseObj (timeObj) {
        let {hour, minute, second, nanoSecond} = timeObj
        return hour * 3600000 + minute * 60000 + second * 1000 + Math.floor(nanoSecond / 1000000)
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
module.exports = BasicTime;