'use strict';

const BasicVector = require("./BasicVector");

class BasicDict extends BasicVector{
    constructor (value) {
        if (!(value instanceof Map))
            super(null);
        else{
            super(Array.from(value.values()));
            this.keys = Array.from(value.keys());
        }
        this.dform = 5;
    }
    tobytes () {
        let dt = this.dt;
        let byteArray = new Array();
        if (dt !== -1) {
            byteArray.push(dt, this.dform);
            let keybuf = (new BasicVector(this.keys)).tobytes();
            let valuebuf = super.tobytes();
            for (const e of keybuf)
                byteArray.push(e);
            for (const e of valuebuf)
                byteArray.push(e);
        } else {
            return super.tobytes();
        }
        return Buffer.from(byteArray);
    }
}
module.exports = BasicDict;