'use strict';

//should not import any data type

var Util = new Object();

Util.dtypelen = function(dtype) {
    switch (dtype) {
        case 0: return 1; //VOID
        case 1: return 1; //BOOL
        case 2: return 1; //BYTE
        case 3: return 2; //SHORT
        case 4: return 4; //INT
        case 5: return 8; //LONG
        //date type
        case 6: return 4; //DATE
        case 7: return 4; //MONTH
        case 8: return 4; //TIME
        case 9: return 4; //MINUTE
        case 10: return 4; //SECOND
        case 11: return 4; //DATETIME
        case 12: return 8; //TIMESTAMP
        case 13: return 8; //NANOTIME
        case 14: return 8; //NANOTIMESTAMP
        //
        case 15: return 4; //FLOAT
        case 16: return 8; //DOUBLE
        case 19: return 16; //UUID
        case 30: return 16; //IPADDR
        case 31: return 16; //INT128
        default: return -1; //NOT FIXED
    }
}

Util.dtypeByName = function (name) {
    switch (name) {
        case 'void': return 0;
        case 'bool':
        case 'b': return 1;
        case 'byte': 
        case 'char': 
        case 'c': return 2;
        case 'short': 
        case 'h': return 3;
        case 'int': 
        case 'i': return 4;
        case 'long': 
        case 'l': return 5;
        case 'date': 
        case 'd': return 6;
        case 'month': 
        case 'M': return 7;  // simple name
        case 'time': 
        case 't': return 8;
        case 'minute': 
        case 'm': return 9;
        case 'second': 
        case 's': return 10;
        case 'datetime': 
        case 'D': return 11;
        case 'timestamp': 
        case 'T': return 12;
        case 'nanotime': 
        case 'ns': return 13;
        case 'nanotimestamp': 
        case 'Ns': return 14;
        case 'float': 
        case 'f': return 15;
        case 'double': 
        case 'F': return 16;
        case 'symbol': 
        case 'S': return 17;
        case 'string': 
        case 'W': return 18;
        case 'uuid': return 19;
        case 'ipaddr': 
        case 'ip': return 30;
        case 'int128': return 31;
        default: return -1;
    }
}

Util.nameBydtype = function (dtype) {
    switch (dtype) {
        case 0: return 'void'; //VOID
        case 1: return 'bool'; //BOOL
        case 2: return 'byte'; //BYTE
        case 3: return 'short'; //SHORT
        case 4: return 'int'; //INT
        case 5: return 'long'; //LONG
        case 6: return 'date'; //DATE
        case 7: return 'month'; //MONTH
        case 8: return 'time'; //TIME
        case 9: return 'minute'; //MINUTE
        case 10: return 'second'; //SECOND
        case 11: return 'datetime'; //DATETIME
        case 12: return 'timestamp'; //TIMESTAMP
        case 13: return 'nanotime'; //NANOTIME
        case 14: return 'nanotimestamp'; //NANOTIMESTAMP
        case 15: return 'float'; //FLOAT
        case 16: return 'double'; //DOUBLE
        case 17: return 'symbol';
        case 18: return 'string';
        case 19: return 'uuid';
        case 30: return 'ipaddr';
        case 31: return 'int128';
        default: return null; //NOT FIXED
    }
}

Util.dformByName = function (name) {
    switch (name) {
        case 'scalar': return 0;
        case 'vector': return 1;
        case 'pair': return 2;
        case 'matrix': 
        case 'mat': return 3;
        case 'set': return 4;
        case 'dictionary':
        case 'dict': return 5;
        case 'table': return 6;
        case 'chart': return 7;
        case 'chunk': return 8;
        default: return -1;
    }
}

Util.str2Buf = function (str, isSmall=1) {
    let buf = Buffer.alloc(str.length + 1);
    if (isSmall !== 1)
        str = str.split('').reverse().join('');
    buf.write(str);
    return buf;
}

function numberLize(...args) {
    let arr = new Array(args.length);
    for (let i=0; i< args.length; i++)
        arr[i] = Number(args[i]);
    return arr;
}

