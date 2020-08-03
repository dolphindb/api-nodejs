'use strict';

var constants = Object.freeze({
    nullV: 16,
    byteMin: -128,
    shortMin: -32768,
    intMin: -(2**31),
    longMin: -(2n**63n),
    floatMin: -((2-2**-23)*2**127),
    doubleMin: -((2-2**-52)*2**1023),
    infoLevel: 0  //0: no info, 1: little info, 2: many info, 3: debug
});

module.exports = constants;