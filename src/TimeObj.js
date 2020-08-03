'use strict';

const BasicScalar = require("./BasicScalar");

class TimeObj extends BasicScalar{
    constructor () {
        super();
        this.value = null;
        this.timeObj = null;
    }
    
    get () {
        return null;
    }

    toString () {
        return this.timeObj.toString();
    }

    clear () {
        this.timeObj = null;
    }
}

module.exports = TimeObj;