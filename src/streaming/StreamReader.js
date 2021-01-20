'use strict';

const TableCheck = require("./TableCheck");
const VectorCheck = require("./VectorCheck");

class StreamReader {
    constructor (parser) {
        this.hlen = 17;
        this.msgid = 0n;
        this.parser = parser;
    }
    init() {
        this.isSmall = true;
        this.state = 0;
        this.buf = null;
        this.topic = null;
        this.nrow2r = 0;
        this.nrow = 0;
        this.ncol = 0;
        this.df = 1;
        this.dt = -1;
        this.offset = 0;
        this.pdata = 0;
        this.tc = null;
        this.vc = null;
        this.isful = false;
        this.result = null;
        return this;
    }
    getResult () {
        return this.result;
    }
    readInt(bs){
        if (this.isSmall)
            return bs.readInt32LE();
        else
            return bs.readInt32BE();
    }
    readLong(bs) {
        if (this.isSmall)
            return bs.readBigInt64LE();
        else
            return bs.readBigInt64BE();
    }
    readString(bs, end){
        if (this.isSmall)
            return bs.slice(0,end).toString();
        else
            return bs.slice(0,end).reverse().toString();
    }
    isFull() {
        return this.isful;
    }
    read(data) {
        let cbuf = data;
        if (this.buf != null)
            cbuf = Buffer.concat([this.buf,cbuf]);
        while(true) {
            if (this.state === 0) {
                if (cbuf.length < this.hlen){
                    this.buf = cbuf;
                    // console.log('incomplete stream header');
                    break;
                }
                this.buf = null;
                this.isSmall = cbuf[0]===1;
                this.parser.isSmall = this.isSmall;
                let _x = this.readLong(cbuf.slice(1));
                let msgid = this.readLong(cbuf.slice(9));
                this.nrow2r = Number(msgid - this.msgid);
                this.msgid = msgid;
                this.offset += this.hlen;
                this.state = 1;
                cbuf = cbuf.slice(this.hlen);
                if (cbuf.length === 0)
                    break;
            } else if (this.state === 1) {
                //topic
                let j=0;
                for(;j<cbuf.length&&cbuf[j]!==0;j++);
                if(j===cbuf.length){
                    this.buf = cbuf;
                    // console.log('incomplete topic');
                    break;
                }
                this.topic = this.readString(cbuf,j);
                ++j;
                this.buf = null;
                this.state = 2;
                this.offset += j;
                this.pdata = this.offset;
                cbuf = cbuf.slice(j);
                if (cbuf.length === 0)
                    break;
            } else if (this.state === 2) {
                if (cbuf.length < 10){
                    this.buf = cbuf;
                    // console.log('incomplete common header');
                    break;
                }
                this.buf = null;
                this.dt = cbuf[0];
                this.df = cbuf[1];
                this.nrow = this.readInt(cbuf.slice(2));
                this.ncol = this.readInt(cbuf.slice(6));
                if (this.df === 6 && this.nrow === 0) {
                    this.state = 3;
                } else if (this.df === 1) {
                    this.state = 4;
                } else {
                    throw new Error("message body has an invalid format. Vector or table is expected");
                }
            } else if (this.state === 3) {
                if (this.tc === null)
                    this.tc = new TableCheck(this.parser).init(this.isSmall);
                let tc = this.tc;
                let offset = tc.offset
                let re = tc.check(cbuf);
                this.offset += tc.offset-offset;
                if (tc.isFull()) {
                    --this.msgid;
                    this.nrow2r = 0;
                    this.isful = true;
                    this.buf = null;
                    this.result = tc.getResult();
                    cbuf = cbuf.slice(tc.offset-offset);
                    return cbuf;
                } else {
                    this.buf = re;
                    // console.log('incomplete table data');
                    break;
                }
            } else if (this.state === 4) {
                if (this.vc === null) 
                    this.vc = new VectorCheck(this.parser).init(this.isSmall);
                let vc = this.vc;
                let offset = vc.offset;
                let re = vc.check(cbuf);
                this.offset += vc.offset-offset;
                if (vc.isFull()) {
                    // this.offset += vc.offset;                   
                    this.isful = true;
                    this.buf = null;
                    this.result = vc.getResult();
                    cbuf = cbuf.slice(vc.offset-offset);
                    return cbuf;
                } else {
                    this.buf = re;
                    // console.log('incomplete vector data');
                    break;
                }
            }
        }
    }
}
module.exports=StreamReader;