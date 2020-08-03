
'use strict';

const { Double, Int, Short, Float, Minute } = require('../src/DT');
const { Console } = require('console');

async function test_upload(){
    var assert = require('assert')
    var DBconnection = require('../src/DBconnection') //import API module
    var DT = require('../src/DT') 
    var myConnect = new DBconnection()

    before(async function() {
        var config = require("./setup/settings")
        await myConnect.connect(config.HOST, config.PORT, "admin", "123456");        
      });

    after(function () {
        return
      });

    describe('#upload.js', function() {
        describe('#upload()', function() {
            it('upload int scalar', async function() {
                await myConnect.upload("a", DT.Int(1))
                var re = await myConnect.run("a")
                assert.equal(re, 1)
            });

            it('upload int vector', async function() {
                await myConnect.upload("a", DT.Int([0,2,1]))
                var re = await myConnect.run("a")
                assert.deepEqual(re, [0, 2, 1])
                await myConnect.upload("a", [0,2,])
                var re = await myConnect.run("a")
                assert.deepEqual(re, [0, 2, ])
            });

            it('upload int NULL', async function() {
                await myConnect.upload("a",DT.Int())
                var re = await myConnect.run("a")
                assert.equal(re,null )
            });
          
            it('upload short scalar', async function() {
                await myConnect.upload("a", DT.Short(-22))
                var re = await myConnect.run("a")
                assert.equal(re, -22)
            });

            it('upload short vector', async function() {
                await myConnect.upload("a", DT.Short([-2,Short() ,0]))
                var re = await myConnect.run("a")
                assert.deepEqual(re, [ -2,null ,0])
            });

            it('upload short NULL', async function() {
                await myConnect.upload("a",DT.Short())
                var re = await myConnect.run("a")
                assert.equal(re,null )
            });
         
            it('upload long scalar', async function() {
                await myConnect.upload("a", DT.Long(-22))
                var re = await myConnect.run("a")
                assert.equal(re, -22)
            });

            it('upload long vector', async function() {
                await myConnect.upload("a", DT.Long([-7, 0, ]))
                var re = await myConnect.run("a")
                assert.deepEqual(re, [-7, 0, ])
            });
            it('upload long NULL', async function() {
                await myConnect.upload("a", DT.Long())
                var re = await myConnect.run("a")
                assert.equal(re, null)
            });

            it('upload float scalar', async function() {
                await myConnect.upload("a", DT.Float(-22.2))
                var re = await myConnect.run("a")
                assert.equal(re.toFixed(1), -22.2)
            });
            it('upload float vector', async function() {
                await myConnect.upload("a", DT.Float([1.0, 2.3,Float() ]))
                var re = await myConnect.run("a")
                assert.deepEqual(re[0].toFixed(1), 1.0)
                assert.deepEqual(re[1].toFixed(1), 2.3)
                assert.deepEqual(re[2], null)
            });

            it('upload float NULL', async function() {
                await myConnect.upload("a", DT.Float())
                var re = await myConnect.run("a")
                assert.equal(re, null)
            });

            it('upload double scalar', async function() {
                await myConnect.upload("a", DT.Double(-22.0))
                var re = await myConnect.run("a")
                assert.equal(re, -22.0)
            });

            it('upload double vector', async function() {
                await myConnect.upload("a", DT.Double([1, 2, 3.1]))
                var re = await myConnect.run("a")
                assert.deepEqual(re, [1, 2, 3.1])
            });
            it('upload double NULL', async function() {
                await myConnect.upload("a", DT.Double())
                var re = await myConnect.run("a")
                assert.equal(re,null )
            });

            it('upload char scalar', async function() {
                await myConnect.upload("a", DT.Char('a'))
                var re = await myConnect.run("a")
                assert.equal(re, 'a')
            });

            it('upload char vector', async function() {
                await myConnect.upload("a", DT.Char([DT.Char(),'1','$']))
                var re = await myConnect.run("a")
                assert.deepEqual(re, [null,'1','$'])
            });
            it('upload char NULL', async function() {
                await myConnect.upload("a", DT.Char())
                var re = await myConnect.run("a")
                assert.equal(re,null )
            });
            it('upload bool scalar', async function() {
                await myConnect.upload("a", DT.Bool(true))
                var re = await myConnect.run("a")
                assert.equal(re, true)
            });

            it('upload bool vector', async function() {
                await myConnect.upload("a", DT.Bool([true,true,false]))
                var re = await myConnect.run("a")
                assert.deepEqual(re, [true,true,false])
            });

            it('upload bool NULL', async function() {
                await myConnect.upload("a", DT.Bool())
                var re = await myConnect.run("a")
                assert.equal(re,null )
            });
            
            it('upload symbol scalar', async function() {
                await myConnect.upload("a", DT.Symbol("dolphindb"))
                var re = await myConnect.run("a")
                assert.equal(re, "dolphindb")
            });

            it('upload symbol vector', async function() {
                await myConnect.upload("a", DT.Symbol(["aa","bb","cc"]))
                var re = await myConnect.run("a")
                assert.deepEqual(re, ["aa","bb","cc"])
            });
 
            it('upload symbol NULL', async function() {
                await myConnect.upload("a", DT.Symbol(""))
                var re = await myConnect.run("a")
                assert.equal(re,'' )
            });
        
            it('upload UUID scalar', async function() {
                await myConnect.upload("a", DT.UUID("5d212a78-cc48-e3b1-4235-b4d91473ee87"))
                var re = await myConnect.run("a")
                assert.equal(re.toString(), "5d212a78-cc48-e3b1-4235-b4d91473ee87")
            });

            it('upload UUID vector', async function() {
                await myConnect.upload("a", DT.UUID(["5d212a78-cc48-e3b1-4235-b4d91473ee87","5d212a78-cc48-e3b1-4235-b4d91473ee88"]))
                var re = await myConnect.run("a")
                assert.equal(re[0].toString(),"5d212a78-cc48-e3b1-4235-b4d91473ee87")
                assert.equal(re[1].toString(),"5d212a78-cc48-e3b1-4235-b4d91473ee88")
            });

            it('upload UUID NULL', async function() {
                await myConnect.upload("a", DT.UUID(0,0))
                var re = await myConnect.run("a")
                assert.equal(re,"00000000-0000-0000-0000-000000000000" )
            });

            it('upload ipaddr scalar', async function() {
                await myConnect.upload("a", DT.IpAddr("192.168.1.135"))
                var re = await myConnect.run("a")
                assert.equal(re.toString(), "192.168.1.135")
            });

            it('upload ipaddr vector', async function() {
                await myConnect.upload("a", DT.IpAddr(['192.168.1.135', '192.168.1.132',]))
                var re = await myConnect.run("a")
                assert.deepEqual(re.toString(),"192.168.1.135,192.168.1.132")
            });

            it('upload ipaddr NULL', async function() {
                await myConnect.upload("a", DT.IpAddr())
                var re = await myConnect.run("a")
                assert.equal(re,"0.0.0.0" )
            });

           
           it('upload int128 scalar', async function() {
                await myConnect.upload("a", DT.Int128("e1671797c52e15f763380b45e841ec32"))
                var re = await myConnect.run("a")
                assert.equal(re.toString(), "e1671797c52e15f763380b45e841ec32")
            });

            it('upload int128 vector', async function() {
                await myConnect.upload("a", DT.Int128(["e1671797c52e15f763380b45e841ec32","e1671797c52e15f763380b45e841ec33"]))
                var re = await myConnect.run("a")
                assert.deepEqual(re.toString(),"e1671797c52e15f763380b45e841ec32,e1671797c52e15f763380b45e841ec33")
            });

            it('upload int128 NULL', async function() {
                await myConnect.upload("a", DT.Int128(0,0))
                var re = await myConnect.run("a")
                assert.equal(re.toString(),"00000000000000000000000000000000" )
            });

           
            it('upload date scalar', async function() {
                await myConnect.upload("a", DT.Date("1960-01-01"))
                var re = await myConnect.run("a")
                assert .equal(re.get()['year'], 1960)
                assert .equal(re.get()['month'], 1)
                assert .equal(re.get()['day'], 1)
            });

            it('upload date vector', async function() {
                await myConnect.upload("a", DT.Date(["1973-02-01","1960-01-01","1970-01-03",]))
                var re = await myConnect.run("a")
                assert .equal(re[0].get()['year'], 1973)
                assert .equal(re[0].get()['month'], 2)
                assert .equal(re[0].get()['day'], 1)
                assert .equal(re[1].get()['year'], 1960)
                assert .equal(re[1].get()['month'], 1)
                assert .equal(re[1].get()['day'], 1)
                assert .equal(re[2].get()['year'], 1970)
                assert .equal(re[2].get()['month'], 1)
                assert .equal(re[2].get()['day'], 3)
                assert .equal(re[3],null)
            });

            it('upload date null scalar', async function() {
                await myConnect.upload("a", DT.Date())
                var re = await myConnect.run("a")
                assert .equal(re,null)
            });
           
            it('upload month scalar', async function() {
                await myConnect.upload("a", DT.Month("1960-01"))
                var re = await myConnect.run("a")
                assert .equal(re.get()['year'], 1960)
                assert .equal(re.get()['month'], 1)
            });

            it('upload month vector', async function() {
                await myConnect.upload("a", DT.Month(["1973-02","1960-01","1970-03"]))
                var re = await myConnect.run("a")
                assert .equal(re[0].get()['year'], 1973)
                assert .equal(re[0].get()['month'], 2)
                assert .equal(re[1].get()['year'], 1960)
                assert .equal(re[1].get()['month'], 1)
                assert .equal(re[2].get()['year'], 1970)
                assert .equal(re[2].get()['month'], 3)
            });
           

            it('upload time scalar', async function() {
                await myConnect.upload("a", DT.Time("13:30:10.008"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
                assert.equal(re.get()['nanoSecond'], 8000000)
            }); 

          it('upload time vector', async function() {
                await myConnect.upload("a", DT.Time([, "13:30:10.009", "12:30:10.010"]))
                var re = await myConnect.run("a")
                console.log(re)
                assert.equal(re[0],null)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[1].get()['nanoSecond'], 9000000)
                assert.equal(re[2].get()['hour'], 12)
                assert.equal(re[2].get()['minute'], 30)
                assert.equal(re[2].get()['second'], 10)
                assert.equal(re[2].get()['nanoSecond'], 10000000)
                assert.equal(re.toString(), ",13:30:10.9000000ns,12:30:10.10000000ns")
            });
            
            it('upload minute scalar', async function() {
                await myConnect.upload("a", DT.Minute("13:30"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
            });
            it('upload minute null scalar', async function() {
                await myConnect.upload("a", DT.Minute())
                var re = await myConnect.run("a")
                assert.equal(re,null)
            }); 

            it('upload minute vector', async function() {
                await myConnect.upload("a", DT.Minute(["", "13:31", "13:32"]))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['hour'], 0)
                assert.equal(re[0].get()['minute'], 0)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 31)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 32)
                assert.equal(re.toString(), '0:0,13:31,13:32')
            });
            it('upload second scalar', async function() {
                await myConnect.upload("a", DT.Second("13:30:10"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
            });

            it('upload second vector', async function() {
                await myConnect.upload("a", DT.Second(["13:30:10", "13:31:10", "13:32:01"]))
                var re = await myConnect.run("a")
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
           
            it('upload second null scalar', async function() {
                await myConnect.upload("a", DT.Second())
                var re = await myConnect.run("a")
                assert.equal(re,null)
            });

            it('upload datetime scalar', async function() {
                await myConnect.upload("a", DT.DateTime("2012-06-13 13:30:10"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['year'], 2012)
                assert.equal(re.get()['month'], 6)
                assert.equal(re.get()['day'], 13)
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
            });
            it('upload datetime null scalar', async function() {
                await myConnect.upload("a", DT.DateTime())
                var re = await myConnect.run("a")
                assert.equal(re,null)
            });
            it('upload datetime vector', async function() {
                await myConnect.upload("a", DT.DateTime(["2012-06-13 13:30:10", "2012-06-13 13:30:11",]))
                var re = await myConnect.run("a")
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
                assert.equal(re.toString(), '2012-6-13 13:30:10,2012-6-13 13:30:11')
            });
           
            it('upload timestamp scalar', async function() {
                await myConnect.upload("a", DT.TimeStamp("2012-06-13 13:30:10.008"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['date']['year'], 2012)
                assert.equal(re.get()['date']['month'], 6)
                assert.equal(re.get()['date']['day'], 13)
                assert.equal(re.get()['time']['hour'], 13)
                assert.equal(re.get()['time']['minute'], 30)
                assert.equal(re.get()['time']['second'], 10)
                assert.equal(re.get()['time']['nanoSecond'], 8000000)
            });
            it('upload timestamp null scalar', async function() {
                await myConnect.upload("a", DT.TimeStamp())
                var re = await myConnect.run("a")
                assert.equal(re,null)
            }); 

            it('upload timestamp vector', async function() {
                await myConnect.upload("a", DT.TimeStamp(["2012-06-13 13:30:10.008", "2012-06-13 13:30:11.008",]))
                var re = await myConnect.run("a")
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
                assert.equal(re.toString(), '2012-6-13 13:30:10.8000000ns,2012-6-13 13:30:11.8000000ns')
            });
          
            it('upload nanotime scalar', async function() {
                await myConnect.upload("a", DT.NanoTime("13:30:10.008007006"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['hour'], 13)
                assert.equal(re.get()['minute'], 30)
                assert.equal(re.get()['second'], 10)
                assert.equal(re.get()['nanoSecond'], 8007006)
            });

            it('upload nanotime null scalar', async function() {
                await myConnect.upload("a", DT.NanoTime())
                var re = await myConnect.run("a")
                assert.equal(re,null)
            });

            it('upload nanotime vector', async function() {
                await myConnect.upload("a", DT.NanoTime([,"13:30:10.008007006", "13:30:10.008007007"]))
                var re = await myConnect.run("a")
                assert.equal(re[0],null)
                assert.equal(re[1].get()['hour'], 13)
                assert.equal(re[1].get()['minute'], 30)
                assert.equal(re[1].get()['second'], 10)
                assert.equal(re[1].get()['nanoSecond'], 8007006)
                assert.equal(re[2].get()['hour'], 13)
                assert.equal(re[2].get()['minute'], 30)
                assert.equal(re[2].get()['second'], 10)
                assert.equal(re[2].get()['nanoSecond'], 8007007)
                assert.equal(re.toString(), ',13:30:10.8007006ns,13:30:10.8007007ns')
            });
            
            it('upload nanotimestamp scalar', async function() {
                await myConnect.upload("a", DT.NanoTimeStamp("2012-06-01 13:30:10.008007006"))
                var re = await myConnect.run("a")
                assert.equal(re.get()['date']['year'], 2012)
                assert.equal(re.get()['date']['month'], 6)
                assert.equal(re.get()['date']['day'], 1)
                assert.equal(re.get()['time']['hour'], 13)
                assert.equal(re.get()['time']['minute'], 30)
                assert.equal(re.get()['time']['second'], 10)
                assert.equal(re.get()['time']['nanoSecond'], 8007006)
            });

            it('upload nanotimestamp null scalar', async function() {
                await myConnect.upload("a", DT.NanoTimeStamp())
                var re = await myConnect.run("a")
                assert.equal(re,null)
            });

            it('upload nanotimestamp vector', async function() {
                await myConnect.upload("a", DT.NanoTimeStamp([,"2012-06-01 13:30:10.008007006", "2012-06-01 13:30:10.008007007"]))
                var re = await myConnect.run("a")
                assert.equal(re[0],null)
                assert.equal(re[1].get()['date']['year'], 2012)
                assert.equal(re[1].get()['date']['month'], 6)
                assert.equal(re[1].get()['date']['day'], 1)
                assert.equal(re[1].get()['time']['hour'], 13)
                assert.equal(re[1].get()['time']['minute'], 30)
                assert.equal(re[1].get()['time']['second'], 10)
                assert.equal(re[1].get()['time']['nanoSecond'], 8007006)
                assert.equal(re[2].get()['date']['year'], 2012)
                assert.equal(re[2].get()['date']['month'], 6)
                assert.equal(re[2].get()['date']['day'], 1)
                assert.equal(re[2].get()['time']['hour'], 13)
                assert.equal(re[2].get()['time']['minute'], 30)
                assert.equal(re[2].get()['time']['second'], 10)
                assert.equal(re[2].get()['time']['nanoSecond'], 8007007)
                assert.equal(re.toString(), ',2012-6-1 13:30:10.8007006ns,2012-6-1 13:30:10.8007007ns')
            });

            it('upload symbol set', async function() {
                var s = new Set(DT.Symbol(["qqq","qq","q"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var expected = new Set(["qqq","qq","q"])
                assert.deepEqual(re, expected)
            });
   
            it('upload int set', async function() {
                var s = new Set(DT.Int([2, 3, 5, 6]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var expected = new Set([2, 3, 5, 6])
                assert.deepEqual(re, expected)
            }); 
            it('upload float set', async function() {
                var s = new Set(DT.Float([2, 3, 5, 6]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var expected = new Set([2, 3, 5, 6])
                assert.deepEqual(re, expected)
            });
            
            it('upload double set', async function() {
                var s = new Set(DT.Double([2.0, -3, 5, 6.2]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var excepted = new Set([2.0, -3, 5, 6.2])
                assert.deepEqual(re, excepted)
            });
          it('upload long set', async function() {
                var s = new Set(DT.Long([2, 3, 5, 6]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var expected = new Set([2, 3, 5, 6])
                assert.deepEqual(re, expected)
            });
             it('upload short set', async function() {
                var s = new Set(DT.Short([2, 3, 5, 0]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var expected = new Set([2, 3, 5, 0])
                assert.deepEqual(re,expected)
            });
            it('upload char set', async function() {
                var s = new Set(DT.Char(['','$','a']))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                var expected = new Set([null,'$','a'])
                assert.deepEqual(re, expected)
            });
            it('upload int128 set', async function() {
                var s = new Set(DT.Int128(["e1671797c52e15f763380b45e841ec32",""]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.deepEqual(Array.from(re).toString(), '00000000000000000000000000000000,e1671797c52e15f763380b45e841ec32')
            });
            it('upload uuid set', async function() {
                var s = new Set(DT.UUID(["5d212a78-cc48-e3b1-4235-b4d91473ee87",""]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.deepEqual(Array.from(re).toString(),'00000000-0000-0000-0000-000000000000,5d212a78-cc48-e3b1-4235-b4d91473ee87')
            }); 

            it('upload ipaddr set', async function() {
                var s = new Set(DT.IpAddr(["192.168.1.13",""]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.deepEqual(Array.from(re).toString(), '0.0.0.0,192.168.1.13')
            });
            it('upload bool set', async function() {
                var s = new Set(DT.Bool([true,false]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.deepEqual(re, null)
            });
                it('upload bool null set', async function() {
                var s = new Set(DT.Bool([]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.deepEqual(re, null)
            }); 
            it('upload Date set', async function() {
                var s = new Set(DT.Date(["1960-01-01","1970-02-01"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['year'],1970)
                assert.equal(Array.from(re)[0].get()['month'],2)
                assert.equal(Array.from(re)[0].get()['day'],1)
                assert.equal(Array.from(re)[1].get()['year'],1960)
                assert.equal(Array.from(re)[1].get()['month'],1)   
                assert.equal(Array.from(re)[1].get()['day'],1)   
                   
                }); 

            it('upload month set', async function() {
                var s = new Set(DT.Month([,"1973-02","1960-01"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['year'],1960)
                assert.equal(Array.from(re)[0].get()['month'],1)
                assert.equal(Array.from(re)[1].get()['year'],1973)
                assert.equal(Array.from(re)[1].get()['month'],2)
            });
           it('upload time set', async function() {
                var s = new Set(DT.Time([, "13:30:10.009", "13:30:10.010"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")           
                assert.equal(Array.from(re)[0].get()['hour'], 13)
                assert.equal(Array.from(re)[0].get()['minute'], 30)
                assert.equal(Array.from(re)[0].get()['second'], 10)
                assert.equal(Array.from(re)[0].get()['nanoSecond'], 10000000)   
            });
            it('upload minute set', async function() {
                var s = new Set(DT.Minute(["13:31", "13:32"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['hour'], 13)
                assert.equal(Array.from(re)[0].get()['minute'], 32)
                assert.equal(Array.from(re)[1].get()['hour'], 13)
                assert.equal(Array.from(re)[1].get()['minute'], 31)                
            });
                   
            it('upload second set', async function() {
                var s = new Set(DT.Second(["13:31:10", "13:32:01"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['hour'], 13)
                assert.equal(Array.from(re)[0].get()['minute'], 32)
                assert.equal(Array.from(re)[0].get()['second'], 1)
                assert.equal(Array.from(re)[1].get()['hour'], 13)
                assert.equal(Array.from(re)[1].get()['minute'], 31)   
                assert.equal(Array.from(re)[1].get()['second'], 10)   
            }); 
             
           it('upload datetime set', async function() {
                var s = new Set(DT.DateTime(["2012-06-13 13:30:10", "2012-06-13 13:30:11"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['year'], 2012)
                assert.equal(Array.from(re)[0].get()['month'], 6)
                assert.equal(Array.from(re)[0].get()['day'], 13)
                assert.equal(Array.from(re)[0].get()['hour'], 13)
                assert.equal(Array.from(re)[0].get()['minute'], 30)
                assert.equal(Array.from(re)[0].get()['second'], 11)
                assert.equal(Array.from(re)[1].get()['year'], 2012)
                assert.equal(Array.from(re)[1].get()['month'], 6)
                assert.equal(Array.from(re)[1].get()['day'], 13)
                assert.equal(Array.from(re)[1].get()['hour'], 13)
                assert.equal(Array.from(re)[1].get()['minute'], 30)
                assert.equal(Array.from(re)[1].get()['second'], 10)
            });

            it('upload timestamp set', async function() {
                var s = new Set(DT.TimeStamp(["2012-06-13 13:30:10.008","2012-06-13 13:30:10.009"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['date']['year'], 2012)
                assert.equal(Array.from(re)[0].get()['date']['month'], 6)
                assert.equal(Array.from(re)[0].get()['date']['day'], 13)
                assert.equal(Array.from(re)[0].get()['time']['hour'], 13)
                assert.equal(Array.from(re)[0].get()['time']['minute'], 30)
                assert.equal(Array.from(re)[0].get()['time']['second'], 10)
                assert.equal(Array.from(re)[0].get()['time']['nanoSecond'], 9000000)
                assert.equal(Array.from(re)[1].get()['date']['year'], 2012)
                assert.equal(Array.from(re)[1].get()['date']['month'], 6)
                assert.equal(Array.from(re)[1].get()['date']['day'], 13)
                assert.equal(Array.from(re)[1].get()['time']['hour'], 13)
                assert.equal(Array.from(re)[1].get()['time']['minute'], 30)
                assert.equal(Array.from(re)[1].get()['time']['second'], 10)
                assert.equal(Array.from(re)[1].get()['time']['nanoSecond'], 8000000)
            });
            it('upload nanotime set', async function() {
                var s = new Set(DT.NanoTime(["13:30:10.008007006", "13:30:10.008007007"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['hour'], 13)
                assert.equal(Array.from(re)[0].get()['minute'], 30)
                assert.equal(Array.from(re)[0].get()['second'], 10)
                assert.equal(Array.from(re)[0].get()['nanoSecond'], 8007007)
                assert.equal(Array.from(re)[1].get()['hour'], 13)
                assert.equal(Array.from(re)[1].get()['minute'], 30)
                assert.equal(Array.from(re)[1].get()['second'], 10)
                assert.equal(Array.from(re)[1].get()['nanoSecond'], 8007006)
            });

            it('upload nanotimestamp set', async function() {
                var s = new Set(DT.NanoTimeStamp(["2012-06-01 13:30:10.008007006", "2013-06-01 13:30:10.008007007"]))
                await myConnect.upload("a", DT.Set(s))
                var re = await myConnect.run("a")
                assert.equal(Array.from(re)[0].get()['date']['year'], 2013)
                assert.equal(Array.from(re)[0].get()['date']['month'], 6)
                assert.equal(Array.from(re)[0].get()['date']['day'], 1)
                assert.equal(Array.from(re)[0].get()['time']['hour'], 13)
                assert.equal(Array.from(re)[0].get()['time']['minute'], 30)
                assert.equal(Array.from(re)[0].get()['time']['second'], 10)
                assert.equal(Array.from(re)[0].get()['time']['nanoSecond'], 8007007)
                assert.equal(Array.from(re)[1].get()['date']['year'], 2012)
                assert.equal(Array.from(re)[1].get()['date']['month'], 6)
                assert.equal(Array.from(re)[1].get()['date']['day'], 1)
                assert.equal(Array.from(re)[1].get()['time']['hour'], 13)
                assert.equal(Array.from(re)[1].get()['time']['minute'], 30)
                assert.equal(Array.from(re)[1].get()['time']['second'], 10)
                assert.equal(Array.from(re)[1].get()['time']['nanoSecond'], 8007006)
            });
    
            it('upload null set', async function() {
                await myConnect.upload("a", DT.Set())
                var re = await myConnect.run("a")
                console.log(re)
                assert.deepEqual(re, null)
            });   
 
            it('upload int int dictionary', async function() {
                var m = new Map(DT.Int([[1, 4], [2, 5], [3, 6]]))
                await myConnect.upload("a",  DT.Dict(m))
                var re = await myConnect.run("a")
                var expected = new Map([[1, 4], [2, 5], [3, 6]])
                assert.deepEqual(re, expected)
            });
 
            it('upload int string dictionary', async function() {
                let map = new Map();
                map.set(1,DT.Symbol("MSFT"))
                map.set(2,DT.Symbol("GOOG"))
                map.set(3,DT.Symbol('IBM'))
                await myConnect.upload("a",DT.Dict(map))
                var re = await myConnect.run("a")
                var expected = new Map([[1, 'MSFT'], [2, 'GOOG'], [3, 'IBM']])
                assert.deepEqual(re, expected)
            });
 
           it('upload  null dictionary', async function() {
                await myConnect.upload("a",  DT.Dict())
                var re = await myConnect.run("a")
                var expected = new Map() 
                assert.deepEqual(re, null)
            }); 

            it('upload int any dictionary', async function() {
                var arr1 = new Array([4,5,6])
                var arr2 = new Array([1,2])
                var m = new Map(DT.Int([[1, arr1], [2, arr2], [3, 6]]))
                await myConnect.upload("a",  DT.Dict(m))
                var re = await myConnect.run("a")
                assert.deepEqual(Array.from(re)[0][0],3)
                assert.deepEqual(Array.from(re)[0][1],6)
                assert.deepEqual(Array.from(re)[1][0],1)
                assert.deepEqual(Array.from(re)[1][1][0],[4,5,6])
                assert.deepEqual(Array.from(re)[2][0],2)
                assert.deepEqual(Array.from(re)[2][1][0],[1,2])
            }); 

            it('upload string any dictionary', async function() {
                let map = new Map();
                map.set('a',DT.Int([4,5,6]))
                map.set('b',DT.Int([1,2]))
                map.set('c',DT.Int(6))
                await myConnect.upload("a",  DT.Dict(map))
                var re = await myConnect.run("a")
                console.log(re)
                assert.deepEqual(Array.from(re)[0][0],'c')
                assert.deepEqual(Array.from(re)[0][1],6)
                assert.deepEqual(Array.from(re)[1][0],'a')
                assert.deepEqual(Array.from(re)[1][1],[4,5,6])
                assert.deepEqual(Array.from(re)[2][0],'b')
                assert.deepEqual(Array.from(re)[2][1],[1,2])
            });

            it('upload int pair', async function() {
                var a = new Array(1, 3)
                await myConnect.upload("a",  DT.Pair(DT.Int(a)))
                var re = await myConnect.run("a")
                var expected = new Array(1, 3)
                assert.deepEqual(re, expected)
            });

            it('upload string pair', async function() {
                var a = new Array('hello', 'world')
                await myConnect.upload("a",  DT.Pair(DT.Symbol(a)))
                var re = await myConnect.run("a")
                var expected = new Array('hello', 'world')
                assert.deepEqual(re, expected)
            });

            it('upload bool pair', async function() {
                var a = new Array(true,false)
                await myConnect.upload("a",  DT.Pair(DT.Bool(a)))
                var re = await myConnect.run("a")
                var expected = new Array(true,false)
                assert.deepEqual(re, expected)
            });

            it('upload char pair', async function() {
                var a = new Array('2', '#')
                await myConnect.upload("a",  DT.Pair(DT.Char(a)))
                var re = await myConnect.run("a")
                var expected = new Array('2', '#')
                assert.deepEqual(re, expected)
            });
            it('upload short pair', async function() {
                var a = new Array(0, -3)
                await myConnect.upload("a",  DT.Pair(DT.Short(a)))
                var re = await myConnect.run("a")
                var expected = new Array(0,-3)
                assert.deepEqual(re, expected)
            });
            it('upload long pair', async function() {
                var a = new Array(0, -3)
                await myConnect.upload("a",  DT.Pair(DT.Long(a)))
                var re = await myConnect.run("a")
                var expected = new Array(0,-3)
                assert.deepEqual(re, expected)
            });
            
            it('upload float pair', async function() {
                var a = new Array(0, -3)
                await myConnect.upload("a",  DT.Pair(DT.Float(a)))
                var re = await myConnect.run("a")
                var expected = new Array(0,-3)
                assert.deepEqual(re, expected)
            });

            it('upload double pair', async function() {
                var a = new Array(0, -3.3)
                await myConnect.upload("a",  DT.Pair(DT.Double(a)))
                var re = await myConnect.run("a")
                var expected = new Array(0,-3.3)
                assert.deepEqual(re, expected)
            });

            it('upload date pair', async function() {
                var a = new Array("1961-01-01","1960-02-02")
                await myConnect.upload("a",  DT.Pair(DT.Date(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['year'],1961)
                assert.equal(re[0].get()['month'],1)
                assert.equal(re[0].get()['day'],1)
                assert.equal(re[1].get()['year'],1960)
                assert.equal(re[1].get()['month'],2)
                assert.equal(re[1].get()['day'],2)
            });

            it('upload month pair', async function() {
                var a = new Array("1961-01","1960-02")
                await myConnect.upload("a",  DT.Pair(DT.Month(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['year'],1961)
                assert.equal(re[0].get()['month'],1)
                assert.equal(re[1].get()['year'],1960)
                assert.equal(re[1].get()['month'],2)
            });

             it('upload time pair', async function() {
                 var a = new Array("13:30:10.008",)
                await myConnect.upload("a",  DT.Pair(DT.Time(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[0].get()['nanoSecond'], 8000000)
            });

            it('upload minute pair', async function() {
                 var a = new Array("13:30",)
                await myConnect.upload("a",  DT.Pair(DT.Minute(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
            });

            it('upload second pair', async function() {
               var a = new Array("13:30:10",)
                await myConnect.upload("a",  DT.Pair(DT.Second(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
            });

            it('upload datetime pair', async function() {
               var a = new Array("2012-06-13 13:30:10",)
                await myConnect.upload("a",  DT.Pair(DT.DateTime(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['year'], 2012)
                assert.equal(re[0].get()['month'], 6)
                assert.equal(re[0].get()['day'], 13)
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
            });

            it('upload timestamp pair', async function() {
                var a = new Array("2012-06-13 13:30:10.008",)
                await myConnect.upload("a",  DT.Pair(DT.TimeStamp(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['date']['year'], 2012)
                assert.equal(re[0].get()['date']['month'], 6)
                assert.equal(re[0].get()['date']['day'], 13)
                assert.equal(re[0].get()['time']['hour'], 13)
                assert.equal(re[0].get()['time']['minute'], 30)
                assert.equal(re[0].get()['time']['second'], 10)
                assert.equal(re[0].get()['time']['nanoSecond'], 8000000)
            });

            it('upload nanotime pair', async function() {
                var a = new Array("13:30:10.008007006",)
                await myConnect.upload("a",  DT.Pair(DT.NanoTime(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['hour'], 13)
                assert.equal(re[0].get()['minute'], 30)
                assert.equal(re[0].get()['second'], 10)
                assert.equal(re[0].get()['nanoSecond'], 8007006)
            });

            it('upload nanotimestamp pair', async function() {
                var a = new Array("2012-06-01 13:30:10.008007006",)
                await myConnect.upload("a",  DT.Pair(DT.NanoTimeStamp(a)))
                var re = await myConnect.run("a")
                assert.equal(re[0].get()['date']['year'], 2012)
                assert.equal(re[0].get()['date']['month'], 6)
                assert.equal(re[0].get()['date']['day'], 1)
                assert.equal(re[0].get()['time']['hour'], 13)
                assert.equal(re[0].get()['time']['minute'], 30)
                assert.equal(re[0].get()['time']['second'], 10)
                assert.equal(re[0].get()['time']['nanoSecond'], 8007006)
            });
            it('upload null matrix', async function() {         
                await myConnect.upload("a",DT.Matrix({data:[]}));
                var re = await myConnect.run("a")
                assert.deepEqual(re,null)
            });

            it('upload int matrix', async function() {             
                await myConnect.upload("a",DT.Matrix({ data:DT.Int([[1,2,3],[4,5,6]])}))
                var re = await myConnect.run("a")
                var expected1 = new Array(1, 2, 3)
                var expected2 = new Array(4, 5, 6)
                assert.deepEqual(re["data"][0], expected1)
                assert.deepEqual(re["data"][1], expected2)
            });
 
            it('upload int one column matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Int([[1,2,3]])))
                var re = await myConnect.run("a")
                var expected1 = new Array(1, 2, 3)
                assert.deepEqual(re[0], expected1)
            });

            it('upload int one row matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Int([[1],[2],[3]])))
                var re = await myConnect.run("a")              
                var expected1 = [1]
                var expected2 = [2]
                var expected3 = [3]
                assert.deepEqual(re[0], expected1)
                assert.deepEqual(re[1], expected2)
                assert.deepEqual(re[2], expected3)
            });
      
            it('upload int matrix with col label', async function() {
                await myConnect.upload("a",DT.Matrix({colnames:['r1','r2','r3'], rownames:['col1','col2'], data:DT.Int([[1,2,3],[4,5,6]])}))
                var re = await myConnect.run("a")     
                var expected1 = new Array(1, 2, 3)
                var expected2 = new Array(4, 5, 6)
                assert.deepEqual(re["colnames"],['r1','r2','r3'])
                assert.deepEqual(re["rownames"], ['col1','col2'])
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2)
            }); 
    
            it('upload int all null matrix', async function() {
                await myConnect.upload("a",DT.Matrix({type:'int',data:[]}))
                var re = await myConnect.run("a")
                var expected1 = new Array()
                assert.deepEqual(re.data, expected1)
            });

          it('upload symbol matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Symbol([['AA', 'BB'],[ 'CC', 'DD']])))
                var re = await myConnect.run("a")    
                var expected1 = new Array('AA','BB')
                var expected2 = new Array('CC', 'DD')
                assert.deepEqual(re[0], expected1)
                assert.deepEqual(re[1], expected2)
            }); 

            it('upload bool matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Bool([[true,false],[ false,]])))
                var re = await myConnect.run("a")    
                var expected1 = new Array(true,false)
                var expected2 = new Array(false)
                assert.deepEqual(re[0], expected1)
                assert.deepEqual(re[1], expected2)
            }); 

            it('upload char matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Char([['a','b'],[ 'c','']])))
                var re = await myConnect.run("a")    
                assert.deepEqual(re[0], ['a','b'])
                assert.deepEqual(re[1], ['c',null])
            }); 

            it('upload float matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Float([[1,2],[ 0,]])))
                var re = await myConnect.run("a")  
                assert.deepEqual(re[0], [1,2])
                assert.deepEqual(re[1], [0])
            }); 

            it('upload double matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Double([[1,2],[0,]])))
                var re = await myConnect.run("a")       
                assert.deepEqual(re[0], [1,2])
                assert.deepEqual(re[1], [0])
            }); 
            it('upload short matrix', async function() {
                await myConnect.upload("a",  DT.Matrix(DT.Short([[1,2],[0,]])))
                var re = await myConnect.run("a")         
                assert.deepEqual(re[0], [1,2])
                assert.deepEqual(re[1], [0])
            }); 
            it('upload long matrix', async function() {
               await myConnect.upload("a",  DT.Matrix(DT.Long([[1,2],[0,]])))
                var re = await myConnect.run("a")         
                assert.deepEqual(re[0], [1,2])
                assert.deepEqual(re[1], [0])
            }); 

            it('upload date matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.Date([["1973-02-01","1960-01-01","1970-01-03"],["1973-02-02","1960-01-02","1970-02-03"]])))
                var re = await myConnect.run("a")     
                assert.equal(re[0].toString(),'1973-2-1,1960-1-1,1970-1-3')
                assert.equal(re[1].toString(),'1973-2-2,1960-1-2,1970-2-3')
            }); 

            it('upload month matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.Month([["1973-02","1960-01"],["1973-03","1960-04"]])))
                var re = await myConnect.run("a")     
                assert.equal(re[0].toString(),'1973-2,1960-1')
                assert.equal(re[1].toString(),'1973-3,1960-4')
            }); 

            it('upload time matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.Time([["13:30:10.009", "12:30:10.010"],["13:30:10.011", "12:30:10.012"]])))
                var re = await myConnect.run("a")     
                assert.equal(re[0].toString(),'13:30:10.9000000ns,12:30:10.10000000ns')
                assert.equal(re[1].toString(),'13:30:10.11000000ns,12:30:10.12000000ns')
            }); 

            it('upload minute matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.Minute([["13:10","13:11"],["13:12","13:13"]])))
                var re = await myConnect.run("a")     
                console.log(re)    
                assert.equal(re[0].toString(),'13:10,13:11')
                assert.equal(re[1].toString(),'13:12,13:13')
            }); 

            it('upload second matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.Second([["13:30:10","13:30:11"],["13:30:12","13:30:13"]])))
                var re = await myConnect.run("a")     
                assert.equal(re[0].toString(),'13:30:10,13:30:11')
                assert.equal(re[1].toString(),'13:30:12,13:30:13')
            }); 

            it('upload datetime matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.DateTime([["2012-06-13 13:30:10", "2012-06-13 13:30:11"],["2012-06-13 13:30:12","2012-06-13 13:30:13" ]])))
                var re = await myConnect.run("a")     
                assert.equal(re[0].toString(),'2012-6-13 13:30:10,2012-6-13 13:30:11')
                assert.equal(re[1].toString(),'2012-6-13 13:30:12,2012-6-13 13:30:13')
            }); 

            it('upload timestamp matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.TimeStamp([["2012-06-13 13:30:10.009", "2012-06-13 13:30:11.008"],["2012-06-13 13:30:11.008","2012-06-13 13:30:11.009" ]])))
                var re = await myConnect.run("a")     
                assert.equal(re[0].toString(),'2012-6-13 13:30:10.9000000ns,2012-6-13 13:30:11.8000000ns')
                assert.equal(re[1].toString(),'2012-6-13 13:30:11.8000000ns,2012-6-13 13:30:11.9000000ns')
            }); 
            it('upload nanotime matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.NanoTime([["13:30:10.008007006", "13:30:10.008007007"],["13:30:10.008007007", "13:30:10.008007006"]])))
                 var re = await myConnect.run("a")     
                 console.log(re)    
                 assert.equal(re[0].toString(),'13:30:10.8007006ns,13:30:10.8007007ns')
                 assert.equal(re[1].toString(),'13:30:10.8007007ns,13:30:10.8007006ns')
            }); 

            it('upload nanotimestamp matrix', async function() {
                await myConnect.upload("a", 
                DT.Matrix(DT.NanoTimeStamp([["2012-06-01 13:30:10.008007006", "2012-06-01 13:30:10.008007007"],["2012-06-01 13:30:10.008007007", "2012-06-01 13:30:10.008007008"]])))
                 var re = await myConnect.run("a")     
                 console.log(re)    
                 assert.equal(re[0].toString(),'2012-6-1 13:30:10.8007006ns,2012-6-1 13:30:10.8007007ns')
                 assert.equal(re[1].toString(),'2012-6-1 13:30:10.8007007ns,2012-6-1 13:30:10.8007008ns')
            }); 

            it('upload table', async function() {
                await myConnect.upload("a",  DT.Table({colnames:['id','val'],types:["int","string"],data:[DT.Int([1,2,3]),DT.Symbol(['xa', 'ya', 'za'])]}))
                var re = await myConnect.run("a")
                assert.deepEqual(re["colnames"],['id','val'])
                assert.deepEqual(re["data"][0],[1,2,3])
                assert.deepEqual(re["data"][1],['xa', 'ya', 'za'])
            });

            it('upload empty table', async function() {
                await myConnect.upload("a",  DT.Table({colnames:["id","val"]}))
                var re = await myConnect.run("a")
                assert.equal(re, null)
            });

            it('upload Multiple variables', async function() {
                await myConnect.upload("a,b,c",  DT.Table({colnames:["id","val"]}),DT.Int([0,2,1]),DT.Int(1))
                var re = await myConnect.run("a")
                var re1 = await myConnect.run("b")
                var re2 = await myConnect.run("c")
                assert.equal(re, null)
                assert.deepEqual(re1, [0, 2, 1])
                assert.equal(re2, 1)
            });
                   
        });
    });    
}

test_upload()           
