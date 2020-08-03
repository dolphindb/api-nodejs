'use strict';

const Util = require('./util');
const constants = require("./constants");

const TimeObj = require("./TimeObj");

class BasicMonth extends TimeObj{
    constructor (value) {
        super();
        this.dtype = 7
        if (value != null){
            if (typeof value === 'number'){
                this.value = value
                this.timeObj = this.parseInt(value)
            } else if (typeof value === 'string') {
                let {year, month} = Util.timeFromStr(value);
                this.timeObj = {year: year, month: month};
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
        var year = Math.floor(value/12)
        var month = value % 12 + 1
        return {
            year: year,
            month: month,
            toString: function() {
                return `${this.year}-${this.month}`;
            }
        }
    }

    parseObj (monthObj) {
        let {year, month} = monthObj;
        return year * 12 + month - 1; 
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
module.exports = BasicMonth;