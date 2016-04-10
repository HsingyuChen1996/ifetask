window.onload = function() {
    function Queue(que){
        this.queue = que || [];
    }
    Queue.prototype = {
        constructor: Queue,
        push: function (list, value){
            if(this.insertCheck(value)){
                this.queue = this.unique(this.queue.concat(value)); 
                while(this.queue.length > 10){
                    this.shift();
                }
                this.render(list);
            }
        },
        shift: function (value){
            this.queue.shift();
        },
        delete: function (list, value){
            this.queue = this.queue.filter(function (v){
                return v !== value;
            });
            this.render(list);
        },
        unique: function (que) {
            var ret = [],
                hash = {},
                item;
            for (var i = 0, len = que.length; i < len; i++) {
                item = que[i];
                if (hash[item] !== item) { // [1, 3, 5, 3, '5']; 解决此类数组bug
                    ret.push(item);
                    hash[item] = item;
                }
            };
            return ret;
        },
        insertCheck: function (value){
            if(!value){
                alert('无输入');
                return false;
            }
            return true;
        },
        render: function (list){
            var str = '';
            for(var i = 0, len = this.queue.length; i < len; i++){
                str += '<li>' + this.queue[i] + '</li>';
            }
            list.innerHTML = str;
        },
    }
    function addEvent(elem, event, func){
        if(elem.addEventListener){
            elem.addEventListener(event, func, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on'+event, func);
        }
    }
    function trim(str) {
    //\uFEFF是utf8的字节序标记，"\xA0"是全角空格
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
    var tag = new Queue(['标签1', '标签2']);
    var hobby = new Queue(['爱好1', '爱好2']);
    var tagInput = document.getElementById('tag');
    var hobbyInput = document.getElementById('hobby');
    var tagList = document.getElementById('tagList');
    var hobbyList = document.getElementById('hobbyList');
    var confirmHobby = document.getElementById('confirm');
    tag.render(tagList);
    hobby.render(hobbyList);
    addEvent(tagInput, 'keyup', function (e){
        e = e || window.event;
        var keyCode = typeof charCode === 'number' ? e.charCode : e.keyCode;
        if(keyCode === 13 || keyCode === 32 || keyCode === 188){
            var tagValue = tagInput.value.indexOf(',') !== -1 ? tagInput.value.slice(0,-1) : tagInput.value;
            tag.push(tagList, trim(tagValue));
            tagInput.value = '';
        }
    });
    addEvent(tagList, 'mouseover', function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        var tagContent = target.innerHTML;
        if(target.tagName.toLowerCase() === 'li'){
           target.innerHTML = '删除' + tagContent; 
        }
    });
    addEvent(tagList, 'mouseout', function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName.toLowerCase() === 'li'){
           target.innerHTML = target.innerHTML.slice(2); 
        }
    });
    addEvent(tagList, 'click', function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName.toLowerCase() === 'li'){
            tag.delete(tagList, target.innerHTML.slice(2));
        }
    })
    addEvent(confirmHobby, 'click', function (){
        var hobbyValue = trim(hobbyInput.value).split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function (v){ return v !== '';});
        hobby.push(hobbyList, hobbyValue);
    });
};
