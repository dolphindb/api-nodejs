'use strict';

const Util = require('../util');

class VectorCheck {
    constructor (parser) {
        this.hlen = 10;
        this.parser = parser;
    }
    init(isSmall=true) {
        this.isSmall = isSmall;
        this.dt = -1;
        this.df = 1
        this.isful = false;
        this.state = 0;
        this.offset = 0;
        this.ncol = 0;
        this.nrow = 0;
        this.anyrow = 0;
        this.arr = null;
        this.pos = 0;
        this.result = [];
        return this;
    }
    getResult () {
        return this.result;
    }
    readInt(bs) {
        if(this.isSmall)
            return bs.readInt32LE();
        else
            return bs.readInt32BE();
    }
    isFull() {
        return this.isful;
    }
    check (data) {
        let cbuf = data;
        while(true) {
            if (this.state === 0){
                if (cbuf.length < this.hlen)
                    return cbuf;
                this.dt = data[0];
                this.df = data[1];
                this.nrow = this.readInt(cbuf.slice(2));
                this.ncol = this.readInt(cbuf.slice(6));
                this.offset += this.hlen;
                if (this.dt !== 25)
                    this.state = 1;
                else 
                    this.state = 2;
                cbuf = cbuf.slice(this.hlen);
                if(this.nrow === 0) {
                    this.isful = true;
                    return cbuf;
                } else {
                    this.result = new Array(this.nrow*this.ncol);
                    if (cbuf.length === 0)
                        break;
                }
            } else if(this.state === 1) {
                let dt = this.dt;
                let len = this.nrow*this.ncol;
                if (dt === 18 || dt === 17){
                    for (let i=this.pos; i<len; i++){
                        let j=0;
                        for(;j<cbuf.length&&cbuf[j]!==0;j++);
                        if (j===cbuf.length){
                            this.pos = i;
                            return cbuf;
                        }
                        j++;
                        this.offset += j;
                        this.result[i] = this.parser.bytes2DType(cbuf, dt);
                        cbuf = cbuf.slice(j);
                    }
                } else {
                    let s = Util.dtypelen(dt);
                    for (let i=this.pos; i<len; i++) {
                        if (cbuf.length < s){
                            this.pos = i;
                            return cbuf;
                        } 
                        this.offset += s;
                        this.result[i] = this.parser.bytes2DType(cbuf, dt);
                        cbuf = cbuf.slice(s);
                    }
                }
                this.isful = true;
                return cbuf;
            } else if (this.state === 2) {
                let len = this.nrow * this.ncol;
                if (this.arr === null){
                    this.arr = new Array(len);
                    for(let i=0; i<len; i++)
                        this.arr[i] = null;
                }
                for (let i=this.pos; i<len; i++) {
                    if (cbuf.length < 2){
                        this.pos = i;
                        return cbuf;
                    }
                    let dt = cbuf[0];
                    let df = cbuf[1];
                    if (df === 1) {
                        if (this.arr[i] === null)
                            this.arr[i] = new VectorCheck(this.parser).init(this.isSmall);
                        // vector
                        let vc = this.arr[i];
                        let offset = vc.offset;
                        let re = vc.check(cbuf);
                        this.offset += vc.offset-offset;
                        if (vc.isFull()){
                            this.anyrow = vc.nrow;
                            this.result[i] = vc.getResult();
                            cbuf = cbuf.slice(vc.offset-offset);
                        } else {
                            this.pos = i;
                            this.state = 3;
                            return re;
                        }
                    } else {
                        // scalar
                        if (dt === 18 || dt === 17) {
                            let j=2;
                            for (; j<cbuf.length&&cbuf[j]!==0; j++);
                            if (j===cbuf.length){
                                this.pos = i;
                                return cbuf;
                            }
                            j++;
                            this.offset += j;
                            this.result[i] = this.parser.readPacket(cbuf).value;
                            cbuf = cbuf.slice(j)
                        } else {
                            let len = 2+Util.dtypelen(dt);
                            if(cbuf.length < len){
                                this.pos = i;
                                return cbuf;
                            }
                            this.offset += len;
                            this.result[i] = this.parser.readPacket(cbuf).value;
                            cbuf = cbuf.slice(len);       
                        }
                    }
                }
                this.isful = true;
                return cbuf;
            } else if (this.state === 3) {
                let vc = this.arr[this.pos];
                let offset = vc.offset;
                let re = vc.check(cbuf);
                this.offset += vc.offset-offset;
                if (vc.isFull()) {
                    // this.offset += vc.offset;
                    this.result[this.pos] = vc.getResult();
                    cbuf = cbuf.slice(vc.offset-offset);
                    ++this.pos;
                    this.state = 2;
                    if (cbuf.length === 0)
                        break;
                } else {
                    return re;
                }
            }
        } 
    }
}
module.exports=VectorCheck;