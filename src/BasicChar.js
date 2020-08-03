'use strict';

const BasicByte = require("./BasicByte");

class BasicChar extends BasicByte {
    constructor (value) {
        if (value == null || value.length === 0)
            super(null);
        else
            super(value.charCodeAt(0));
        this.dtype = 2;
    }
}
module.exports = BasicChar;