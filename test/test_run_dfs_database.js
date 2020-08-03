
'use strict';

async function test_run_dfs(){
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

    beforeEach(async function() {
        var script = ''+
        'login("admin", "123456") \n'+
        'dbName="dfs://db_testRun" \n' +
        'if(existsDatabase(dbName)){ \n'+
        '   dropDatabase(dbName) \n'+
        '} \n'+
        'db=database(dbName, VALUE, 1..5) \n'+
        't=table(take(1..5, 100) as id, 1..100 as val) \n'+
        'pt=db.createPartitionedTable(t, "pt", "id").append!(t) \n'
        await myConnect.run(script)
        });

      describe('#DBconnection.js', function() {
        describe('#run dfs related function()', function() {
            it('run existsDatabase', async function() {
                var re = await myConnect.run('existsDatabase("dfs://db_testRun")')
                assert.equal(re, true)
            });

            it('run existsTable', async function() {
                var re = await myConnect.run('existsTable("dfs://db_testRun", "pt")')
                assert.equal(re, true)
            });

            it('run query dfs table', async function() {
                var re = await myConnect.run('select * from loadTable("dfs://db_testRun", "pt")')
                var colNames = ['id','val']
                assert.deepEqual(re.colnames, colNames)
                assert.equal(re.data[0].length, 100)
                assert.equal(re.data[1].length, 100)
            });

            it('run query dfs table', async function() {
                var re = await myConnect.run('select count(*) as num from loadTable("dfs://db_testRun", "pt") group by id')
                var colNames = ['id', 'num']
                var expected1 = [1, 2, 3, 4, 5]
                var expected2 = [20, 20, 20, 20, 20]
                assert.deepEqual(re.colnames, colNames)
                assert.deepEqual(re.data[0], expected1)
                assert.deepEqual(re.data[1], expected2) 
            });

            // it('run schema', async function() {
            //     var re = await myConnect.run('schema(loadTable("dfs://db_testRun", "pt"))')
            //     console.log(re)
            // });

            it('run drop partition', async function() {
                await myConnect.run('dropPartition(database("dfs://db_testRun"), 1)')
                var re = await myConnect.run('select * from loadTable("dfs://db_testRun", "pt") where id=1')
                var colNames = ['id', 'val']
                assert.deepEqual(re.colnames, colNames)
                assert.equal(re.data[0].length, 0)
                assert.equal(re.data[1].length, 0)
            });

            it('run drop table', async function() {
                await myConnect.run('dropTable(database("dfs://db_testRun"), "pt")')
                var re = await myConnect.run('existsTable("dfs://db_testRun", "pt")')
                assert.equal(re, false)
            });

            it('run drop database', async function() {
                await myConnect.run('dropDatabase("dfs://db_testRun")')
                var re = await myConnect.run('existsDatabase("dfs://db_testRun")')
                assert.equal(re, false)
            });

        });
    });    
}

test_run_dfs()