function ns2i(str) {
    const ns0 = '000000000';
    let i;
    for (i=0; i<str.length&&str[i]==='0'; i++);
    str += ns0.substring(str.length);
    return str.substring(i);
}

Util.timeFromStr = function (timestr) {
    const pdate = /^(\d{4})\-(0\d|1[0-2]|\d)\-?([0-2]\d|3[01]|\d)?$/;
    const ptimes = /^([01]\d|2[0-3]|\d)\:([0-5]\d|\d)\:?([0-5]\d|\d)?$/;
    const ptimens = /^([01]\d|2[0-3]|\d)\:([0-5]\d|\d)\:([0-5]\d|\d)\.(\d{1,9})$/;
    const pdatetimes = /^(\d{4})\-(0\d|1[0-2]|\d)\-([0-2]\d|3[01]|\d) ([01]\d|2[0-3]|\d)\:([0-5]\d|\d)\:([0-5]\d|\d)$/;
    const pdatetimens = /^(\d{4})\-(0\d|1[0-2]|\d)\-([0-2]\d|3[01]|\d) ([01]\d|2[0-3]|\d)\:([0-5]\d|\d)\:([0-5]\d|\d)\.(\d{1,9})/;

    if (pdate.test(timestr)) {
        let [_, year, month, day] = pdate.exec(timestr);
        [year, month, day] = numberLize(year, month, day);
        return {year: year, month: month, day: day};
    } else if (ptimes.test(timestr)) {
        let [_, hour, minute, second] = ptimes.exec(timestr);
        [hour, minute, second] = numberLize(hour, minute, second);
        return {hour: hour, minute: minute, second: second};
    } else if (ptimens.test(timestr)) {
        let [_, hour, minute, second, ns] = ptimens.exec(timestr);
        [hour, minute, second, ns] = numberLize(hour, minute, second, ns2i(ns));
        return {hour: hour, minute: minute, second: second, nS: ns};
    } else if (pdatetimes.test(timestr)) {
        let [_, year, month, day, hour, minute, second] = pdatetimes.exec(timestr);
        // console.log(year, month, day, hour, minute, second);
        [year, month, day, hour, minute, second] = numberLize(year, month, day, hour, minute, second);
        return {year: year, month: month, day: day, hour: hour, minute: minute, second: second};
    } else if (pdatetimens.test(timestr)) {
        let [_, year, month, day, hour, minute, second, ns] = pdatetimens.exec(timestr); 
        [year, month, day, hour, minute, second, ns] = numberLize(year, month, day, hour, minute, second, ns2i(ns));
        return {year: year, month: month, day: day, hour: hour, minute: minute, second: second, nS: ns};
    } else {
        return {};
    }

}

Util.formatBytes = function (buf) {
    let hexArray = new Array(buf.length);
    for (let i=0; i< buf.length; i++){
        let hc = buf[i].toString(16);
        if (hc.length === 1)
            hc = '0'+hc;
        hexArray[i] = hc;
    }
    let strArray = new Array(buf.length);
    for(let i=0; i<buf.length; i++){
        if (buf[i] === 0x0a)
            strArray[i] = '_n';
        else if (buf[i] === 32)
            strArray[i]= '__';
        else if ((buf[i]>=48 && buf[i]<=57) || (buf[i]>=65 && buf[i]<=90) || (buf[i]>=97 && buf[i]<=122)) {
                strArray[i] = ' '+String.fromCharCode(buf[i]);
        } else {
            strArray[i] = '..';
        }
    }
    return hexArray.length+":\n"+hexArray.join(" ")+"\n"+strArray.join(" ");
}

Util.scalar2Buf = function(value, isSmall=true) {
    let hdrBuf = value.hdrbytes();
    let buf = value.small(isSmall).tobytes();
    buf = Buffer.concat([hdrBuf, buf]);
    return buf;
}

Util.allocBuf = function (slen, dlen, blockSize=1024) {
    let buf = Buffer.allocUnsafe(slen+Math.ceil((dlen-slen)/blockSize)*blockSize);
    buf.fill(0);
    return buf;
}

module.exports = Util;