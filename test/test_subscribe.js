
'use strict';

async function test_subscribe(){
    var assert = require('assert')
    var DBconnection = require('../src/DBconnection') //import API module
    var DT = require('../src/DT') 
    var Client = require('../src/streaming/Client');
    var myConnect = new DBconnection()
    var config = require("./setup/settings")
    var client = new Client(config.SUBPORT)

    before(async function() {
        var config = require("./setup/settings")
        await myConnect.connect(config.HOST, config.PORT, "admin", "123456");
                 
    });

    after(function () {
        return
      });
    
    describe('#subscribe.js', function() {
        describe('#subscribe()', function() {
            it('subscribe offset 0', async function() {
                this.timeout(8000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0], ['A', 'B', 'C', 'D', 'E'])
                assert.equal(arr[0][1].toString(), '2012-1-1,2012-1-2,2012-1-3,2012-1-4,2012-1-5')
                assert.deepEqual(arr[0][2], [20.5, 45.2, 15.6, 58.4, 12.0])
                assert.deepEqual(arr[0][3], [2200, 1500, 4800, 5900, 4600])
                //write again
                var script = '' +
                'tmp = table(symbol(`A`B) as sym, 2012.01.06..2012.01.07 as date, [50.2, 36.5] as price, [4800, 7800] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                await myConnect.run('sleep(3000)')
                assert.deepEqual(arr[1][0], ['A', 'B'])
                assert.equal(arr[1][1].toString(), '2012-1-6,2012-1-7')
                assert.deepEqual(arr[1][2], [50.2, 36.5])
                assert.deepEqual(arr[1][3], [4800, 7800])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe offset -1', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:-1})
                await myConnect.run("sleep(2000)")
                assert.deepEqual(arr, [])
                //write data again, and subscriber will receive data
                var script = '' +
                'tmp = table(symbol(`A`B) as sym, 2012.01.06..2012.01.07 as date, [50.2, 36.5] as price, [4800, 7800] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                await myConnect.run('sleep(3000)')
                assert.deepEqual(arr[0][0], ['A', 'B'])
                assert.equal(arr[0][1].toString(), '2012-1-6,2012-1-7')
                assert.deepEqual(arr[0][2], [50.2, 36.5])
                assert.deepEqual(arr[0][3], [4800, 7800])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe offset 2', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:2})
                await myConnect.run("sleep(2000)")
                assert.deepEqual(arr[0][0], ['C','D','E'])
                assert.equal(arr[0][1].toString(), '2012-1-3,2012-1-4,2012-1-5')
                assert.deepEqual(arr[0][2], [15.6, 58.4, 12.0])
                assert.deepEqual(arr[0][3], [4800, 5900, 4600])
                //write data again, and subscriber will receive data
                var script = '' +
                'tmp = table(symbol(`A`B) as sym, 2012.01.06..2012.01.07 as date, [50.2, 36.5] as price, [4800, 7800] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                await myConnect.run('sleep(2000)')
                assert.deepEqual(arr[1][0], ['A', 'B'])
                assert.equal(arr[1][1].toString(), '2012-1-6,2012-1-7')
                assert.deepEqual(arr[1][2], [50.2, 36.5])
                assert.deepEqual(arr[1][3], [4800, 7800])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe offset larger than streamTable size', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:5})
                await myConnect.run("sleep(2000)")
                assert.deepEqual(arr, [])
                //write data again, and subscriber will receive data
                var script = '' +
                'tmp = table(symbol(`A`B) as sym, 2012.01.06..2012.01.07 as date, [50.2, 36.5] as price, [4800, 7800] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                await myConnect.run('sleep(2000)')
                assert.deepEqual(arr[0][0], ['A', 'B'])
                assert.equal(arr[0][1].toString(), '2012-1-6,2012-1-7')
                assert.deepEqual(arr[0][2], [50.2, 36.5])
                assert.deepEqual(arr[0][3], [4800, 7800])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe offset not specified', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1})
                await myConnect.run("sleep(2000)")
                assert.deepEqual(arr, [])
                var script = ''+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.06..2012.01.10 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                await myConnect.run('sleep(2000)')
                assert.deepEqual(arr[0][0], ['A', 'B', 'C', 'D', 'E'])
                assert.equal(arr[0][1].toString(), '2012-1-6,2012-1-7,2012-1-8,2012-1-9,2012-1-10')
                assert.deepEqual(arr[0][2], [20.5, 45.2, 15.6, 58.4, 12.0])
                assert.deepEqual(arr[0][3], [2200, 1500, 4800, 5900, 4600])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('multiple subscription', async function() {
                this.timeout(20000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr1 = []
                var arr2 = []
                function f1(msg){
                    arr1.push(msg)
                }
                function f2(msg){
                    arr2.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0})
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub2", {handler:f2, offset:0})
                await myConnect.run("sleep(5000)")
                assert.deepEqual(arr1[0][0], ['A', 'B', 'C', 'D', 'E'])
                assert.equal(arr1[0][1].toString(), '2012-1-1,2012-1-2,2012-1-3,2012-1-4,2012-1-5')
                assert.deepEqual(arr1[0][2], [20.5, 45.2, 15.6, 58.4, 12.0])
                assert.deepEqual(arr1[0][3], [2200, 1500, 4800, 5900, 4600])
                assert.deepEqual(arr2[0][0], ['A', 'B', 'C', 'D', 'E'])
                assert.equal(arr2[0][1].toString(), '2012-1-1,2012-1-2,2012-1-3,2012-1-4,2012-1-5')
                assert.deepEqual(arr2[0][2], [20.5, 45.2, 15.6, 58.4, 12.0])
                assert.deepEqual(arr2[0][3], [2200, 1500, 4800, 5900, 4600])
                //unsubscribe one
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
                //write data again
                var script = ''+
                'tmp = table(symbol(`A`B) as sym, 2012.01.06..2012.01.07 as date, [50.2, 36.5] as price, [4800, 7800] as qty) \n'+
                'trades.append!(tmp) '
                await myConnect.run(script)
                await myConnect.run("sleep(5000)")
                assert.deepEqual(arr2[1][0], ['A', 'B'])
                assert.equal(arr2[1][1].toString(), '2012-1-6,2012-1-7')
                assert.deepEqual(arr2[1][2], [50.2, 36.5])
                assert.deepEqual(arr2[1][3], [4800, 7800])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub2")
            });

            it('subscribe filter string', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'setStreamTableFilterColumn(trades, `sym) \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, filter:DT.Symbol(['C','D'])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0], ['C', 'D'])
                assert.equal(arr[0][1].toString(), '2012-1-3,2012-1-4')
                assert.deepEqual(arr[0][2], [15.6, 58.4])
                assert.deepEqual(arr[0][3], [4800, 5900])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            }); 

            it('subscribe filter char', async function() {
                this.timeout(10000)
                var script = 
                "share streamTable(100:0, `sym`date`price`char, [SYMBOL, DATE, DOUBLE, CHAR]) as trades \n"+
                "setStreamTableFilterColumn(trades, `char) \n"+
                "tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, ['a','b','c','d','d'] as char) \n"+
                "trades.append!(tmp)"
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, filter:DT.Char(['c','d'])})
                await myConnect.run("sleep(3000)")
                console.log(arr)        
                assert.deepEqual(arr[0][0], ['C','D','E'])
                assert.equal(arr[0][1].toString(), '2012-1-3,2012-1-4,2012-1-5')
                assert.deepEqual(arr[0][2], [15.6, 58.4,12.0])
                assert.deepEqual(arr[0][3], ['c','d','d'])
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            }); 

            it('subscribe filter int', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`qty, [INT, DATE, DOUBLE, INT]) as trades \n'+
                'setStreamTableFilterColumn(trades, `id) \n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0,filter:DT.Int([2,3])})
                await myConnect.run("sleep(3000)")      
                assert.deepEqual(arr[0][0],[2,3]) 
                assert.equal(arr[0][1].toString(), '2012-1-2,2012-1-3')
                assert.deepEqual(arr[0][2], [ 45.2, 15.6])
                assert.deepEqual(arr[0][3], [ 1500, 4800]) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });
 
            it('subscribe filter short', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`short, [INT, DATE, DOUBLE, SHORT]) as trades \n'+
                'setStreamTableFilterColumn(trades, `short) \n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as short) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0,filter:DT.Short([1500,4800])})
                await myConnect.run("sleep(3000)")      
                assert.deepEqual(arr[0][0],[2,3]) 
                assert.equal(arr[0][1].toString(), '2012-1-2,2012-1-3')
                assert.deepEqual(arr[0][2], [ 45.2, 15.6])
                assert.deepEqual(arr[0][3], [ 1500, 4800]) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter long', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`long, [INT, DATE, DOUBLE, LONG]) as trades \n'+
                'setStreamTableFilterColumn(trades, `long) \n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as long) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0,filter:DT.Long([1500,4800,0])})
                await myConnect.run("sleep(3000)")      
                console.log(arr)        
                assert.deepEqual(arr[0][0],[2,3]) 
                assert.equal(arr[0][1].toString(), '2012-1-2,2012-1-3')
                assert.deepEqual(arr[0][2], [45.2, 15.6])
                assert.deepEqual(arr[0][3], [1500, 4800]) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter float', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`float, [INT, DATE, DOUBLE, FLOAT]) as trades \n'+
                'setStreamTableFilterColumn(trades, `float) \n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [1.1,2.2,3.3,4.4,0.0] as float) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0,filter:DT.Float([2.2,0.0,3.3])})
                await myConnect.run("sleep(3000)")      
                console.log(arr)        
                assert.deepEqual(arr[0][0],[2,3,5]) 
                assert.equal(arr[0][1].toString(), '2012-1-2,2012-1-3,2012-1-5')
                assert.deepEqual(arr[0][2][0].toFixed(1), 45.2)
                assert.deepEqual(arr[0][2][1].toFixed(1), 15.6)
                assert.deepEqual(arr[0][2][2].toFixed(1), 12.0)
                assert.deepEqual(arr[0][3][0].toFixed(1), 2.2) 
                assert.deepEqual(arr[0][3][1].toFixed(1), 3.3) 
                assert.deepEqual(arr[0][3][2].toFixed(1), 0.0) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });


            it('subscribe filter double', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`double, [INT, DATE, DOUBLE, DOUBLE]) as trades \n'+
                'setStreamTableFilterColumn(trades, `double) \n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [1.1,2.2,3.3,4.4,0.0] as double) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0,filter:DT.Double([2.2,0.0,3.3])})
                await myConnect.run("sleep(3000)")      
                console.log(arr)        
                assert.deepEqual(arr[0][0],[2,3,5]) 
                assert.equal(arr[0][1].toString(), '2012-1-2,2012-1-3,2012-1-5')
                assert.deepEqual(arr[0][2][0].toFixed(1), 45.2)
                assert.deepEqual(arr[0][2][1].toFixed(1), 15.6)
                assert.deepEqual(arr[0][2][2].toFixed(1), 12.0)
                assert.deepEqual(arr[0][3][0].toFixed(1), 2.2) 
                assert.deepEqual(arr[0][3][1].toFixed(1), 3.3) 
                assert.deepEqual(arr[0][3][2].toFixed(1), 0.0) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter UUID', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`uuid, [INT, DATE, DOUBLE, UUID]) as trades \n'+
                'setStreamTableFilterColumn(trades, `uuid)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price,\n'+
                '[uuid("5d212a78-cc48-e3b1-4235-b4d91473ee87"),uuid("5d212a78-cc48-e3b1-4235-b4d91473ee88"),uuid("5d212a78-cc48-e3b1-4235-b4d91473ee89"),uuid("5d212a78-cc48-e3b1-4235-b4d91473ee90"),uuid("5d212a78-cc48-e3b1-4235-b4d91473ee91")] as uuid) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, 
                    filter:DT.UUID(["5d212a78-cc48-e3b1-4235-b4d91473ee87"])})
                await myConnect.run("sleep(3000)")
                console.log(arr)
                assert.deepEqual(arr[0][0],1) 
                assert.equal(arr[0][1].toString(), '2012-1-1')
                assert.deepEqual(arr[0][2].toFixed(1),20.5 )
                assert.deepEqual(arr[0][3].toString(), '5d212a78-cc48-e3b1-4235-b4d91473ee87') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter ipaddr', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`ipaddr, [INT, DATE, DOUBLE, IPADDR]) as trades \n'+
                'setStreamTableFilterColumn(trades, `ipaddr)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price,'+
                '[ipaddr("192.168.1.13"),ipaddr("192.168.1.14"),ipaddr("192.168.1.15"),,] as ipaddr) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, 
                    filter:DT.IpAddr(["192.168.1.13"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],1) 
                assert.equal(arr[0][1].toString(), '2012-1-1')
                assert.deepEqual(arr[0][2].toFixed(1), 20.5)
                assert.deepEqual(arr[0][3].toString(), '192.168.1.13') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter int128', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`int128, [INT, DATE, DOUBLE, INT128]) as trades \n'+
                'setStreamTableFilterColumn(trades, `int128)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price,'+
                '[int128("e1671797c52e15f763380b45e841ec32"),int128("e1671797c52e15f763380b45e841ec33"),,,] as int128) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, 
                    filter:DT.Int128(["e1671797c52e15f763380b45e841ec32"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],1) 
                assert.equal(arr[0][1].toString(), '2012-1-1')
                assert.deepEqual(arr[0][2], 20.5)
                assert.deepEqual(arr[0][3].toString(), 'e1671797c52e15f763380b45e841ec32') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter date', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`qty, [INT, DATE, DOUBLE, INT]) as trades \n'+
                'setStreamTableFilterColumn(trades, `date)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, filter:DT.Date(["2012-01-01","2012-01-05"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],[1,5]) 
                assert.equal(arr[0][1].toString(), '2012-1-1,2012-1-5')
                assert.deepEqual(arr[0][2], [ 20.5,12.0])
                assert.deepEqual(arr[0][3], [ 2200, 4600]) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

            it('subscribe filter month', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`month, [INT, DATE, DOUBLE, MONTH]) as trades \n'+
                'setStreamTableFilterColumn(trades, `month)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, ] as price, [2012.03M,2012.04M,2012.05M,2012.06M,2012.07M] as month) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, filter:DT.Month(["2012-03","2012-07"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],[1,5]) 
                assert.equal(arr[0][1].toString(), '2012-1-1,2012-1-5')
                assert.deepEqual(arr[0][2], [ 20.5,null])
                assert.deepEqual(arr[0][3].toString(),'2012-3,2012-7') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

           it('subscribe filter time', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`time, [INT, DATE, DOUBLE, TIME]) as trades \n'+
                'setStreamTableFilterColumn(trades, `time)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [13:30:10.007, 13:30:10.008, 13:30:10.009, 13:30:10.010,13:30:10.011] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, filter:DT.Time(["13:30:10.007","13:30:10.009","13:30:10.008"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],[1,2,3]) 
                assert.equal(arr[0][1].toString(), '2012-1-1,2012-1-2,2012-1-3')
                assert.deepEqual(arr[0][2], [20.5, 45.2, 15.6])
                assert.deepEqual(arr[0][3].toString(), '13:30:10.7000000ns,13:30:10.8000000ns,13:30:10.9000000ns') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });
 
            it('subscribe filter timestamp', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`timestamp, [INT, DATE, DOUBLE, TIMESTAMP]) as trades \n'+
                'setStreamTableFilterColumn(trades, `timestamp)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price,'+
                '[2012.06.13 13:30:10.008, 2012.06.13 13:30:10.009,2012.06.13 13:30:10.010,2012.06.13 13:30:10.011,2012.06.13 13:30:10.012] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, 
                    filter:DT.TimeStamp(["2012-06-13 13:30:10.008","2012-06-13 13:30:10.009","2012-06-13 13:30:10.012"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],[1,2,5]) 
                assert.equal(arr[0][1].toString(), '2012-1-1,2012-1-2,2012-1-5')
                assert.deepEqual(arr[0][2], [20.5, 45.2, 12.0])
                assert.deepEqual(arr[0][3].toString(), '2012-6-13 13:30:10.8000000ns,2012-6-13 13:30:10.9000000ns,2012-6-13 13:30:10.12000000ns') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });
            
            it('subscribe filter nanotimestamp', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`nano, [INT, DATE, DOUBLE, NANOTIMESTAMP]) as trades \n'+
                'setStreamTableFilterColumn(trades, `nano)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price,'+
                '[2012.06.13 13:30:10.008007006,2012.06.13 13:30:10.008007007,2012.06.13 13:30:10.008007008,2012.06.13 13:30:10.008007009,2012.06.13 13:30:10.008007010] as nano) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, 
                    filter:DT.NanoTimeStamp(["2012-6-13 13:30:10.008007006","2012-6-13 13:30:10.100"])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],1) 
                assert.equal(arr[0][1].toString(), '2012-1-1')
                assert.deepEqual(arr[0][2], 20.5)
                assert.deepEqual(arr[0][3].toString(), '2012-6-13 13:30:10.8007006ns') 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            });

      /*       it('subscribe filter bool', async function() {
                this.timeout(10000)
                var script = '' +
                'share streamTable(100:0, `id`date`price`bool, [INT, DATE, DOUBLE, BOOL]) as trades \n'+
                'setStreamTableFilterColumn(trades, `bool)\n'+
                'tmp = table(1..5 as id, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [true,false,false,true,] as bool) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }        
                client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0, filter:DT.Bool([false])})
                await myConnect.run("sleep(3000)")
                assert.deepEqual(arr[0][0],[2,3]) 
                assert.equal(arr[0][1].toString(), '2012-1-2,2012-1-3')
                assert.deepEqual(arr[0][2], [45.2, 15.6])
                assert.deepEqual(arr[0][3], [ false,false]) 
                await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
            }); */



            it('sub and unsub multiple times', async function() {
                this.timeout(20000)
                var script = '' +
                'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
                'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
                'trades.append!(tmp)'
                await myConnect.run(script)
                var arr = []
                function f1(msg){
                    arr.push(msg)
                }
                for(var i=0;i<5;i++){
                    var arr = []
                    client.subscribe(config.HOST, config.PORT, "trades", "trades_sub1", {handler:f1, offset:0})
                    await myConnect.run("sleep(3000)")
                    assert.deepEqual(arr[0][0],['A','B','C','D','E'])
                    assert.equal(arr[0][1].toString(), '2012-1-1,2012-1-2,2012-1-3,2012-1-4,2012-1-5')
                    assert.deepEqual(arr[0][2], [20.5, 45.2, 15.6, 58.4, 12.0])
                    assert.deepEqual(arr[0][3], [2200, 1500, 4800, 5900, 4600])
                    await client.unsubscribe(config.HOST, config.PORT, "trades", "trades_sub1")
                }
            });





        });
    });    
}

test_subscribe()              
