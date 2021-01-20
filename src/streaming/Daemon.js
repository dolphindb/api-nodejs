'use strict';

const net = require('net');
// const Util = require('../util');
const infolevel = require('../constants').infoLevel;
const Parser = require('../Parser');
const StreamReader = require('./StreamReader');

class Daemon {
    constructor (port, channel) {
        this.port = port;
        this.channel = channel;
        this.streamReader = new StreamReader(new Parser()).init();
    }

    run () {
        const cliArr = [];
        const server = net.createServer();
        server.on("connection", async (socket) => {
            let cli = {};
            cli.id = cliArr.length;
            cli.socket = socket;
            cliArr.push(cli);
            // this.channel.emit('join', cli.id, cli.socket);
            
            if (infolevel >= 1)
                console.log(`client${cli.id} ${socket.remoteFamily}, ${socket.remoteAddress}:${socket.remotePort}`);

            socket.on('data', (chunk) => {
                this.handle2(cli.id, chunk);
            })
            
            socket.on("error", (e)=> {
                console.log(e.message);
                socket.destroy();
            })
            socket.on("end", () => {
                console.log("client"+cli.id+" closed");
                socket.destroy();
            })
        });
        let relis = 0;
        server.on('error', (e) => {
            if (e.code === 'EADDRINUSE'){
                if (relis === 5){
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
        let streamReader = this.streamReader;
        let rbuf = streamReader.read(data);
        if (streamReader.isFull()){
            let topic = streamReader.topic;
            let res = streamReader.getResult();
            if(infolevel>=1)
                console.log(`${topic}, ${streamReader.nrow2r} rows have been read`);
            if(streamReader.df === 6 && streamReader.nrow === 0) {
                if(infolevel>=1)
                    console.log(`rbuf= ${streamReader} when empty table`);
            } else {
                let topics = topic.split(",");
                for (const t of topics){
                    let msg = res;
                    if(this.channel.msgAsTables[t]===true){
                        msg = {"tableName":this.channel.tableNames[t],"header":this.channel.headers[t],"body":res};
                    }
                    this.channel.subscriptions[t](msg);
                }
            }
            streamReader.init();
            if (rbuf.length > 0)
                this.handle2(id, rbuf);
        }
    }
}
module.exports = Daemon;