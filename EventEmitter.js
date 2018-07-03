function EventEmitter(){
    this._events = {}
}
//this._events = {one:[cry],two:[drink]}
EventEmitter.prototype.prependListener = function(type,callback){
    this.on(type,callback,true)
}
EventEmitter.prototype.prependOnceListener = function(type,callback){
    this.once(type,callback,true)
}
EventEmitter.prototype.eventNames = function(){
    return Object.keys(this._events)
}
EventEmitter.prototype.listeners = function(type){
    return this._events[type]
}

EventEmitter.defaultMaxListeners = 10; //默认最大监听数
EventEmitter.prototype.setMaxListeners = function(count){
    this._count = count;
}
EventEmitter.prototype.getMaxListeners = function(){
    return  this._count || EventEmitter.defaultMaxListeners
}

EventEmitter.addListener = EventEmitter.prototype.on = function(type,callback,flag){
    //如果实例不存在则会创建一个空对象
    if(!this._events)  this._events = Object.create(null) //继承会找不到event ,直接实例可以, Cannot read property 'one' of undefined 初始化this._events
    // this._events ={}  和 this._events = Object.create(null) 的区别 前者原型指针指向object链,后者没有任何属性,后者可以避免第三方继承
    //如果当前不是newListenernewListener方法就需要让newListener回调一次执行,传入类
    if(this.newListener && this._events['newListener'] && this._events['newListener'].length>0){
        if(type != 'newListener'){
            this._events['newListener'].forEach(fn => fn(type))
        }
    }
    if(this._events[type]){ // 查看事件名称是否存在
        if(flag){
            this._events[type].unshift(callback)
        }else{
            this._events[type].push(callback)
        }
    }else{
        this._events[type] = [callback] //将事件绑定在对象上
    }
    if(this._events[type].length === this.getMaxListeners()){
        console.warn('memeoy link detected')
    }
}

EventEmitter.prototype.emit = function(type , ...args){
    if(this._events[type]){
        this._events[type].forEach(fn => fn(...args));
    }else{
        this._events = {}
    }
}
//找到数组里的方法对应的移除掉即可
EventEmitter.prototype.removeListener = function(type,callback){
    if (typeof callback !== 'function')  throw new TypeError('"callback" argument must be a function');
    if(this._events[type]){
        // filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素。
        //this._events[type] = this._events[type].filter(fn =>{
        //     return fn != callback && fn.l != callback
        // })
        //一次只删除一个,不是删除所有相同的type,应该用下面方法
        for(let i = 0;i < this._events[type].length;i++){
            if(this._events[type][i] == callback || this._events[type][i].l == callback ){
                this._events[type].splice[i]
                break;
            }
        }
        //不考虑warp同上效果
        //this._events[type].splice(this._events[type].indexOf(callback) ,1)
    }
}
EventEmitter.prototype.removeAllListeners = function(type){
    if(this._events[type]){
        return this._events[type] = Obj.create(null)
    }else{

    }
}
EventEmitter.prototype.once = function (type,callback,flag){
    //当emit时warp执行需要继续将参数传递给callback
    let warp = (...args) =>{
        callback(...args);
        this.removeListener(type,warp) //用on绑定的时候,在emit的时候执行wap
    }
    warp.l = callback;//将callback方法挂在到warp属性上
    this.on(type,warp,flag);
}

module.exports = EventEmitter;