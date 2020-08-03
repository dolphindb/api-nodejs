'use strict';

const Util = require('./util');

class BufferRe {
    constructor (initSize, blockSize=16384) {
        this.initSize = initSize;
        this.blockSize = blockSize;
        this.total = initSize;
        this.bufs = new Array(1);
        this.bufs[0] = Buffer.alloc(initSize);
        this.length = 1;
        this.offset = 0;
        this.offseti = 0;
        this.offsetp = 0;
    }
    reset() {
        this.offset = 0;
        this.offseti = 0;
        this.offsetp = 0;
    }
    setBlockSize(size) {
        this.blockSize = size;
    }
    __alloc (len) {
        let buf = Util.allocBuf(0,len,this.blockSize);
        this.total += buf.length;
        this.bufs[this.length++] = buf;
    }
    write (chunk) {
        if (chunk.length+this.offset>this.total)
            this.__alloc(chunk.length+this.offset-this.total);
        let i=this.offseti;
        let len = this.bufs[i].length-(this.offset-this.offsetp);
        if (len > chunk.length){
            chunk.copy(this.bufs[i], this.bufs[i].length-len);
            this.offset += chunk.length;
            return;
        }
        chunk.copy(this.bufs[i],this.bufs[i].length-len,0,len);
        this.offset += len;
        this.offsetp = this.offset;
        ++this.offseti;
        let total = chunk.length-len;
        for (++i;i<this.length&&total>0;i++){
            if (this.bufs[i].length>total){
                chunk.copy(this.bufs[i],0,len);
                this.offset += total;
                total = 0;
            } else {
                chunk.copy(this.bufs[i],0,len,len+this.bufs[i].length)
                len += this.bufs[i].length;
                this.offset += this.bufs[i].length;
                this.offsetp = this.offset;
                ++this.offseti;
                total -= this.bufs[i].length;
            }
        }
    }
    read(start, end) {
        if (start >= this.offset)
            return this.readAll();
        if (end >= this.offset)
            end = this.offset;
        let buf = Buffer.alloc(end-start);
        let s=0;
        let i=0;
        for(;i<this.length;i++){
            s += this.bufs[i].length;
            if (s>start)
                break;
        }
        let len = s-start;
        let ss = start;
        for(let j=this.bufs[i].length-len;j<this.bufs[i].length&&ss<end;j++){
            buf[ss-start] = this.bufs[i][j];
            ++ss;
        }
        for(++i;i<this.length&&ss<end;i++){
            for(let j=0;j<this.bufs[i].length&&ss<end; j++){
                buf[ss-start] = this.bufs[i][j];
                ++ss;
            }
        }
        return buf;
    }
    readAll() {
        let s=0;
        let buf = Buffer.alloc(this.offset);
        for (let i=0; i<this.length&&s<this.offset; i++){
            for(let j=0; j<this.bufs[i].length&&s<this.offset; j++){
                buf[s] = this.bufs[i][j];
                ++s;
            }
        }
        return buf;
    }
}
module.exports=BufferRe;