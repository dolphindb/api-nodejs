'use strict';

const BasicScalar = require("./BasicScalar");
const BasicBool = require("./BasicBool");
const BasicDouble = require("./BasicDouble");
const BasicString = require("./BasicString");
const BasicLong = require("./BasicLong");
const BasicInt = require("./BasicInt");
const BasicNull = require("./BasicNull");

var tUtil = new Object();

tUtil.scalarTypeR = function (value) {
    if (value instanceof BasicScalar)
        return value.dtype;
    if (value === null)
        return 0;
    if (typeof value === 'boolean')
        return 1;
    if (typeof value === 'number') {
        if (value.toString().indexOf('.') !== -1)
            return 16;
        else
            return 4;
    }
    if (typeof value === 'string')
        return 18;
    if (typeof value === 'bigint')
        return 5;
    return -1;
}

tUtil.scalar2BufR = function (value, options) {
    let {isSmall=true, header=false, dt=-1} = options;
    let scalarObj = null;
    if (value instanceof BasicScalar){
        scalarObj = value;
    } else {
        let dtr;
        if (dt !== -1)
            dtr = dt;
        else
            dtr = tUtil.scalarTypeR(value);
        if (dtr === 0) {
            scalarObj = new BasicNull(0);
        }if (dtr === 1){
            scalarObj = new BasicBool(value);
        } else if (dtr === 4) {
            scalarObj = new BasicInt(value);
        } else if (dtr === 16) {
            scalarObj = new BasicDouble(value);
        } else if (dtr === 18 || dtr === 17) {
            scalarObj = new BasicString(value);
        } else if (dtr === 5) {
            scalarObj = new BasicLong(value);
        }  
    }
    if (scalarObj !== null){
        let buf = scalarObj.small(isSmall).tobytes();
        if (header)
            buf = Buffer.concat([scalarObj.hdrbytes(),buf]);
        return buf;
    } else {
        return null;
    }
}
module.exports = tUtil;