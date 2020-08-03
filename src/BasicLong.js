'use strict';

const BasicScalar = require("./BasicScalar");
const constants = require("./constants");

class BasicLong extends BasicScalar{
    constructor (value) {
        super();
        this.dtype = 5;
        this.value = (value == null ? constants.longMin : BigInt(value));
    }
    tobytes () {
        let buf = Buffer.alloc(8);
        if (this.isSmall)
            buf.writeBigInt64LE(this.value);
        else
            buf.writeBigInt64BE(this.value);
        return buf;
    }
}
module.exports = BasicLong;