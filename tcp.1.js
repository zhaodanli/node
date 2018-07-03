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
let server = net.createServer();

let client = {};
//每次链接服务器 socket每次都会产生新的
server.on('connection',function(socket){ 
    //设置最大连接数
    server.maxConnections = 4;
    server.getConnections(function(err,count){
        socket.write(`当前人数为${count},总容纳数${server.maxConnections}人\r\n`);
        socket.write(`请输入用户名:\r\n`);
    })
    //请求到来的时候执行以下  socket是一个Duplex 双攻流,可读可写
    socket.write("欢迎光临");
    //读流,通过流的方式接收到数据
    socket.setEncoding('utf8');
    //监听输入
    let nickName;
    //存储用户名
    socket.setEncoding('utf8')
    socket.on('data' , function(chunk){
        chunk = chunk.replace(/\r\n/,'');
        if(nickName){
            //把说的内容给别人看
            Broadcast(nickName, chunk)

        }else{
            //chunk自带换行回车
            nickName = chunk;
            client[chunk] = socket;
        }
        //server.close();//关闭自己 如果触发了close事件就不会在接收新的请求了,
        //server.unref(); //表示关闭 没有客户端,所有人都退出,链接会自己关闭,不会触发close事件
    });
    //end  服务端把客户端关掉了,,,
    //socket.end();
})
function Broadcast(nickName, chunk){
   Object.keys(client).forEach(nick => {
       if(nickName != nick){
            client[nick].write(`${nickName}:${chunk}\r\n`)
       }
   });
}
// (端口号,服务器地址默认不写,511(可以接收多少个请求))
//监听成功会自动走回调
let port = 3000; 
server.listen(port,function(){
    console.log(`server start ${port}`);
})

//如果端口被占用,我们重启一个端口号
server.on('error',function(err){
    if(err.code == 'EADDRINUSE'){
        server.listen(++port)
    }
})
server.on('close',function(){
    console.log("服务器关闭")
})
