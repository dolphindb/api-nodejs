'use strict';

const BasicVector = require("./BasicVector");

class BasicPair extends BasicVector {
    constructor (value) {
        // a:b
        if (value == null)
            super(null);
        else {
            let i = value.indexOf(":");
            let a = Number(value.substring(0,i));
            let b = Number(value.substring(i+1));
            super([a,b]);
        }
        this.dform = 2;
    }
}
module.exports = BasicPair;