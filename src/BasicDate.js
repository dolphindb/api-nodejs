'use strict';

const Util = require('./util');
const constants = require("./constants");

const TimeObj = require("./TimeObj");

const cumMothDays = [0,31,59,90,120,151,181,212,243,273,304,334,365]
const cumLeapMonthDays = [0,31,60,91,121,152,182,213,244,274,305,335,366]
// const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
// const leapMonthDays = [31,29,31,30,31,30,31,31,30,31,30,31]

class BasicDate extends TimeObj{
    constructor (value) {
        super();
        this.dtype = 6;
        if (value != null) {
            if (typeof value === 'number'){
                this.value = value
                this.timeObj = this.parseInt(value)
            } else if (typeof value === 'string') {
                let {year, month, day} = Util.timeFromStr(value);
                this.timeObj = {year: year, month: month, day: day};
                this.value = this.parseObj(this.timeObj);
            } else if (typeof value === 'object') {
                this.timeObj = value
                this.value = this.parseObj(this.timeObj)
            } 
        } else {
            this.value = constants.intMin;
        }
    }

    parseInt(days) {
        var year, month, day
        const daysof400years = 146097
        days += 719529  // 719529: days of 0000-00-00 to 1970-01-01
        let era = Math.floor(days / daysof400years)  // 146097: days of 400 years
        let offsetdays = days % daysof400years
        let erayears = era * 400
        let years = Math.floor(offsetdays / 365)
        let tmpdays = years * 365
        if (years >  0)
            tmpdays +=  Math.floor((years-1)/4) + 1 - Math.floor((years-1)/100)
        if (tmpdays >= offsetdays)
            --years
        year = years + erayears
        days -= era * daysof400years + tmpdays
        let leap = ((year % 4 === 0 && year%100 !==0 ) || year%400 === 0)
        if (days <= 0)
            days += leap ? 366 : 365
        month = Math.floor(days/32) + 1
        if (leap) {    
            if (days > cumLeapMonthDays[month])
                month++
            day = days - cumLeapMonthDays[month-1]
        } else {
            if (days > cumMothDays[month])
                month++
            day = days - cumMothDays[month-1]
        }
        return {
            year: year,
            month: month,
            day: day,
            toString: function () {
                return `${this.year}-${this.month}-${this.day}`;
            }
        }
    }

    parseObj (dateObj) {
        let {year, month, day} = dateObj;
        let leap = ((year % 4 === 0 && year%100 !==0 ) || year%400 === 0);
        let days;
        if (leap)
            days = cumLeapMonthDays[month-1] + day - 1;
        else
            days = cumMothDays[month-1] + day - 1;
        let y, Y;
        if (year < 1970){
            y = year;
            Y = 1970;
        } else {
            y = 1970;
            Y = year;
        }
        let tmpdays = 0;
        for(;y<Y; y++){
            leap = ((y % 4 === 0 && y%100 !==0 ) || y%400 === 0);
            tmpdays += leap ? 366 : 365;
        }
        if (year < 1970)
            days = tmpdays - days;
        else
            days = tmpdays + days;
        
        return year < 1970 ? -days : days;
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
module.exports = BasicDate;