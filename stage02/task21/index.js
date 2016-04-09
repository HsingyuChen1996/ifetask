window.onload = function() {
    function Queue(que){
        var queue = que;
        this.unshift = function (value){
            if(this.insertCheck(value)){
                queue.unshift(value);
                this.render();
            }
        };
        this.push = function (value){
            if(this.insertCheck(value)){
                queue.push(value); 
                this.render();
            }
        };
        this.shift = function (value){
            if(this.removeCheck()){
                alert(queue.shift());
                this.render();
            }
        };
        this.pop = function (value){
            if(this.removeCheck()){
                alert(queue.pop());
                this.render();
            }
        };
        this.insertCheck = function (value){
            if(Object.prototype.toString.call(value) !== '[object Number]'){
                alert('请输入数字');
                return false;
            }else if(!value){
                alert('无输入');
                return false;
            }
            return true;
        };
        this.removeCheck = function (value){
            if(queue.length === 0){
                alert('队列里已经没有数字了');
                return false;
            }
            return true;
        };
        this.render = function(que){
            que = que || queue[i];
            var sequenceList = document.getElementById('sequence');
            var lis = '';
            for(var i = 0, len = queue.length; i < len; i++){
                lis += '<li>' + queue[i] + '</li>';
            }
            sequenceList.innerHTML = lis;
        };
    }
    function addEvent(elem, event, func){
        if(elem.addEventListener){
            elem.addEventListener(event, func, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on'+event, func);
        }
    }
    var btn = document.getElementsByTagName('button');
    var que = new Queue([1, 2, 3, 4, 5]);
    que.render();
    Array.prototype.forEach.call(btn, function (item, index){
        addEvent(item, 'click', function(){
            var method = item.getAttribute('data-method');
            if(method == 'unshift' || method == 'push'){
                que[method](parseInt(document.getElementById('num').value, 10));
            }else {
                que[method]();
            }
        });
    })
};
