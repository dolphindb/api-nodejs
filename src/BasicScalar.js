'use strict';

class BasicScalar {
    constructor () {
        this.value = null;
        this.dform = 0;
        this.isSmall = true;
    }
    tobytes () {
        return null;
    }
    small (isSmall = true) {
        this.isSmall = isSmall;
        return this;
    }
    hdrbytes () {
        return Buffer.from([this.dtype, this.dfrom]);
    }
}
module.exports = BasicScalar;