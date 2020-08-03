'use strict';

// const Util = require("./util");
const tUtil = require("./typeUtil");
const constants = require('./constants');

const BasicScalar = require("./BasicScalar");
// const BasicNull = require("./BasicNull");
const BasicInt = require("./BasicInt");
// const BasicString = require("./BasicString");


class BasicVector {
    constructor (value) {
        this.value = value;
        this.dform = 1;
        this.dt = this.elementDtype();
    }
    elementDtype () {
        if (this.value == null)
            return -1;
        if (this.value.length == 0)
            return 25;
        let dt = -1;
        let v = this.value;
        for (let i=0; i<v.length; i++){
            if (v[i] instanceof BasicScalar) {
                if (dt === -1)
                    dt = v[i].dtype;
                else if (dt !== v[i].dtype) {
                    dt = 25; //any
                    break;
                }
            } else {
                let dtr = tUtil.scalarTypeR(v[i]);
                if (dtr === -1){
                    dt =25;
                    break;
                }
                if (dt === -1)
                    dt = dtr;
                else if (dt !== dtr){
                    dt = 25;
                    break;
                }
            } 
        }
        return dt;
    }
    tobytes () {
        let dt = this.dt;
        if (dt !== -1){
            let buf;
            let byteArray = new Array();
            let v = this.value;
            byteArray.push(dt, 1); // vector header
            let nrowbuf = (new BasicInt(v.length)).tobytes();
            let ncolbuf = (new BasicInt(1)).tobytes();
            for (let e of nrowbuf)
                byteArray.push(e);
            for (let e of ncolbuf)
                byteArray.push(e);
            
            if (dt !== 25) {
                // scalar
                for(let i=0; i<v.length; i++){
                    buf = tUtil.scalar2BufR(v[i],{header: false, dt: dt});
                    for (const e of buf)
                        byteArray.push(e);
                }
            } else {
                // any
                for (let i=0; i<v.length; i++){
                    if (v[i] instanceof Array){
                        buf = (new BasicVector(v[i])).tobytes();
                    } else {
                        buf = tUtil.scalar2BufR(v[i], {header: true});
                        if (buf === null)
                            buf = v[i].tobytes();
                    }
                    for (const e of buf)
                        byteArray.push(e);
                }
            }
            return Buffer.from(byteArray);
        } else {
            return Buffer.from([0,0,constants.nullV]);
        }  
    }
}
module.exports = BasicVector;