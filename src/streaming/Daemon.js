'use strict';

const net = require('net');
// const Util = require('../util');
// const infolevel = require('../constants').infoLevel;
const Parser = require('../Parser');
const StreamReader = require('./StreamReader');

class Daemon {
    constructor (port, channel) {
        this.port = port;
        this.channel = channel;
        this.parser = new Parser();
        this.streamReader = new StreamReader().init();
        this.buffer = Buffer.alloc(4194304); // 4MB
        this.buflen = 0;
    }

    run () {
        const cliArr = [];
        const server = net.createServer();
        server.on("connection", async (socket) => {
            let cli = {};
            cli.id = cliArr.length;
            cli.socket = socket;
            cliArr.push(cli);
            this.channel.emit('join', cli.id, cli.socket);

            // let byteArray = [];
            // let buflen = 0;
            // let buffer = Buffer.alloc(33554432); //32MB
            // const allocblock = 1024;
            // const timeout = 1000;

            // socket.setTimeout(timeout);
            // socket.on('timeout', () => {
            //     if (buflen !== 0) {
            //         console.log('all data get, bytes: '+buflen);
            //         if (buffer.length < buflen)
            //             buffer = Buffer.allocUnsafe(buffer.length+Math.ceil((buflen-buffer.length)/allocblock)*allocblock);
            //         buffer.fill(0);
            //         for (let i=0; i<buflen; i++)
            //             buffer[i] = byteArray[i];
                        
            //         this.handle(cli.id, buffer.slice(0,buflen));
            //         buflen = 0;
            //     } else {
            //         // console.log('no data');
            //     }
            //     socket.setTimeout(timeout);
            // })

            socket.on('data', (chunk) => {
                // for (const e of chunk)
                //     byteArray[buflen++] = e;
                this.handle2(cli.id, chunk);
            })
            
            socket.on("error", (e)=> {
                console.log(e.message);
                socket.destroy();
            })
            socket.on("end", () => {
                console.log("client"+cli.id+" closed");
            })
        });
        let relis = 0;
        server.on('error', (e) => {
            if (e.code === 'EADDRINUSE'){
                if (relis === 10){
                    server.close();
                    throw e;
                }
                setTimeout(() => {
                    relis += 1;
                    console.log("address in use, retrying...");
                    server.close();
                    server.listen(this.port, () => {
                        console.log(`listening on ${this.port}...`);
                    })
                }, 1000 * 2**relis);
            } else {
                throw e;
            }
        });
        server.listen(this.port, () => {
            console.log(`listening on ${this.port}...`);
        })
    }

    handle2 (id, data) {
        // console.log(data);
        let parser = this.parser;
        let streamReader = this.streamReader;
        let rbuf = streamReader.read(data);
        // console.log(streamReader.nrow2r+' rows to read');
        // let value;
        if (streamReader.isFull()){
            let buf = data;
            if (this.buflen !== 0)
                buf = Buffer.concat([this.buffer.slice(0,this.buflen), buf]);
            parser.isSmall = streamReader.isSmall
            let topic = streamReader.topic;
            let res = parser.readPacket(buf.slice(streamReader.pdata,streamReader.offset));
            //console.log(topic);
            console.log(topic, streamReader.nrow2r+" rows have been read");
            if(streamReader.df === 6 && streamReader.nrow === 0) {
                // console.log("empty table");
            } else {
                let topics = topic.split(",");
                for (const t of topics)
                    this.channel.emit(t, res.value);
            }
            streamReader.init();
            this.buflen = 0;
            this.buffer.fill(0);
            if (rbuf.length > 0)
                this.handle2(id, rbuf);
        } else {
            if (this.buflen+data.length > this.buffer.length)
                this.buffer = Buffer.allocUnsafe(this.buffer.length+Math.ceil((this.buflen+data.length-this.buffer.length)/1024)*1024);
            data.copy(this.buffer, this.buflen);
            this.buflen += data.length;
            // console.log('incomplete data, need more, state: '+streamReader.state);
        }
    }

    // handle (id, data) {
    //     let parser = this.parser;    
    //     let offset = 0;
    //     let isSmall = data[0];
    //     offset += 1;
    //     parser.isSmall = isSmall===1;
    //     let _x = parser.bytes2DType(data.slice(offset,offset+8), 5);
    //     console.log('_x:', _x);
    //     offset += 8;
    //     let msgid = parser.bytes2DType(data.slice(offset,offset+8), 5);
    //     console.log('message id: '+msgid);
    //     offset += 8;
    //     let topic = parser.bytes2DType(data.slice(offset), 18);
    //     offset += topic.length + 1;
    //     console.log(topic);
    //     let dt=data[offset], df=data[offset+1];
    //     let res = parser.readPacket(data.slice(offset));
    //     let value = res.value;
    //     offset += res._block_len;
    //     // res = null;
    //     if (df === 6 && value.data[0].length === 0){
    //         console.log('empty table');
    //     }
    //     else {
    //         let topics = topic.split(',');
    //         for (const topic of topics)
    //             this.channel.emit(topic, value);
    //     }
    //     let rest = data.slice(offset);
    //     if (rest.length > 0)
    //         this.handle(id, rest);
    // }
}
module.exports = Daemon;
