window.onload = function() {
    function Queue(que){
        var queue = que || [];
        var matched = [];
        this.unshift = function (value){
            if(this.insertCheck(value)){
                value = value.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function (v){
                    return v !== '';
                });
                queue = value.concat(queue);
                this.render();
            }
        };
        this.push = function (value){
            if(this.insertCheck(value)){
                value = value.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function (v){
                    return v !== '';
                });
                queue = queue.concat(value); 
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
        this.search = function (){
            var searchStr = document.getElementById('search').value;
            if(!searchStr){
                alert('输入为空！');
                return false;
            }
            for (var i = 0, len = queue.length; i < len; i++) {
                if(queue[i].indexOf(searchStr) !== -1){
                    matched[i] = 1;
                }else {
                    matched[i] = 0;
                };
            }
            this.render();
        }
        this.insertCheck = function (value){
            if(!value){
                alert('无输入');
                return false;
            }
            return true;
        };
        this.removeCheck = function (value){
            if(queue.length === 0){
                alert('队列已空');
                return false;
            }
            return true;
        };
        this.render = function(){
            var queueList = document.getElementById('queue');
            var lis = '';
            for(var i = 0, len = queue.length; i < len; i++){
                lis += '<li ' + (matched[i] ? 'class="matched"': '') + '>' + queue[i] + '</li>';
            }
            matched = [];
            queueList.innerHTML = lis;
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
    var que = new Queue(['1', '2', '3', '4', '5']);
    que.render();
    Array.prototype.forEach.call(btn, function (item, index){
        addEvent(item, 'click', function(){
            var method = item.getAttribute('data-method');
            if(method == 'unshift' || method == 'push'){
                var text = document.getElementById('input').value;
                que[method](text);
            }else {
                que[method]();
            }
        });
    })
};
