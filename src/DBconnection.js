'use strict';

const tUtil = require('./typeUtil');
// const Util = require('./util');
const infolevel = require('./constants').infoLevel; 

const BasicScalar = require('./BasicScalar');
const BasicVector = require('./BasicVector');
const Parser = require('./Parser');
const {PromiseSocket, TimeoutError} = require("promise-socket");
const BufferRe = require('./BufferRe');

class DBconnection {
    constructor(){
        this.socket = new PromiseSocket();
        this.parser = new Parser();
        this.buffer = new BufferRe(4194304); //init buffer, 4 MB
    }

    async connect(host, port, username, password) {
        this.host = host;
        this.port = port;
        this.username = username || "";
        this.password = password || "";
        this.sessionID = ""; 
        this.response = "";  //store the returned message using buffer
        await this.socket.connect({host: this.host, port: this.port});
        if (this.username !== "" && this.password !== "")
            await this.login(this.username, this.password);
            
        await this.socket.write('API 0 8\nconnect\n');
        // console.log('send first msg');
        this.response = await this.socket.read();
        // console.log(this.response.toString('ascii'));
        this.updateID();
    }

    async login(username, password) {
        await this.run(`login("${username}", "${password}")`);
    }

    async reconnect () {
        this.socket = new PromiseSocket();
        await this.socket.connect({host: this.host, port: this.port});
        if (this.username !== "" && this.password !== "")
            await this.login(this.username, this.password);
        await this.socket.write('API 0 8\nconnect\n');
        this.response = await this.socket.read();
        this.updateID();
    }

    async close() {
        await this.socket.destroy();
    }

    updateID() {
        let endPos = this.response.indexOf(32); //' '
        this.sessionID = this.response.slice(0, endPos).toString();
    }

    readAll (timeout=500) {
        return new Promise(async (resolve,reject) => {
            const socket = this.socket.stream;
            const that = this;

            function chunkHandler (chunck) {
                that.buffer.write(chunck);
            }

            function errorHandler (e) {
                reject(e);
            }

            let data = await this.socket.read();
            this.buffer.write(data);

            socket.setTimeout(timeout);
            socket.resume();
            socket.once('timeout', () => {
                socket.removeListener('data', chunkHandler);
                socket.removeListener('error', errorHandler)
                let rbuf = this.buffer.readAll();
                this.buffer.reset();
                if (infolevel >= 2)
                    console.log(`read all ${rbuf.length} bytes`);
                resolve(rbuf);
            })

            socket.on('data', chunkHandler);

            socket.once('error', errorHandler);
        })
    }

    async run(script) {
        if (typeof script != 'string') throw Error('The script should be a string.');
        // console.log(script)
        let len = script.length + 7;
        let msg = 'API ' + this.sessionID + ' ' + len.toString() + '\n' + 'script' + '\n' + script;
        await this.socket.write(msg);
        // console.log('script Msg sent!');
        // this.response = await this.socket.read();
        this.response = await this.readAll();
        //console.log(Util.formatBytes(this.response));
        this.updateID();
        let res = this.parseResult();
        return res
    }

    head () {
        let endPos = this.response.indexOf(32);
        let rest = this.response.slice(endPos + 1);
        endPos = rest.indexOf(32);  //' '
        //get result number
        let num = rest[0] - 48;
        endPos = rest.indexOf(10); //'\n'
        //Little Endian: isSmall = 1
        let isSmall = rest[endPos - 1] - 48;
        rest = rest.slice(endPos + 1);
        //extract OK
        endPos = rest.indexOf(10);
        let status = rest.slice(0, endPos).toString();
        rest = rest.slice(endPos + 1);
        return {
            status: status,
            num: num,
            isSmall: isSmall,
            rest: rest
        }
    }

    parseResult () {
        let head = this.head();
        this.parser.isSmall = head.isSmall===1;
        if (infolevel >= 1)
            console.log("status: "+head.status+"\nendian: "+(head.isSmall?'LE':'BE'))
        //extract result
        if (head.rest.length === 0)
            return;
        let res = this.parser.readPacket(head.rest);
        //console.log(res);
        return res.value;
    }

    arg2bytes(args) {
        let buf = Buffer.alloc(0);
        for (let i=0; i<args.length; i++){
            let arg = args[i];
            if (arg instanceof BasicScalar){
                buf = Buffer.concat([buf,arg.hdrbytes(),arg.tobytes()]);
            } else if (arg instanceof Array) {
                buf = Buffer.concat([buf, new BasicVector(arg).tobytes()]);
            } else if (arg instanceof BasicVector) {
                buf = Buffer.concat([buf, arg.tobytes()]);
            } else {
                let tmpbuf = tUtil.scalar2BufR(arg,{header: true});
                if (tmpbuf !== null)
                    buf = Buffer.concat([buf,tmpbuf]);
                else {
                    console.log("unknow type");
                    return null;
                }
            } 
        }
        return buf;
    }

    async runFunc(funcName, ...args) {
        let len = 13 + funcName.length;
        let header = `API ${this.sessionID} ${len}\nfunction\n${funcName}\n${args.length}\n1`;
        //push header
        let buf = Buffer.from(header);
        //push data
        let argsbuf = this.arg2bytes(args);
        if (argsbuf === null)
            return;
        buf = Buffer.concat([buf, argsbuf]);
        // console.log(Util.formatBytes(buf));
        await this.socket.write(buf);
        // console.log('runFunc Msg sent!');
        this.response = await this.socket.read();
        // console.log(Util.formatBytes(this.response))
        this.updateID();
        let res = this.parseResult();
        return res;
    }

    async upload (varnames, ...vars) {
        let len = 13 + varnames.length;
        let header = `API ${this.sessionID} ${len}\nvariable\n${varnames}\n${vars.length}\n1`;
        let buf = Buffer.from(header);
        let argsbuf = this.arg2bytes(vars);
        if (argsbuf === null)
            return;
        buf = Buffer.concat([buf, argsbuf]);
        // console.log(Util.formatBytes(buf));
        await this.socket.write(buf);
        // console.log('upload Msg sent!');
        this.response = await this.socket.read();
        // console.log(Util.formatBytes(this.response))
        this.updateID();
        let res = this.parseResult();
        return res;
    }
}
module.exports = DBconnection;