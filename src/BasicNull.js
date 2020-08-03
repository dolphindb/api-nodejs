'use strict';

const Util = require('./util');
const BasicScalar = require('./BasicScalar');
const BasicByte = require('./BasicByte');
const BasicShort = require('./BasicShort');
const BasicInt = require('./BasicInt');
const BasicLong = require('./BasicLong');
const BasicFloat = require('./BasicFloat');
const BasicDouble = require('./BasicDouble');
const constants = require('./constants');

const nullV = constants.nullV;
const byteMin = constants.byteMin;
const shortMin = constants.shortMin;
const intMin = constants.intMin;
const longMin = constants.longMin;
const floatMin = constants.floatMin;
const doubleMin = constants.doubleMin;

class BasicNull extends BasicScalar{
    constructor (dtype) {
        super();
        if (typeof dtype === 'string')
            this.dtype = Util.dtypeByName (dtype);
        else {
            this.dtype = dtype;
        }
        this.value = this.nullTypeValue();
        if (this.dtype === -1){
            this.dtype = 0;
            this.value = 0;
        }
    }

    nullTypeValue() {
        switch (this.dtype) {
            // case -1: return 0;
            case 0: return nullV;  //VOID, value not sure
            case 1: return byteMin; //BOOL
            case 2: return byteMin; //CHAR
            case 3: return shortMin; //SHORT
            case 4: return intMin; //INT
            case 5: return longMin; //LONG
            case 6: return intMin; //DATE
            case 7: return intMin; //MONTH
            case 8: return intMin; //TIME
            case 9: return intMin; //MINUTE
            case 10: return intMin; //SECOND
            case 11: return intMin; //DATETIME
            case 12: return longMin; //TIMESTAMP
            case 13: return longMin; //NANOTIME
            case 14: return longMin; //NANOTIMESTAMP
            case 15: return floatMin; //FLOAT
            case 16: return doubleMin; //DOUBLE
            default: return null;
        }
    }
    isNull (value) {
        return this.value === value;
    }

    get () {
        return null;
    }

    tobytes() {
        if (this.dtype === 0)
            return Buffer.from([this.value]);
        if (this.dtype === 1 || this.dtype === 2)
            return (new BasicByte(byteMin)).tobytes();
        else if (this.dtype === 3)
            return (new BasicShort(shortMin)).tobytes();
        else if ((this.dtype === 4) || (this.dtype>=6 && this.dtype <=11))
            return (new BasicInt(intMin)).tobytes();
        else if((this.dtype === 5) || (this.dtype>=12 && this.dtype <= 14))
            return (new BasicLong(longMin)).tobytes();
        else if(this.dtype === 15)
            return (new BasicFloat(floatMin)).tobytes();
        else if (this.dtype === 16)
            return (new BasicDouble(doubleMin)).tobytes();
        else {
            let buf = Buffer.alloc(Util.dtypelen(this.dtype)); // 0 buf
            return buf;
        }
    }
}
module.exports = BasicNull;