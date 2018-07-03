//node实现tcp协议  给我们提供了一个包 net模块
//tcp 交互也要有服务端和客户端
//客户端: 可以通过任意一个端口号给服务发请求
//服务端:接受并且响应
let net = require('net');

//创建服务端
//socket套接字 会话,http有请求和响应
// let server = net.createServer(function(socket){
//     //请求到来的时候执行以下
//     console.log('客户端链接了服务端');
    
// })
//等同于
let server = net.createServer();
server.on('connection',function(socket){
    //请求到来的时候执行以下
    socket.write("欢迎光临");
    socket.setEncoding('utf8')
    socket.on('data' , function(data){
        console.log(data)
        //server.close();//关闭自己 如果触发了close事件就不会在触发新的请求了
        //server.unref(); //表示关闭 没有客户端链接会自己关闭,不会触发close事件
    });
    //socket.end();
})
// (端口号,服务器地址默认不写,511(可以接收多少个请求))
//监听成功会自动走回调
let port = 3000; 
server.listen(port,function(){
    console.log(`server start ${port}`);
})


server.on('error',function(err){
    if(err.code == 'EADDRINUSE'){
        server.listen(++port)
    }
})
//设置最大连接数
server.maxConnections = 2;
server.on('close',function(){
    console.log("服务器关闭")
})
