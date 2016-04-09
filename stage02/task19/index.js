window.onload = function() {
    function Queue(que){
        var queue = que || []; //队列，私有变量
        var color = [];        //不同级别数字的颜色，私有变量
        this.state = 0;        //0 表示没有执行动画， 1表示动画正在进行  
        //左侧入
        this.unshift = function (value){
            if(this.insertCheck(value)){
                queue.unshift(value);
                this.render();
            }
        };
        //右侧入
        this.push = function (value){
            if(this.insertCheck(value)){
                queue.push(value); 
                this.render();
            }
        };
        //左侧出
        this.shift = function (value){
            if(this.removeCheck()){
                alert(queue.shift());
                this.render();
            }
        };
        //右侧出
        this.pop = function (value){
            if(this.removeCheck()){
                alert(queue.pop());
                this.render();
            }
        };
        //实现冒泡排序，以后可能会实现多种排序算法，这个函数可以拓展
        this.bubbleSort = function (){
            var len = queue.length,
                tmpNum,
                that = this,
                animSequence = [],
                start = 0,
                animation,
                btns = document.getElementsByTagName('button');
            for(var i = 0; i < len; i++){
                for (var j = i; j < len; j++) {
                    if(queue[i] > queue[j]){
                        tmp = queue[i];
                        queue[i] = queue[j];
                        queue[j] = tmp;
                        var tmpQueue = [];
                        for (var k = 0; k < len; k++) {
                            tmpQueue[k] = queue[k];
                        }
                        animSequence.push(tmpQueue);
                    } 
                }
            }
            this.state = 1;
            animation = setInterval(function (){
                that.render(animSequence[start++]);
                if(start >= animSequence.length){
                    clearInterval(animation);
                    that.state = 0;
                }
            },20);
        };
        //随机生成45个数字
        this.random = function (){
            queue.length =0;
            for(var i = 0; i < 45; i++){
                queue[i] = 10 + Math.round(Math.random() * 90);
            }
            this.render();
        };
        //入队检查
        this.insertCheck = function (value){
            if(queue.length == 60){
                alert('元素数量最多限制为60个');
                return false
            }else if(Object.prototype.toString.call(value) !== '[object Number]'){
                alert('请输入数字');
                return false;
            }else if(value < 10 || value > 100){
                alert('限制输入的数字在10-100');
                return false;
            }else if(!value){
                alert('无输入');
                return false;
            }
            return true;
        };
        //出队检查
        this.removeCheck = function (value){
            if(queue.length === 0){
                alert('队列里已经没有数字了');
                return false;
            }
            return true;
        };
        //随机颜色
        this.getRandomColor = function(){
            var r = Math.floor(Math.random() * 248);
            var g = Math.floor(Math.random() * 248); 
            var b = Math.floor(Math.random() * 248); //不要太淡的颜色
            return 'rgb(' + r + ',' + g + ',' + b +')';
        };
        //渲染队列
        this.render = function(que){
            que = que || queue;
            var queueList = document.getElementById('queue');
            var lis = '';
            for(var i = 0, len = queue.length; i < len; i++){
                lis += '<li style="background-color: ' + color[Math.round(que[i]/10)-1] + '; height:' + que[i] * 5 + 'px"></li>';
            }
            queueList.innerHTML = lis;
        };
        //初始化队列
        this.init = function (){
            for (var i = 0; i < 10; i++) {
                color[i] = this.getRandomColor();
            }
            this.random();
        }
    }
    //事件绑定
    function addEvent(elem, event, func){
        if(elem.addEventListener){
            elem.addEventListener(event, func, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on'+event, func);
        }
    }
    var btns = document.getElementsByTagName('button');
    var que = new Queue();
    que.init();
    //button事件统一处理
    Array.prototype.forEach.call(btns, function (item, index){
        addEvent(item, 'click', function(){
            if(que.state == 1) { 
                alert('动画正在进行，请不要进行点击操作！');
                return false;
            }
            var method = item.getAttribute('data-method');
            if(method == 'unshift' || method == 'push'){
                que[method](parseInt(document.getElementById('num').value, 10));
            }else {
                que[method]();
            }
        });
    })
};
