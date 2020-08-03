'use strict';

const BasicScalar = require("./BasicScalar");
const constants = require('./constants')
 
class BasicString extends BasicScalar {
    constructor (value) {
        super();
        this.value = value;
        this.dtype = 18;
    }
    tobytes () {
        if (this.value == null)
            return Buffer.from([0, 0, constants.nullV]);
        let str = this.value;
        let buf = Buffer.alloc(str.length + 1);
        if (!this.isSmall)
            str = str.split('').reverse().join('');
        buf.write(str);
        return buf;
    }
}

module.exports = BasicString;