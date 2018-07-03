//如果说话的时候富裕一些特殊意义,可以自己增加一些标识
// look:   看所有的在线人数
// say:zs: 私聊
// rename: 重命名
//all: 广播

//我们有个对象 clinet  当前的人{127.0.0.1}  当然都是本地的,所以每个人都是这个,但是不可能同一个端口发出两个
//socket  ,假设第一个端口是{127.0.0.1:8080},另一个是8081,并且我们放歌对象,默认匿名,一级当前是哪个sokect
//{127.0.0.1:8080:{nickname:'匿名',socket:socket}}

let net = require('net');
let client = {};
let server = net.createServer(function(socket){
    server.maxConnections = 4;
    server.getConnections(function(err,count){
        socket.write(`当前人数为${count},总容纳数${server.maxConnections}人\r\n`);
        socket.write(`请输入用户名:\r\n`);
    })
    let key = socket.remoteAddress + socket.remotePort; // 远程地址和远程端口号
    console.log(key);
    socket.setEncoding('utf8');
    client[key] = {nickName:'匿名',socket:socket}
    socket.on('data' , function(chunk){
        chunk = chunk.replace(/\r\n/,'');
        let char = chunk.split(':')[0];
        let content = chunk.split(':')[1];
        switch(char){
            case 'look':
                showList(socket);
                break;
            case 'say':
                private(content , chunk.split(':')[2],client[key].nickName);
                break;
            case 'rename':
                rename(key, content);
                break;
            case 'all':
                Broadcast(key , chunk, client[key].nickName)
                break;
        }
        // key = socket.remoteAddress + socket.remotePort 
        // client[key] = {nickName:'匿名',socket:socket}
        function showList(socket){
            let users = [];
            Object.keys(client).forEach(key => {
                users.push(client[key].nickName)
            });
            socket.write(`当前用户列表:\r\n${users.join('\r\n')}\r\n`)
        }
        function rename(key , chunk){
            client[key].nickName = chunk;
        }
        function private(nickName, content , n){
            let s;
            Object.keys(client).forEach(key => {
                if(client[key].nickName === nickName){
                    s = client[key].socket
                }
            });
            s.write(`${n}: ${content}\r\n`)
        }
        function Broadcast(nick , chunk , nickName){
            Object.keys(client).forEach(key => {
                console.log(key,nick)
                if(key != nick){
                    client[key].socket.write(`${nickName}:${chunk}\r\n`)
                }
            });
        }
        r.unref();
    });
})
let port = 3000; 
server.listen(port,function(){
    console.log(`server start ${port}`);
})