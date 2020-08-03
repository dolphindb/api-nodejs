'use strict';

const BasicScalar = require("./BasicScalar");
const constants = require("./constants");

class BasicFloat extends BasicScalar{
    constructor (value) {
        super();
        this.dtype = 15;
        this.value = (value == null ? constants.floatMin : value);
    }
    tobytes () {
        let buf = Buffer.alloc(4);
        if (this.isSmall)
            buf.writeFloatLE(this.value);
        else
            buf.writeFloatBE(this.value);
        return buf;
    }
}
module.exports = BasicFloat;