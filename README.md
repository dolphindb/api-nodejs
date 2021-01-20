# NodeJS-API

## 使用说明
### 运行环境
要求Nodejs版本**10.21**或以上。使用到了BigInt。

### 1. 建立连接
```js
const {DBconnection} = require('dolphindb-api-nodejs');
var conn = new DBconnection();
await conn.connect("localhost", 8848);
```
函数说明：

connect(host, port, username, password)
- host: 主机名
- port: 主机端口
- username: 用户名
- password: 用户密码

### 2. 运行脚本
建立连接之后，可以把脚本传输到服务端运行，并返回相应结果，如下所示：
```js
let result;
result = await conn.run('typestr [1,2,3]');
// 返回 FAST INT VECTOR
result = await conn.run("dict(1 7 5,`AA`BB`CC)");
// 返回 Map(3) {5 => CC, 1 => AA, 7=> BB}
```
### 3. 运行函数
```js
result = await conn.runFunc('add', [1,2,3], [4,5,6]);
// 返回 [5,7,9]
await conn.run('a=[1,2,3]');
result = await conn.runFunc('add{a,}', [1,2.6,7]);
// 返回 [2, 4.6, 10]
```
函数说明：

runFunc(funcName, ...args)
- funcName: 要在服务端运行的函数名（由数据库本身提供）
- args: 参数列表，可传入任意多个参数

注意,在上传参数时，可能需要进行包装, 以下进行说明：  


标量类型 
- - -
- bool类型， 可以直接传递或使用DT.Bool包装
- char类型， 需使用DT.Char包装
- short类型， 需使用DT.Short包装
- int类型， 可以直接传递或使用DT.Int包装
- long类型， 可以直接传递或使用DT.Long包装
- date类型，需使用DT.Date包装，支持字符串格式`YYYY-MM-DD`，对象格式`{year: 1970, month: 1, day: 1}`和天数格式（距离1970年1月1日的天数）
- month类型，需要使用DT.Month包装，支持字符串格式`YYYY-MM`，对象格式`{year: 1970, month: 1}`和月格式（距离公元0年初始的月数）
- time类型， 需使用DT.Time包装，支持字符串格式`HH:mm:ss.s`，对象格式`{hour: 0, minute: 0, second: 0, nanoSecond: 0}`和毫秒格式（距离当天0点的毫秒数）
- minute类型： 需使用DT.Minute包装，支持字符串格式`HH:mm`，对象格式`{hour: 0, minute: 0}`和分钟格式（距离当天0点的分钟数）
- second类型： 需要使用DT.Second包装，支持字符串格式`HH:mm:ss`，对象格式`{hour: 0, minute: 0, second:0}`和秒格式（距离当天0点的秒数）
- datetime类型：需要使用DT.DateTime包装，支持字符串格式`YYYY-MM-DD HH:mm:ss`，对象格式`{year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0}`和秒格式(距离1970年1月1日0点的秒数)
- timestamp类型: 需要使用DT.TimeStamp包装，支持字符串格式`YYYY-MM-DD HH:mm:ss.s`, 对象格式`{date: {year: 1970, month: 1, day: 1}, time: {hour: 0, minute: 0, second: 0, nanoSecond: 0}}`和毫秒格式（距离1970年1月1日0点的毫秒数，需要使用BigInt类型数值）
- nanotime类型：需要使用DT.NanoTimeStamp包装，支持字符串格式`YYYY-MM-DD HH:mm:ss.s`,对象格式`{hour: 0, minute: 0, second: 0, nanoSecond: 0}`和纳秒格式（距离当天0点的纳秒数，需使用BigInt类型数值）
- nanotimestamp类型： 需要使用DT.NanoTimeStamp包装，支持字符串格式`YYYY-MM-DD HH:mm:ss.s`，对象格式`{date: {year: 1970, month: 1, day: 1}, time: {hour: 0, minute: 0, second: 0, nanoSecond: 0}}`和纳秒格式（距离1970年1月1日0点的纳秒数，需要使用BigInt类型数值）
- float类型: 需要使用DT.Float包装
- double类型: 可以直接传递或使用DT.Double包装
- symbol类型: 需要使用DT.Symbol包装
- string类型： 可以直接传递或使用DT.String包装
- uuid类型: 需要使用DT.UUID包装，支持字符串格式`00000000-0000-0000-0000-000000000000`和对象格式`{high: 0n, low: 0n}`
- ipaddr类型： 需要使用DT.IpAddr包装，支持字符串格式`192.168.1.0`和对象格式`{high: 0n, low: 0n}`。对于Ipv6格式，可以直接以16进制字符格式传递（不要`:`号）
- int128类型：需要使用DT.Int128包装，支持字符串格式`e1671797c52e15f763380b45e841ec32`和对象格式`{high: 0n, low: 0n}`
- null类型： 需要使用DT.Null包装。以上各种类型都对应一个NULL类型，例如int类型的NULL类型可表示为`DT.Int(), DT.Int(null), DT.Null('int')`, 对于服务器端`void`类型，则使用`DT.Null(0)`或`DT.Null('void')`表示。

复合类型
- - -
- vector类型： 对应javascript中的Array类型，可以直接传递或使用DT.Vector包装
- pair类型： 2元组的vector类型，需使用DT.Pair包装，传入字符形式的数据对，如`'12:18'`
- matrix类型： 需要使用DT.Matrix包装，传入矩阵对象`{colnames:[], rownames: [], type: 'int', data: [[1,2],[3,4]]}`。除了`data`为必须，其它均可不设置
- set类型： 对应javascript中的Set类型，需要使用DT.Set包装
- dictionary类型： 对应javascript中的Map类型，需要使用DT.Dict包装
- table类型： 需要使用DT.Table包装， 传入表对象`{tablename:'t', colnames: ['id','val'], types: ['int','string'], data: [[1,2,3],['aa','bb','mm']]}`。除了`data`为必须，其它均可不设置

### 4. 上传本地对象到服务器
```js
const {DT} = require('dolphindb-api-nodejs')

