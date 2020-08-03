'use strict';

const BasicInt = require("./BasicInt");
const BasicByte = require("./BasicByte");
const BasicBool = require("./BasicBool");
const BasicShort = require("./BasicShort");
const BasicLong = require("./BasicLong");
const BasicDate = require("./BasicDate");
const BasicMonth = require("./BasicMonth");
const BasicTime = require("./BasicTime");
const BasicMinute = require("./BasicMinute");
const BasicSecond = require("./BasicSecond");
const BasicDateTime = require("./BasicDateTime");
const BasicTimeStamp = require("./BasicTimeStamp");
const BasicNanoTime = require("./BasicNanoTime");
const BasicFloat = require("./BasicFloat");
const BasicDouble = require("./BasicDouble");
const BasicVector = require("./BasicVector");
const BasicPair = require("./BasicPair");
const BasicMat = require("./BasicMat");
const BasicSet = require("./BasicSet");
const BasicDict = require("./BasicDict");
const BasicTable = require("./BasicTable");
const BasicNanoTimeStamp = require("./BasicNanoTimeStamp");
const BasicScalar = require("./BasicScalar");
const BasicUuid = require("./BasicUuid");
const BasicIpAddr = require("./BasicIpAddr");
const BasicInt128 = require("./BasicInt128");
const BasicNull = require("./BasicNull");
const BasicSymbol = require("./BasicSymbol");
const BasicChar = require("./BasicChar");

var DtCt = new Object();

function arrayLize (value, ftypect){
    if (value instanceof BasicScalar)
        return value;
    if (!(value instanceof Array))
        return ftypect(value);
    let v=value;
    for (let i=0; i<v.length; i++){
        v[i] = arrayLize(v[i], ftypect);
    }
    return v;
}

DtCt.Bool = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicBool(v);
    })
}

DtCt.Char = function (value) {
    return arrayLize( value, function (v) {
        return new BasicChar(v);
    })
}

DtCt.Byte = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicByte(v);
    })
}

DtCt.Short = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicShort(v);
    })
}

DtCt.Int = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicInt(v);
    })
}

DtCt.Long = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicLong(v);
    })
}

DtCt.Date = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicDate(v);
    })
}

DtCt.Month = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicMonth(v);
    })
}

DtCt.Time = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicTime(v);
    })
}

DtCt.Minute = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicMinute(v);
    })
}

DtCt.Second = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicSecond(v);
    })
}

DtCt.DateTime = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicDateTime(v);
    })
}

DtCt.TimeStamp = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicTimeStamp(v);
    })
}

DtCt.NanoTime = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicNanoTime(v);
    })
}

DtCt.NanoTimeStamp = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicNanoTimeStamp(v);
    })
}

DtCt.Float = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicFloat(v);
    })
}

DtCt.Double = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicDouble(v);
    })
}

DtCt.Vector = function (value) {
    return new BasicVector(value);
}

DtCt.Pair = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicPair(v);
    })
}

DtCt.Matrix = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicMat(v);
    })
}

DtCt.Set = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicSet(v);
    })
}

DtCt.Dict = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicDict(v);
    })
}

DtCt.Table = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicTable(v);
    });
}

DtCt.UUID = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicUuid(v);
    });
}

DtCt.IpAddr = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicIpAddr(v);
    });
}

DtCt.Int128 = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicInt128(v);
    });
}

DtCt.Null = function(value) {
    // value is data type
    return arrayLize (value,  function (v) {
        return new BasicNull(v);
    });
}

DtCt.Symbol = function (value) {
    return arrayLize (value,  function (v) {
        return new BasicSymbol(v);
    });
}

module.exports = DtCt;
