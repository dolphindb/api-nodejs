'use strict';

const BasicInt128 = require("./BasicInt128");

class BasicUuid extends BasicInt128 {
    constructor (value) {
        if (typeof value === 'string')
            value = value.replace(/\-/g,'');
        super(value);
        this.uuid = null;
        this.dtype = 19;
    } 

    toString () {
        if (this.uuid !== null)
            return this.uuid;
        let buf = this.buf;
        this.uuid = buf.slice(0,4).toString('hex')+'-'+buf.slice(4,6).toString('hex')+'-'+buf.slice(6,8).toString('hex')+'-'
            +buf.slice(8,10).toString('hex') + '-'+buf.slice(10).toString('hex');
        return this.uuid;
    }
}
module.exports = BasicUuid;