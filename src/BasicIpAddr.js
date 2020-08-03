'use strict';

const BasicInt128 = require("./BasicInt128");

class BasicIpAddr extends BasicInt128{
    constructor (value) {
        if (typeof value === 'string'){
            const re = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
            if (re.test(value)){
                let low = 0;
                let ips = value.split(/\./);
                for (let i=0;i<ips.length;i++)
                    low = low * 256 + Number(ips[i]);
                super({hig: 0n, low: BigInt(low)});
            } else {
                super(value);
            }
        } else {
            super (value);
        }
        this.ipaddr = null;
        this.dtype = 30;
    }

    toString () {
        if (this.ipaddr !== null)
            return this.ipaddr;
        if (this.high === 0n){
            //ipv4
            this.ipaddr = this.buf.slice(12).join(".");
            return this.ipaddr;
        }
        //
        return super.toString()
    }
}
module.exports = BasicIpAddr;