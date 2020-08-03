'use strict';

const BasicString = require("./BasicString");

class BasicSymbol extends BasicString {
    constructor (value) {
        super(value);
        this.dtype = 17;
    }
}

module.exports = BasicSymbol;