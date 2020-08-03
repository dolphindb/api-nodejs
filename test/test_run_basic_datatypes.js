
'use strict';

const { UUID } = require('../src/DT');

async function test_run(){
    var assert = require('assert')
    var DBconnection = require('../src/DBconnection'); //import API module
    var myConnect = new DBconnection();

    before(async function() {
        var config = require("./setup/settings")
        await myConnect.connect(config.HOST, config.PORT);        
      });

    after(function () {
        return
      });

    describe('#DBconnection.js', function() {
        describe('#run()', function() {
            it('run positive int scalar', async function() {
                const re = await myConnect.run("2")
                assert.equal(re, 2);
            });

            it('run zero int scalar', async function() {
                const re = await myConnect.run("0")
                assert.equal(re, 0);
            });

            it('run negative int scalar', async function() {
                const re = await myConnect.run("-5")
                assert.equal(re, -5);
            });

            it('run null int scalar', async function() {
                const re = await myConnect.run("int()")
                console.log(re)
                assert.equal(re, null);
            });

            it('run positive short scalar', async function() {
                const re = await myConnect.run("22h")
                assert.equal(re, 22);
            });

            it('run negative short scalar', async function() {
                const re = await myConnect.run("-22h")
                assert.equal(re, -22);
            });

            it('run zero short scalar', async function() {
                const re = await myConnect.run("0h")
                assert.equal(re, 0);
            });

            it('run null short scalar', async function() {
                const re = await myConnect.run("short()")
                assert.equal(re, null);
            });

            it('run positive long scalar', async function() {
                const re = await myConnect.run("22l")
                assert.equal(re, 22);
            });

            it('run negative long scalar', async function() {
                const re = await myConnect.run("-22l")
                assert.equal(re, -22);
            });

            it('run zero long scalar', async function() {
                const re = await myConnect.run("0l")
                assert.equal(re, 0);
            });

            it('run null long scalar', async function() {
                const re = await myConnect.run("long()")
                assert.equal(re,null);
            });

            it('run positive double scalar', async function() {
                const re = await myConnect.run("12.56")
                assert.equal(re, 12.56);
            });

            it('run negative double scalar', async function() {
                const re = await myConnect.run("-12.56")
                assert.equal(re, -12.56);
            });

            it('run zero double scalar', async function() {
                const re = await myConnect.run("0.0")
                assert.equal(re, 0);
            });

            it('run null double scalar', async function() {
                const re = await myConnect.run("double()")
                assert.equal(re, null);
            });

            it('run positive float scalar', async function() {
                const re = await myConnect.run("12.56f")
                assert.equal(re.toFixed(2), 12.56);
            });

            it('run negative float scalar', async function() {
                const re = await myConnect.run("-12.56f")
                assert.equal(re.toFixed(2), -12.56);
            });

            it('run zero float scalar', async function() {
                const re = await myConnect.run("0.0f")
                assert.equal(re.toFixed(2), 0.00);
            });

            it('run null float scalar', async function() {
                const re = await myConnect.run("float()")
                assert.equal(re, null);
            });


            it('run char scalar', async function() {
                const re = await myConnect.run("'a'")
                assert.equal(re, 'a');
            });

            it('run char null scalar', async function() {
                const re = await myConnect.run("char()")
                assert.equal(re, null);
             });

            it('run bool true scalar', async function() {
                const re = await myConnect.run("true")
                assert.equal(re, true);
            });
            
            it('run bool false scalar', async function() {
                const re = await myConnect.run("false")
                assert.equal(re, false);
            });

            it('run bool null scalar', async function() {
                const re = await myConnect.run("bool()")
                assert.equal(re, null);
            });

            it('run date positive scalar', async function() {
                const re = await myConnect.run("2012.06.12")
                assert .equal(re.get()['year'], 2012)
                assert .equal(re.get()['month'], 6)
                assert .equal(re.get()['day'], 12)
            });

            it('run date negative scalar', async function() {
                const re = await myConnect.run("1960.01.01")
                assert .equal(re.get()['year'], 1960)
                assert .equal(re.get()['month'], 1)
                assert .equal(re.get()['day'], 1)
            });

            it('run date null scalar', async function() {
                const re = await myConnect.run("date()")
                assert.equal(re, null);

            });

            it('run month positive scalar', async function() {
                const re = await myConnect.run("2012.06M")
                assert.equal(re.get()['year'], 2012)
                assert.equal(re.get()['month'], 6)
            });

            it('run month negative scalar', async function() {
                const re = await myConnect.run("1950.06M")
                assert.equal(re.get()['year'], 1950)
                assert.equal(re.get()['month'], 6)
            });

            it('run month null scalar', async function() {
                const re = await myConnect.run("month()")       
                assert.equal(re, null);
            });

            it('run time positive scalar', async function() {
                const re = await myConnect.run("13:30:10.008")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
                assert.equal(re.get()['nanoSecond'], 8000000)
            });

            it('run time null scalar', async function() {
                const re = await myConnect.run("time()")
                assert.equal(re, null);
            });

            it('run minute positive scalar', async function() {
                const re = await myConnect.run("13:30m")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
            });

            it('run minute null scalar', async function() {
                const re = await myConnect.run("minute()")
                assert.equal(re, null);
            });

            it('run second positive scalar', async function() {
                const re = await myConnect.run("13:30:30")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 30)
            });

            it('run second positive scalar', async function() {
                const re = await myConnect.run("second()")
                assert.equal(re, null);
            });

            it('run datetime positive scalar', async function() {
                const re = await myConnect.run("2012.06.13 13:30:10")
                assert.equal(re.get()['year'], 2012)
                assert.equal(re.get()['month'], 6)
                assert.equal(re.get()['day'], 13)
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
            });

            it('run datetime delimiter positive scalar', async function() {
                const re = await myConnect.run("2012.06.13T13:30:10")
                assert.equal(re.get()['year'], 2012)
                assert.equal(re.get()['month'], 6)
                assert.equal(re.get()['day'], 13)
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
            });

            it('run datetime negative scalar', async function() {
                const re = await myConnect.run("1960.06.13 13:30:10")
                assert.equal(re.get()['year'], 1960)
                assert.equal(re.get()['month'], 6)
                assert.equal(re.get()['day'], 13)
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
            });

            it('run datetime null scalar', async function() {
                const re = await myConnect.run("datetime()")
                assert.equal(re, null);
            });

            it('run timestamp positive scalar', async function() {
                const re = await myConnect.run("2012.06.13 13:30:10.008")
                assert.equal(re.get()['date']['year'], 2012)
                assert.equal(re.get()['date']['month'], 6)
                assert.equal(re.get()['date']['day'], 13)
                assert.equal(re.get()['time']['hour'], 13)
                assert.equal(re.get()['time']['minute'], 30)
                assert.equal(re.get()['time']['second'], 10)
                assert.equal(re.get()['time']['nanoSecond'], 8000000)
            });

            it('run timestamp negative scalar', async function() {
                const re = await myConnect.run("1960.06.13 13:30:10.008")
                console.log(re.get()['date']['day'])
                assert.equal(re.get()['date']['year'], 1960)
                assert.equal(re.get()['date']['month'], 6)
                assert.equal(re.get()['date']['day'], 13)
                assert.equal(re.get()['time']['hour'], 13)
                assert.equal(re.get()['time']['minute'], 30)
                assert.equal(re.get()['time']['second'], 10)
                assert.equal(re.get()['time']['nanoSecond'], 8000000)
            });

            it('run timestamp null scalar', async function() {
                const re = await myConnect.run("timestamp()")
                assert.equal(re, null);
            });

            it('run nanotime positive scalar', async function() {
                const re = await myConnect.run("13:30:10.008007006")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
                assert.equal(re.get()['nanoSecond'], 8007006)
            });

            it('run nanotime null scalar', async function() {
                const re = await myConnect.run("nanotime()")
                assert.equal(re, null);
            });

            it('run nanotimestamp positive scalar', async function() {
                const re = await myConnect.run("2012.06.13 13:30:10.008007006")
                assert.equal(re.get()['date']['year'], 2012)
                assert.equal(re.get()['date']['month'], 6)
                assert.equal(re.get()['date']['day'], 13)
                assert.equal(re.get()['time']['hour'], 13)
                assert.equal(re.get()['time']['minute'], 30)
                assert.equal(re.get()['time']['second'], 10)
                assert.equal(re.get()['time']['nanoSecond'], 8007006)
            });

            it('run nanotimestamp negative scalar', async function() {
                const re = await myConnect.run("1960.06.13 13:30:10.008007006")
                assert.equal(re.get()['date']['year'], 1960)
                assert.equal(re.get()['date']['month'], 6)
                assert.equal(re.get()['date']['day'], 13)
                assert.equal(re.get()['time']['hour'], 13)
                assert.equal(re.get()['time']['minute'], 30)
                assert.equal(re.get()['time']['second'], 10)
                assert.equal(re.get()['time']['nanoSecond'], 8007006)
            });

            it('run string scalar', async function() {
                const re = await myConnect.run("'hello'")
                assert.equal(re, "hello")
            });

            it('run uuid scalar', async function() {
                const re = await myConnect.run("uuid('5d212a78-cc48-e3b1-4235-b4d91473ee87')")
                assert.equal(re, "5d212a78-cc48-e3b1-4235-b4d91473ee87")
            });

            it('run uuid null scalar', async function() {
                const re = await myConnect.run("uuid()")
                assert.equal(re,"00000000-0000-0000-0000-000000000000")
            });
 
            it('run ipaddr scalar', async function() {
                const re = await myConnect.run("ipaddr('192.168.1.13')")
                assert.equal(re, "192.168.1.13")        
            });
 
            it('run ipaddr null scalar', async function() {
                const re = await myConnect.run("ipaddr()")
                assert.equal(re, "0.0.0.0")
            }); 

            it('run int128 scalar', async function() {
                const re = await myConnect.run("int128('e1671797c52e15f763380b45e841ec32')")
                assert.equal(re, "e1671797c52e15f763380b45e841ec32")
            });

            it('run int128 null scalar', async function() {
                const re = await myConnect.run("int128()")
                assert.equal(re, "00000000000000000000000000000000")
            }); 

            it('run bool vector', async function() {
                const re = await myConnect.run("[true, false, false]")
                var expected=new Array(true, false, false)
                assert.deepEqual(re, expected)
            });

            it('run bool all null vector', async function() {
                const re = await myConnect.run("take(bool(), 3)")
                assert.deepEqual(re, [null,null,null])
            });

            it('run bool some null vector', async function() {
                const re = await myConnect.run("[true, false, bool()]")
                var expected=new Array(true, false, null)
                assert.deepEqual(re, expected)
            });


            it('run char vector', async function() {
                const re = await myConnect.run("['a', 'b', 'c']")
                var expected=new Array('a', 'b', 'c')
                assert.deepEqual(re, expected)
            });

            it('run char all null vector', async function() {
                const re = await myConnect.run("take(char(), 3)")
                assert.deepEqual(re, [null,null,null])
            });

            it('run char some null vector', async function() {
                const re = await myConnect.run("['a', 'b', char()]")
                var expected=new Array('a', 'b', null)
                assert.deepEqual(re, expected)
            });

            it('run int vector', async function() {
                const re = await myConnect.run("[-2, 0, 5]")
                var expected=new Array(-2, 0, 5)
                assert.deepEqual(re, expected)
            });

            it('run int all null vector', async function() {
                const re = await myConnect.run("take(int(), 3)")
                 assert.deepEqual(re, [null,null,null])
            });

            it('run int some null vector', async function() {
                const re = await myConnect.run("[-2, 0, int()]")
                var expected=new Array(-2, 0, null)
                assert.deepEqual(re, expected)
            });

            it('run short vector', async function() {
                const re = await myConnect.run("[-2h, 0h, 5h]")
                var expected=new Array(-2, 0, 5)
                assert.deepEqual(re, expected)
            });

            it('run short all null vector', async function() {
                const re = await myConnect.run("take(short(), 3)")
                assert.deepEqual(re, [null,null,null])
            });

            it('run short some null vector', async function() {
                const re = await myConnect.run("[-2h, 0h, short()]")
                var expected=new Array(-2, 0, null)
                assert.deepEqual(re, expected)
            });

            it('run long vector', async function() {
                const re = await myConnect.run("[-2l, 0l, 5l]")
                var expected=new Array(-2, 0, 5)
                assert.deepEqual(re, expected)
            });

            it('run long all null vector', async function() {
                const re = await myConnect.run("take(long(), 3)")
                assert.deepEqual(re, [null,null,null])
            });

            it('run long some null vector', async function() {
                const re = await myConnect.run("[-2l, 0l, long()]")
                var expected=new Array(-2, 0, null)
                assert.deepEqual(re, expected)
            });

            it('run date vector', async function() {
                const re = await myConnect.run("[1960.01.01, 1970.01.01, 2012.01.01]")
                assert.equal(re[0].get()['year'], 1960)
                assert.equal(re[0].get()['month'], 1)
                assert.equal(re[0].get()['day'], 1)
                assert.equal(re[1].get()['year'], 1970)
                assert.equal(re[1].get()['month'], 1)
                assert.equal(re[1].get()['day'], 1)
                assert.equal(re[2].get()['year'], 2012)
                assert.equal(re[2].get()['month'], 1)
                assert.equal(re[2].get()['day'], 1)
                assert.equal(re.toString(), '1960-1-1,1970-1-1,2012-1-1')
            });

            it('run date all null vector', async function() {
                const re = await myConnect.run("take(date(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run date some null vector', async function() {
                const re = await myConnect.run("[1960.01.01, 1970.01.01, date()]")
                assert.equal(re[0].get()['year'], 1960)
                assert.equal(re[0].get()['month'], 1)
                assert.equal(re[0].get()['day'], 1)
                assert.equal(re[1].get()['year'], 1970)
                assert.equal(re[1].get()['month'], 1)
                assert.equal(re[1].get()['day'], 1)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '1960-1-1,1970-1-1,')
            });

            it('run month vector', async function() {
                const re = await myConnect.run("[1960.01M, 1970.12M, 2012.12M]")
                assert.equal(re[0].get()['year'], 1960)
                assert.equal(re[0].get()['month'], 1)
                assert.equal(re[1].get()['year'], 1970)
                assert.equal(re[1].get()['month'], 12)
                assert.equal(re[2].get()['year'], 2012)
                assert.equal(re[2].get()['month'], 12)
                assert.equal(re.toString(), '1960-1,1970-12,2012-12')
            });

            it('run month all null vector', async function() {
                const re = await myConnect.run("take(month(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run month vector', async function() {
                const re = await myConnect.run("[1960.01M, 1970.12M, month()]")
                assert.equal(re[0].get()['year'], 1960)
                assert.equal(re[0].get()['month'], 1)
                assert.equal(re[1].get()['year'], 1970)
                assert.equal(re[1].get()['month'], 12)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '1960-1,1970-12,')
            });

            it('run time vector', async function() {
                const re = await myConnect.run("[13:30:10.008, 13:30:10.009, 13:30:10.010]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[0].get()['nanoSecond'], 8000000)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[1].get()['nanoSecond'], 9000000)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 30)
                assert.equal(re[2].get()['second'], 10)
                assert.equal(re[2].get()['nanoSecond'], 10000000)
                assert.equal(re.toString(), '13:30:10.8000000ns,13:30:10.9000000ns,13:30:10.10000000ns')
            });

            it('run time all null vector', async function() {
                const re = await myConnect.run("take(time(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run time some null vector', async function() {
                const re = await myConnect.run("[13:30:10.008, 13:30:10.009, time()]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[0].get()['nanoSecond'], 8000000)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[1].get()['nanoSecond'], 9000000)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '13:30:10.8000000ns,13:30:10.9000000ns,')
            });

            it('run minute vector', async function() {
                const re = await myConnect.run("[13:30m, 13:31m, 13:32m]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 31)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 32)
                assert.equal(re.toString(), '13:30,13:31,13:32')
            });

            it('run minute all null vector', async function() {
                const re = await myConnect.run("take(minute(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run minute some null vector', async function() {
                const re = await myConnect.run("[13:30m, 13:31m, minute()]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 31)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '13:30,13:31,')
            });

            it('run second vector', async function() {
                const re = await myConnect.run("[13:30:10, 13:31:10, 13:32:01]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 31)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 32)
                assert.equal(re[2].get()['second'], 1)
                assert.equal(re.toString(), '13:30:10,13:31:10,13:32:1')
            });

            it('run second all null vector', async function() {
                const re = await myConnect.run("take(second(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run second some null vector', async function() {
                const re = await myConnect.run("[13:30:10, 13:31:10, second()]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 31)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '13:30:10,13:31:10,')
            });

            it('run datetime vector', async function() {
                const re = await myConnect.run("[2012.06.13 13:30:10, 2012.06.13 13:30:11, 2012.06.13 13:30:12]")
                assert.equal(re[0].get()['year'], 2012)
                assert.equal(re[0].get()['month'], 6)
                assert.equal(re[0].get()['day'], 13)
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[1].get()['year'], 2012)
                assert.equal(re[1].get()['month'], 6)
                assert.equal(re[1].get()['day'], 13)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 11)
                assert.equal(re[2].get()['year'], 2012)
                assert.equal(re[2].get()['month'], 6)
                assert.equal(re[2].get()['day'], 13)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 30)
                assert.equal(re[2].get()['second'], 12)
                assert.equal(re.toString(), '2012-6-13 13:30:10,2012-6-13 13:30:11,2012-6-13 13:30:12')
            });

            it('run datetime all null vector', async function() {
                const re = await myConnect.run("take(datetime(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run datetime some null vector', async function() {
                const re = await myConnect.run("[2012.06.13 13:30:10, 2012.06.13 13:30:11, datetime()]")
                assert.equal(re[0].get()['year'], 2012)
                assert.equal(re[0].get()['month'], 6)
                assert.equal(re[0].get()['day'], 13)
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[1].get()['year'], 2012)
                assert.equal(re[1].get()['month'], 6)
                assert.equal(re[1].get()['day'], 13)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 11)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '2012-6-13 13:30:10,2012-6-13 13:30:11,')
            });

            it('run timestamp vector', async function() {
                const re = await myConnect.run("[2012.06.13 13:30:10.008, 2012.06.13 13:30:11.008, 2012.06.13 13:30:12.008]")
                assert.equal(re[0].get()['date']['year'], 2012)
                assert.equal(re[0].get()['date']['month'], 6)
                assert.equal(re[0].get()['date']['day'], 13)
                assert.equal(re[0].get()['time']['hour'], 13)
                assert.equal(re[0].get()['time']['minute'], 30)
                assert.equal(re[0].get()['time']['second'], 10)
                assert.equal(re[0].get()['time']['nanoSecond'], 8000000)
                assert.equal(re[1].get()['date']['year'], 2012)
                assert.equal(re[1].get()['date']['month'], 6)
                assert.equal(re[1].get()['date']['day'], 13)
                assert.equal(re[1].get()['time']['hour'], 13)
                assert.equal(re[1].get()['time']['minute'], 30)
                assert.equal(re[1].get()['time']['second'], 11)
                assert.equal(re[1].get()['time']['nanoSecond'], 8000000)
                assert.equal(re[2].get()['date']['year'], 2012)
                assert.equal(re[2].get()['date']['month'], 6)
                assert.equal(re[2].get()['date']['day'], 13)
                assert.equal(re[2].get()['time']['hour'], 13)
                assert.equal(re[2].get()['time']['minute'], 30)
                assert.equal(re[2].get()['time']['second'], 12)
                assert.equal(re[2].get()['time']['nanoSecond'], 8000000)
                assert.equal(re.toString(), '2012-6-13 13:30:10.8000000ns,2012-6-13 13:30:11.8000000ns,2012-6-13 13:30:12.8000000ns')
            });

            it('run timestamp all null vector', async function() {
                const re = await myConnect.run("take(timestamp(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run timestamp vector', async function() {
                const re = await myConnect.run("[2012.06.13 13:30:10.008, 2012.06.13 13:30:11.008, timestamp()]")
                assert.equal(re[0].get()['date']['year'], 2012)
                assert.equal(re[0].get()['date']['month'], 6)
                assert.equal(re[0].get()['date']['day'], 13)
                assert.equal(re[0].get()['time']['hour'], 13)
                assert.equal(re[0].get()['time']['minute'], 30)
                assert.equal(re[0].get()['time']['second'], 10)
                assert.equal(re[0].get()['time']['nanoSecond'], 8000000)
                assert.equal(re[1].get()['date']['year'], 2012)
                assert.equal(re[1].get()['date']['month'], 6)
                assert.equal(re[1].get()['date']['day'], 13)
                assert.equal(re[1].get()['time']['hour'], 13)
                assert.equal(re[1].get()['time']['minute'], 30)
                assert.equal(re[1].get()['time']['second'], 11)
                assert.equal(re[1].get()['time']['nanoSecond'], 8000000)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '2012-6-13 13:30:10.8000000ns,2012-6-13 13:30:11.8000000ns,')
            });

            it('run nanotime vector', async function() {
                const re = await myConnect.run("[13:30:10.008007006, 13:30:10.008007007, 13:30:10.008007008]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[0].get()['nanoSecond'], 8007006)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[1].get()['nanoSecond'], 8007007)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 30)
                assert.equal(re[2].get()['second'], 10)
                assert.equal(re[2].get()['nanoSecond'], 8007008)
                assert.equal(re.toString(), '13:30:10.8007006ns,13:30:10.8007007ns,13:30:10.8007008ns')
            });

            it('run nanotime all null vector', async function() {
                const re = await myConnect.run("take(time(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run nanotime some null vector', async function() {
                const re = await myConnect.run("[13:30:10.008007006, 13:30:10.008007007, nanotime()]")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[0].get()['nanoSecond'], 8007006)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[1].get()['nanoSecond'], 8007007)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '13:30:10.8007006ns,13:30:10.8007007ns,')
            });

            it('run nanotimestamp vector', async function() {
                const re = await myConnect.run("[2012.06.01 13:30:10.008007006, 2012.06.01 13:30:10.008007007, 2012.06.01 13:30:10.008007008]")
                assert.equal(re[0].get()['date']['year'], 2012)
                assert.equal(re[0].get()['date']['month'], 6)
                assert.equal(re[0].get()['date']['day'], 1)
                assert.equal(re[0].get()['time']['hour'], 13)
                assert.equal(re[0].get()['time']['minute'], 30)
                assert.equal(re[0].get()['time']['second'], 10)
                assert.equal(re[0].get()['time']['nanoSecond'], 8007006)
                assert.equal(re[1].get()['date']['year'], 2012)
                assert.equal(re[1].get()['date']['month'], 6)
                assert.equal(re[1].get()['date']['day'], 1)
                assert.equal(re[1].get()['time']['hour'], 13)
                assert.equal(re[1].get()['time']['minute'], 30)
                assert.equal(re[1].get()['time']['second'], 10)
                assert.equal(re[1].get()['time']['nanoSecond'], 8007007)
                assert.equal(re[2].get()['date']['year'], 2012)
                assert.equal(re[2].get()['date']['month'], 6)
                assert.equal(re[2].get()['date']['day'], 1)
                assert.equal(re[2].get()['time']['hour'], 13)
                assert.equal(re[2].get()['time']['minute'], 30)
                assert.equal(re[2].get()['time']['second'], 10)
                assert.equal(re[2].get()['time']['nanoSecond'], 8007008)
                assert.equal(re.toString(), '2012-6-1 13:30:10.8007006ns,2012-6-1 13:30:10.8007007ns,2012-6-1 13:30:10.8007008ns')
            });

            it('run nanotimestamp all null vector', async function() {
                const re = await myConnect.run("take(nanotimestamp(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run nanotimestamp some null vector', async function() {
                const re = await myConnect.run("[2012.06.01 13:30:10.008007006, 2012.06.01 13:30:10.008007007, nanotimestamp()]")
                assert.equal(re[0].get()['date']['year'], 2012)
                assert.equal(re[0].get()['date']['month'], 6)
                assert.equal(re[0].get()['date']['day'], 1)
                assert.equal(re[0].get()['time']['hour'], 13)
                assert.equal(re[0].get()['time']['minute'], 30)
                assert.equal(re[0].get()['time']['second'], 10)
                assert.equal(re[0].get()['time']['nanoSecond'], 8007006)
                assert.equal(re[1].get()['date']['year'], 2012)
                assert.equal(re[1].get()['date']['month'], 6)
                assert.equal(re[1].get()['date']['day'], 1)
                assert.equal(re[1].get()['time']['hour'], 13)
                assert.equal(re[1].get()['time']['minute'], 30)
                assert.equal(re[1].get()['time']['second'], 10)
                assert.equal(re[1].get()['time']['nanoSecond'], 8007007)
                assert.equal(re[2],null)
                assert.equal(re.toString(), '2012-6-1 13:30:10.8007006ns,2012-6-1 13:30:10.8007007ns,')
            });

            it('run float vector', async function() {
                const re = await myConnect.run("[2.1f, 2.2f, -2.5f]")
                assert.equal(re[0].toFixed(1), 2.1)
                assert.equal(re[1].toFixed(1), 2.2)
                assert.equal(re[2].toFixed(1), -2.5)
            });

            it('run float all null vector', async function() {
                const re = await myConnect.run("take(float(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run float some null vector', async function() {
                const re = await myConnect.run("[2.1f, 2.2f, float()]")
                assert.equal(re[0].toFixed(1), 2.1)
                assert.equal(re[1].toFixed(1), 2.2)
                assert.equal(re[2],null)
            });

            it('run double vector', async function() {
                const re = await myConnect.run("[2.1, 2.2, -2.5]")
                var expected = new Array(2.1, 2.2, -2.5)
                assert.deepEqual(re, expected)
            });

            it('run double all null vector', async function() {
                const re = await myConnect.run("take(double(), 3)")
                assert.deepEqual(re,[null,null,null])
            });

            it('run double some null vector', async function() {
                const re = await myConnect.run("[2.1, 2.2, double()]")
                var expected = new Array(2.1, 2.2,null )
                assert.deepEqual(re, expected)
            });

            it('run symbol vector', async function() {
                const re = await myConnect.run("symbol(['AA','BB','CC'])")
                var expected = new Array('AA','BB','CC' )
                assert.deepEqual(re, expected)
            });

            it('run symbol all null vector', async function() {
                const re = await myConnect.run("symbol(take(string(), 3))")
                assert.deepEqual(re,['','',''])
            });

            it('run symbol some null vector', async function() {
                const re = await myConnect.run("symbol(['AA','BB',string()])")
                var expected = new Array('AA','BB','' )
                assert.deepEqual(re, expected)      
            });

            it('run string vector', async function() {
                const re = await myConnect.run("['AA','BB','CC']")
                var expected = new Array('AA','BB','CC')
                assert.deepEqual(re, expected)
            });

             it('run string all null vector', async function() {
                const re = await myConnect.run("take(string(), 3)")
                assert.deepEqual(re,["","",""])
            });

            it('run string some null vector', async function() {
                const re = await myConnect.run("['AA','BB',string()]")
                var expected = new Array("AA","BB","")
                assert.deepEqual(re, expected)
            }); 

            it('run uuid vector', async function() {
                const re = await myConnect.run("uuid(['5d212a78-cc48-e3b1-4235-b4d91473ee87','5d212a78-cc48-e3b1-4235-b4d91473ee88','5d212a78-cc48-e3b1-4235-b4d91473ee89'])")
                assert.equal(re[0].toString(), "5d212a78-cc48-e3b1-4235-b4d91473ee87")    
                assert.equal(re[1].toString(), "5d212a78-cc48-e3b1-4235-b4d91473ee88")    
                assert.equal(re[2].toString(), "5d212a78-cc48-e3b1-4235-b4d91473ee89")    
            });

            it('run ipaddr vector', async function() {
                const re = await myConnect.run("ipaddr(['192.168.1.135', '192.168.1.132', '192.168.1.133'])")
                assert.equal(re[0].toString(), "192.168.1.135")  
                assert.equal(re[1].toString(), "192.168.1.132")  
                assert.equal(re[2].toString(), "192.168.1.133")              }); 

            it('run int128 vector', async function() {
                const re = await myConnect.run("int128(['e1671797c52e15f763380b45e841ec32', 'e1671797c52e15f763380b45e841ec33', 'e1671797c52e15f763380b45e841ec34'])")
                assert.equal(re[0].toString(), "e1671797c52e15f763380b45e841ec32")  
                assert.equal(re[1].toString(), "e1671797c52e15f763380b45e841ec33")  
                assert.equal(re[2].toString(), "e1671797c52e15f763380b45e841ec34")  
            });
 
            it('run empty array', async function() {
                const re = await myConnect.run("array(INT, 0, 10)")
                var expected = []
                assert.deepEqual(re, expected)
            });

            it('run int pair', async function() {
                const re = await myConnect.run("1:3")
                var expected = new Array(1, 3)
                assert.deepEqual(re, expected)
            });

            it('run string pair', async function() {
                const re = await myConnect.run("'hello':'world'")
                var expected = new Array('hello', 'world')
                assert.deepEqual(re, expected)
            });

            it('run empty tuple', async function() {
                const re = await myConnect.run("x=();x")
                var expected = []
                assert.deepEqual(re, expected)
            });

            it('run tuple element scalar', async function() {
                const re = await myConnect.run("(1, 'AA', 2.5)")
                var expected = new Array(1, 'AA', 2.5)
                assert.deepEqual(re, expected)
            });

            it('run tuple element vector', async function() {
                const re = await myConnect.run("[1 2 3, 4 5 6, 7]")
                var expected1 = new Array(1, 2, 3)
                var expected2 = new Array(4, 5, 6)
                assert.deepEqual(re[0], expected1)
                assert.deepEqual(re[1], expected2)
                assert.equal(re[2], 7)
            });

            it('run int matrix', async function() {
                const re = await myConnect.run("1..6$3:2")
                var expected1 = new Array(1, 2, 3)
                var expected2 = new Array(4, 5, 6)
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2)
            });

            it('run int one column matrix', async function() {
                const re = await myConnect.run("matrix([1, 2, 3])")
                var expected1 = new Array(1, 2, 3)
                assert.deepEqual(re.data[0], expected1)
            });

            it('run int one row matrix', async function() {
                const re = await myConnect.run("matrix([[1], [2], [3]])")
                var expected1 = [1]
                var expected2 = [2]
                var expected3 = [3]
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2)
                assert.deepEqual(re.data[2], expected3)
            });

            it('run int matrix with col label', async function() {
                const re = await myConnect.run("m=matrix(1 2 3, 4 5 6);m.rename!(`id`val);m")
                var colNames = new Array('id', 'val')
                var expected1 = new Array(1, 2, 3)
                var expected2 = new Array(4, 5, 6)
                assert.deepEqual(re.colnames, colNames)
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2)
            });

            it('run int matrix with labels', async function() {
                const re = await myConnect.run("m=matrix(1 2 3, 4 5 6);m.rename!(`a`b`c,`id`val);m")
                var rowNames = new Array('a', 'b', 'c')
                var colNames = new Array('id', 'val')
                var expected1 = new Array(1, 2, 3)
                var expected2 = new Array(4, 5, 6)
                assert.deepEqual(re.rownames, rowNames)
                assert.deepEqual(re.colnames, colNames)
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2)
            });

            it('run int all null matrix', async function() {
                const re = await myConnect.run("matrix(INT, 2, 3, , int())")
                assert.deepEqual(re.data[0],[null,null])
                assert.deepEqual(re.data[1],[null,null])
                assert.deepEqual(re.data[2],[null,null])
            });

            it('run symbol matrix', async function() {
                const re = await myConnect.run("symbol(['AA', 'BB', 'CC', 'DD'])$2:2")
                var expected1 = new Array('AA','BB')
                var expected2 = new Array('CC', 'DD')
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2)
            });

            it('run int set', async function() {
                const re = await myConnect.run("set(2 3 5 6)")
                var expected = new Set([2, 3, 5, 6])
                assert.deepEqual(re, expected)
            });

            it('run int int dictionary', async function() {
                const re = await myConnect.run("dict(1 2 3, 4 5 6)")
                var expected = new Map([[1, 4], [2, 5], [3, 6]])
                assert.deepEqual(re, expected)
            });

            it('run int string dictionary', async function() {
                const re = await myConnect.run("dict(1 2 3, `MSFT`GOOG`IBM)")
                var expected = new Map([[1, 'MSFT'], [2, 'GOOG'], [3, 'IBM']])
                assert.deepEqual(re, expected)
            });

            it('run int int null dictionary', async function() {
                const re = await myConnect.run("dict(INT, INT)")
                var expected = new Map([])
                assert.deepEqual(re, expected)
            });

            it('run int any dictionary', async function() {
                const re = await myConnect.run("dict(1 2 3, [4 5 6, 1 2, 6])")
                var expected = new Map([[1, [4, 5, 6]], [2, [1, 2]], [3, 6]])
                assert.deepEqual(re, expected)
            });

            it('run string any dictionary', async function() {
                const re = await myConnect.run("dict(`a`b`c, [4 5 6, 1 2, 6])")
                var expected = new Map([['a', [4, 5, 6]], ['b', [1, 2]], ['c', 6]])
                assert.deepEqual(re, expected)
            });

            it('run table', async function() {
                const re = await myConnect.run("table(1 2 3 as a, `x`y`z as b, 10.8 7.6 3.5 as c)")
                var colNames = new Array('a', 'b', 'c')
                var expected = new Array([1, 2, 3], ['x', 'y', 'z'], [10.8, 7.6, 3.5])
                assert.deepEqual(re.colnames, colNames)
                assert.deepEqual(re.data, expected)
            });

            it('run empty table', async function() {
                const re = await myConnect.run("table(1:0, `id`val, [INT, INT])")
                var colNames = new Array('id', 'val')
                assert.deepEqual(re.colnames, colNames)
            });

        });
    });
}

test_run()