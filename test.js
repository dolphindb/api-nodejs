'use strict';

const DT = require('./src/DT');
const Client = require('./src/streaming/Client');

function handleMsg (data) {
    console.log("I'm handle 1", data);
}
function handleMsg2 (data) {
    console.log("I'm handle 2", data);
}

async function main () {
    var DBconnection = require('./src/DBconnection'); //import API module
    var myConnect = new DBconnection();           //create connection object
    await myConnect.connect("localhost", 8848);   //set up connection
    const test = true;
    const debug = !test;
    let result;
    if (test) {
        result = await myConnect.run("x=[1,3,5];y=[2,4,6];add(x,y);")
        console.log(result);
        result = await myConnect.runFunc("add{x,}", DT.Int([DT.Float(3.2),2,3])); // only support scalar embedding
        console.log(result);
        result = await myConnect.runFunc("add{y,}", DT.Float([1.2,4.5,3.4]));
        console.log(result);
        result = await myConnect.runFunc("add", DT.Int(23), DT.Int(15));
        console.log(result);
        result = await myConnect.upload("a", DT.Double([1.5,2.5,-7]));
        console.log(result);
        result = await myConnect.run("accumulate(+,a)");
        console.log(result);
        result = await myConnect.upload("a,b", DT.Double([1.9,7.3,-1.0]),DT.Long([1,2,3]));
        console.log(result);
        result = await myConnect.run("accumulate(+,b)");
        console.log(result);
        result = await myConnect.run("add(a,b)");
        console.log(result);
    }

    if (debug) {
        // result = await myConnect.runFunc("getSubscriptionTopic", "trades", "nodejsStreamingApi")
        // result = await myConnect.subscribe("trades", null, "tradesapi1")
        // const client = new Client(8997);
        // client.subscribe("127.0.0.1", 8848, "trades", "trades_subs1", {handler: handleMsg});
        // console.log(result);
        // client.subscribe("127.0.0.1", 8848, "trades", "trades_subs2", {handler: handleMsg2});
    }
    
}
main()
