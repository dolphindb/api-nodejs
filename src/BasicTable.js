'use strict';

const BasicVector = require("./BasicVector");
const BasicInt = require("./BasicInt");
const Util = require("./util");

class BasicTable extends BasicVector{
    constructor (value) {
        if (value == null)
            super(null);
        else {
            let {tablename, colnames, types, data} = value;
            super(data);
            this.tablename = tablename;
            this.colnames = colnames;
            this.types = types;
        }
        this.dform = 6;
    }
    tobytes () {
        let byteArray = new Array();
        if(this.dt !== -1){
            let tbname = this.tablename;
            let colnames = this.colnames;
            let buf;
            if (tbname == null)
                tbname = "";
            if (colnames == null || colnames.length === 0){
                let ncol = this.value.length;
                colnames = new Array(ncol);
                for (let i=0; i<ncol; i++)
                    colnames[i] = 'col'+i;
            }
            byteArray.push(0, this.dform);
            let ncol = this.value.length;
            let nrow = this.value[0].length;
            let nrowbuf = (new BasicInt(nrow)).tobytes();
            let ncolbuf = (new BasicInt(ncol)).tobytes();
            for (const e of nrowbuf)
                byteArray.push(e);
            for (const e of ncolbuf)
                byteArray.push(e);
            buf = Util.str2Buf(tbname);
            for (const e of buf)
                byteArray.push(e);
            for (const name of colnames){
                buf = Util.str2Buf(name);
                for (const e of buf)
                    byteArray.push(e);
            }
            // buf = super.tobytes();
            let data = this.value;
            let types = this.types;
            for (let i=0; i<data.length; i++){
                let v = new BasicVector(data[i]);
                if (types != null && types.length !== 0)
                    v.dt = Util.dtypeByName(types[i]);
                buf = v.tobytes();
                for (const e of buf)
                    byteArray.push(e);
            }
        } else {
            return super.tobytes();
        }
        return Buffer.from(byteArray);
    }
}
module.exports = BasicTable;