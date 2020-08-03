'use strict';

const BasicByte = require("./BasicByte");

class BasicBool extends BasicByte {
    constructor (value) {
        if (value == null)
            super(null);
        else 
            super(value ? 1:0);
        this.dtype = 1;
    }
}
module.exports = BasicBool;