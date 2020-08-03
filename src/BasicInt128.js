'use strict';

const BasicScalar = require("./BasicScalar");
// const hexcv = new Map([['0',0n],['1',1n],['2',2n],['3',3n],['4',4n],['5',5n],['6',6n],['7',7n],['8',8n],['9',9n],
//     ['a',10n],['b',11n],['c',12n],['d',13n],['e',14n],['f',15n]]);
const hexcv = new Map([['0',0],['1',1],['2',2],['3',3],['4',4],['5',5],['6',6],['7',7],['8',8],['9',9],
    ['a',10],['b',11],['c',12],['d',13],['e',14],['f',15]]);
const int128Z = '00000000000000000000000000000000';

class BasicInt128  extends BasicScalar{
    constructor (value) {
        super();
        if (value == null)
            this.high = this.low = 0n;
        else {
            let high, low;
            if (typeof value === 'string')
                ({high, low} = this.fromStr(value));
            else
                ({high=0n, low=0n} = value);
            this.high = high;
            this.low = low;
        }
        this.hex128 = null;
        this.dtype = 31;
        this.buf = this.tobufBE();
    }

    clear() {
        this.buf = null;
        this.hex128 = null;
    }

    fromStr (str) {
        str = str.toLowerCase();
        let high = 0n, low = 0n;
        let i;
        // let hexcv = this.hexcv;
        // let highbuf = Buffer.alloc(8);
        // let lowbuf = Buffer.alloc(8);
        let buf = Buffer.alloc(16);
        if (str.length < 32)
            str += int128Z.substring(0,32-str.length);
        let len = 16;
        for(i=0; i<8&&i<len; i++){
            if (hexcv.get(str[i*2]) === undefined || hexcv.get(str[i*2+1]) === undefined){
                break;
            }
            buf[i] = hexcv.get(str[i*2]) << 4 | hexcv.get(str[i*2+1]); 
        }
        for(i=8; i<16&&i<len; i++){
            if (hexcv.get(str[i*2]) === undefined || hexcv.get(str[i*2+1]) === undefined){
                break;
            }
            buf[i] = hexcv.get(str[i*2]) << 4 | hexcv.get(str[i*2+1]); 
        }
        high = buf.slice(0,8).readBigInt64BE();
        low = buf.readBigInt64BE(8);
        return {high: high, low: low};
    }

    isNull () {
        return this.high === 0n && this.low === 0n
    }

    setNull () {
        this.high = 0n
        this.low = 0n
    }

    equals (o) {
        if (!(o instanceof BasicInt128) || o === null)
            return false
        else
            return this.high === o.high && this.low === o.low
    }

    hashCode () {
        return Number(this.high^this.low>>>32)
    }
    
    tobufBE() {
        let buf = Buffer.alloc(16);
        buf.writeBigInt64BE(this.high);
        buf.writeBigInt64BE(this.low, 8);
        return buf;
    }

    tobytes () {
        let buf = Buffer.alloc(16);
        if (this.isSmall) {
            buf.writeBigInt64LE(this.low);
            buf.writeBigInt64LE(this.high,8);
        } else {
            buf.writeBigInt64BE(this.high);
            buf.writeBigInt64BE(this.low, 8);
        }
        return buf;
    }

    toString () {
        if (this.hex128 !== null)
            return this.hex128;
        this.hex128 = this.buf.toString('hex');
        return this.hex128; 
    }

}
module.exports = BasicInt128;