await conn.upload("a",  DT.TimeStamp("2012-06-13 13:30:10.008"));
result = await conn.run('a');
// 返回TimeStamp对象， 需使用toString()方法格式化输出， 结果为： 2012-6-13 13:30:10.8000000ns
```
函数说明：

upload(varnames, ...vars)
- varnames: 上传的变量名，如有多个，以`,`分隔。
- vars: 变量列表，可传入任意多个变量

上传变量格式与上传函数参数时使用的格式相同 

### 5. 流数据
#### 订阅
```js
const {StreamClient} = require('dolphindb-api-nodejs');
const client = new StreamClient(8997); // 提供本地监听端口    

var script = '' +
'share streamTable(100:0, `sym`date`price`qty, [SYMBOL, DATE, DOUBLE, INT]) as trades \n'+
'setStreamTableFilterColumn(trades, `qty) \n'+
'tmp = table(symbol(`A`B`C`D`E) as sym, 2012.01.01..2012.01.05 as date, [20.5, 45.2, 15.6, 58.4, 12.0] as price, [2200, 1500, 4800, 5900, 4600] as qty) \n'+
'trades.append!(tmp)'
await conn.run(script)
client.subscribe("localhost",8848, "trades", "trades_sub1", {handler: function(data) {console.log(data)}, offset:0,filter:Int([2200, 1500])})
```
函数说明：
subscibe (host, port, tableName, actionName, options)
- host：发布端节点的IP地址。
- port：发布端节点的端口号。
- tableName：发布表的名称。
- actionName：订阅任务的名称。
- options：可选参数，包括，

    - handler：用户自定义的回调函数，用于处理每次流入的数据。  
    - offset：整数，表示订阅任务开始后的第一条消息所在的位置。消息是流数据表中的行。如果没有指定offset，或它为负数或超过了流数据表的记录行数，订阅将会从流数据表的当前行开始。offset与流数据表创建时的第一行对应。如果某些行因为内存限制被删除，在决定订阅开始的位置时，这些行仍然考虑在内。  
    - filter：向量，表示过滤条件。流数据表过滤列在filter中的数据才会发布到订阅端，不在filter中的数据不会发布。  
    - allowExistTopic: bool值。
    - msgAsTable: bool值，当值为true时，订阅到的数据包会附上table表头，格式如{header:[columes],body:[value]}，否则仅返回数据。
    
需要注意的是若客户端只接收到一行数据，则nodejs返回的是一维数组;若接收到多行数据时，返回的是二维数组。

#### 取消订阅
```js
await client.unsubscribe("127.0.0.1", 8848, "trades", "trades_subs1");
```
函数说明：
unsubscibe (host, port, tableName, actionName)

参数意义同subscribe()函数。

