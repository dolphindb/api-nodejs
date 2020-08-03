'use strict';

const tUtil = require('./typeUtil');
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
        if (this.username === "" || this.password === "")
            await this.socket.connect({host: this.host, port: this.port});
        else
            await this.socket.connect({host:this.host, port:this.port, username:this.username, password:this.password});
        await this.socket.write('API 0 8\nconnect\n');
        // console.log('send first msg');
        this.response = await this.socket.read();
        // console.log(this.response.toString('ascii'));
        this.updateID();;
    }

    async reconnect () {
        this.socket = new PromiseSocket();
        if (this.username === "" || this.password === "")
            await this.socket.connect({host: this.host, port: this.port});
        else
            await this.socket.connect({host:this.host, port:this.port, username:this.username, password:this.password});
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
            let error = null;
            this.socket.setTimeout(timeout);
            while(true){
                try {
                    let chunk = await this.socket.read();
                    this.buffer.write(chunk);
                } catch (e) {
                    if (e instanceof TimeoutError){
                        break;
                    } else {
                        error = e;
                        break;
                    }
                }
            }
            this.socket.setTimeout(0);
            if (error !== null){
                reject(error);
            } else {
                let rbuf = this.buffer.readAll();
                this.buffer.reset();
                if (infolevel >= 2)
                    console.log(`read all ${rbuf.length} bytes`);
                await this.reconnect();
                resolve(rbuf);
            }
        })
    }

    async run(script) {
        if (typeof script != 'string') throw Error('The script should be a string.');
        // console.log(script)
        let len = script.length + 7;
        let msg = 'API ' + this.sessionID + ' ' + len.toString() + '\n' + 'script' + '\n' + script;
        await this.socket.write(msg);
        // console.log('script Msg sent!');
        //this.response = await this.socket.read();
        this.response = await this.readAll();
        // console.log(Util.formatBytes(this.response));
        this.updateID();
        let res = this.parseResult();
        return res
    }

    status () {
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
            isSmall: isSmall,
            rest: rest
        }
    }

    parseResult () {
        let status = this.status();
        this.parser.isSmall = status.isSmall===1;
        if (infolevel >= 1)
            console.log("status: "+status.status+"\nendian: "+(status.isSmall?'LE':'BE'))
        //extract result
        let res = this.parser.readPacket(status.rest);
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
        let status = this.status();
        // console.log(status.rest);
        if (status.status === "OK")
            return true;
        else{
            console.log(status.status);
            return false;
        }
    }
}
module.exports = DBconnection;