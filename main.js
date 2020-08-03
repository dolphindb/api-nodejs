'use strict';

const Client = require('./src/streaming/Client');

function assertEquals(expected, value, name) {
    if (typeof name === 'undefined')
        name = ""
    if (expected === value){
        console.log(name+" pass\n");
        return true;
    }
    else{
        console.log(`${name} failed (expected: ${expected}, get: ${value})\n`);
        return false;
    } 
        
}

function assertArrayEquals(expected, value) {
    if (!(expected instanceof Array)){
        return expected === value
    }
    else{
        // let check;
        for (let i=0; i<expected.length; i++){
            if (!assertArrayEquals(expected[i], value[i])){
                console.log(`check failed (expected: ${expected[i]}, get: ${value[i]})\n`);
                return false;
            }
        }
            
        return true;
    }
}

function  assertLog(check, name) {
    if (check)
        console.log(name+" pass\n");
    else 
        console.log(name + " failed\n");
}

function handleMsg(data) {
    console.log(data);
}

async function main () {
    var DBconnection = require('./src/DBconnection'); //import API module
    var myConnect = new DBconnection();           //create connection object
    await myConnect.connect("localhost", 8848);   //set up connection
    const test = true;
    const debug = !test;
    let result;
    if (test){
        //scalar
        console.log('scalar');
        assertEquals("a", (await myConnect.run("'a'")), "char");
        assertEquals(false, (await myConnect.run("false")), "bool1");
        assertEquals(true, (await myConnect.run("true")), "bool2");
        assertEquals(1, (await myConnect.run("1h")), "short");
        assertEquals(-1, (await myConnect.run("-1")), "int");
        assertEquals(1n, (await myConnect.run("1l")), "long1");
        assertEquals(-1n, (await myConnect.run("-1l")), "long2");
        assertEquals(1.1, (await myConnect.run("1.1f")), "float");  //due to limited precision, maybe fail
        assertEquals(1.1, (await myConnect.run("1.1")), "double");
        assertEquals("hello world", (await myConnect.run("'hello world'")),"string");
        assertEquals("2013-6-13", (await myConnect.run("2013.06.13")).toString(), "date");
        assertEquals("2012-6", (await myConnect.run("2012.06M")).toString(), "month");
        assertEquals("13:30:10.8000000ns", (await myConnect.run("13:30:10.008")).toString(), "time");
        assertEquals("13:30", (await myConnect.run("13:30m")).toString(), "minute")
        assertEquals("13:30:10", (await myConnect.run("13:30:10")).toString(), "second");
        assertEquals("2012-6-13 13:30:10", (await myConnect.run("2012.06.13 13:30:10")).toString(), "datetime1");
        assertEquals("1960-6-13 13:30:10", (await myConnect.run("1960.06.13 13:30:10")).toString(), "datetime2");
        assertEquals("2012-6-13 13:30:10.8000000ns", (await myConnect.run("2012.06.13 13:30:10.008")).toString(), "timestamp1");
        assertEquals("1960-6-13 13:30:10.8000000ns", (await myConnect.run("1960.06.13 13:30:10.008")).toString(), "timestamp2");
        assertEquals("13:30:10.8007006ns", (await myConnect.run("13:30:10.008007006")).toString(), "nanotime");
        assertEquals("2012-6-13 13:30:10.8007006ns", (await myConnect.run("2012.06.13 13:30:10.008007006")).toString(), "nanotimestamp1");
        assertEquals("1958-6-13 13:30:10.8007006ns", (await myConnect.run("1958.06.13 13:30:10.008007006")).toString(), "nanotimestamp2");
        result = await myConnect.run("uuid('5d212a78-cc48-e3b1-4235-b4d91473ee87')");
        assertEquals("5d212a78-cc48-e3b1-4235-b4d91473ee87", result.toString(), "uuid");
        result = await myConnect.run("ipaddr('192.168.1.13')")
        assertEquals("192.168.1.13", result.toString(), "ipaddr");
        result = await myConnect.run("int128('e1671797c52e15f763380b45e841ec32')")
        assertEquals("e1671797c52e15f763380b45e841ec32", result.toString(), 'int128');
        // vector
        console.log('vector');
        result = await myConnect.run("`aa`BB`cc");
        assertLog(assertArrayEquals(["aa","BB","cc"], result), "vector1");
        result = await myConnect.run("1 2 3");
        assertLog(assertArrayEquals([1,2,3], result), "vector2");
        //symbol
        console.log("symbol");
        result = await myConnect.run("symbol(['AA','BB','CC'])");
        assertLog(assertArrayEquals(['AA','BB', 'CC'], result), "symbol");
        //pair
        console.log('pair');
        result = await myConnect.run("1:5");
        assertLog(assertArrayEquals([1,5], result), "pair1");
        result = await myConnect.run("2.8:7.4");
        assertLog(assertArrayEquals([2.8, 7.4], result), "pair2");
        //matrix
        console.log('matrix');
        result = await myConnect.run("1..6$2:3");
        assertLog(assertArrayEquals(null, result.rownames)&&assertArrayEquals(null, result.colnames)&&
            assertArrayEquals([[1,2],[3,4],[5,6]], result.data),"matrix1");
        result = await myConnect.run("m=1..12$3:4;m.rename!(`c1`c2`c3`c4);m;");
        assertLog(assertArrayEquals(null, result.rownames)&&assertArrayEquals(["c1","c2","c3","c4"], result.colnames)&&
            assertArrayEquals([[1,2,3],[4,5,6],[7,8,9],[10,11,12]], result.data),"matrix2");
        result = await myConnect.run("m=1..12$3:4;m.rename!(`r1`r2`r3,NULL);m;");
        assertLog(assertArrayEquals(["r1","r2","r3"], result.rownames)&&assertArrayEquals(null, result.colnames)&&
            assertArrayEquals([[1,2,3],[4,5,6],[7,8,9],[10,11,12]], result.data),"matrix3");
        result = await myConnect.run("m=1..12$3:4;m.rename!(`r1`r2`r3,`c1`c2`c3`c4);m;");
        assertLog(assertArrayEquals(["r1","r2","r3"], result.rownames)&&assertArrayEquals(["c1","c2","c3","c4"], result.colnames)&&
            assertArrayEquals([[1,2,3],[4,5,6],[7,8,9],[10,11,12]], result.data),"matrix4");
        //set
        console.log('set');
        result = await myConnect.run("set([1,2,3])");
        // console.log(result)
        assertLog(assertArrayEquals([1,2,3], Array.from(result).sort()), "set1");
        result = await myConnect.run("set(['aa','bb','rr','bb'])");
        // console.log(result)
        assertLog(assertArrayEquals(["aa","bb","rr"], Array.from(result).sort()),"set2");
        //dictionary
        console.log('dictionary');
        result = await myConnect.run("dict(1 7 5,`AA`BB`CC)");
        assertLog(assertArrayEquals(["AA","BB","CC"],[result.get(1),result.get(7),result.get(5)]),"dict1");
        result = await myConnect.run("dict(`IBM`GOOG`MSFT, (1 2 3, 4 5 6, 7 8 9));")
        // console.log(result)
        assertLog(assertArrayEquals([[1,2,3],[4,5,6],[7,8,9]], [result.get("IBM"),result.get("GOOG"),result.get("MSFT")]),"dict2");
        // table
        console.log('table');
        result = await myConnect.run("t1=table(1 2 3 as a, `x`y`z as b, 10.8 7.6 3.5 as c);t1;");
        assertLog(result.tablename === "t1"&&assertArrayEquals(["a","b","c"], result.colnames)&&
            assertArrayEquals([[1,2,3],["x","y","z"],[10.8,7.6,3.5]], result.data), "table1");
        result = await myConnect.run("table(1..12$3:4)");
        assertLog(result.tablename===""&&assertArrayEquals(["col0","col1","col2"],result.colnames)&&
            assertArrayEquals([[1,2,3],[4,5,6],[7,8,9],[10,11,12]], result.data), "table2");
    }
     
    if (debug) {
        //debug 
        console.log("debug");
        // result = await myConnect.run("1960.06.13 13:30:10");
        // result =  await myConnect.run("1960.06M");
        // result = await myConnect.run("1958.06.13 13:30:10.008007006");
        // result = await myConnect.run("(1,'AA', 2.5)");
        // result = new BasicDateTime("1958-06-13 13:30:10");
        // result = await myConnect.run("table(1:0,`id`val,[INT,INT])");
        // var script = 'login("admin", "123456") \n'+
        // 'dbName="dfs://db_testRun" \n' +
        // 'if(existsDatabase(dbName)){ \n'+
        // '   dropDatabase(dbName) \n'+
        // '} \n'+
        // 'db=database(dbName, VALUE, 1..5) \n'+
        // 't=table(take(1..5, 100) as id, 1..100 as val) \n'+
        // 'pt=db.createPartitionedTable(t, "pt", "id").append!(t) \n';
        // await myConnect.run(script);
        // result = await myConnect.run('schema(loadTable("dfs://db_testRun", "pt"))');
        // // result = await myConnect.run("NULL");
        // console.log(result);
        const client = new Client(8998);
        client.subscribe("192.168.1.111", 8848, "trades3", "trades_sub1", {handler:handleMsg, offset:-1, filter:null})
    }


    
}

main();