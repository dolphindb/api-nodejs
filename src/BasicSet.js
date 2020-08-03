'use strict';

const BasicVector = require("./BasicVector");
// const Util = require("./util");
// const BasicNull = require("./BasicNull");

class BasicSet extends BasicVector{
    constructor (value) {
        if(value == null || !(value instanceof Set))
            super(null);
        else 
            super(Array.from(value));
        // this.value = value;
        this.dform = 4;
    }
    tobytes () {
        let dt = this.dt;
        if (dt !== -1 && dt !== 1 && dt !== 25){
            let buf = super.tobytes();
            let hdr = Buffer.from([this.dt, this.dform]);
            return Buffer.concat([hdr, buf], hdr.length + buf.length);
        } else if ( dt === -1) {
            return super.tobytes();
        } else {
            console.log("The key type can't be VOID, BOOL, FUNCTIONDEF, HANDLE, ANY or DICTIONARY");
            return Buffer.from([0,0,0]);
        }
    }
}
module.exports = BasicSet;