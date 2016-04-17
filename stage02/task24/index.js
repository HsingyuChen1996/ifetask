function Tree(node){
    this.root = node;
    this.isAnimating = false;
    this.animQueue = [];                        //动画队列
    this.searched = false;
    this.matched = {};                          //搜索匹配值
    this.nodeCached = [];                       //被添加或删除的节点
}
Tree.prototype.bft  = function (animate){  //breadthFirstTraverse 广度优先遍历
    var assistQueue = [];
    var tmpArr = [];
    this.init();
    assistQueue.push(this.root);
    while(assistQueue.length){
        node = assistQueue.shift();
        for(var i = 0, len = node.children.length; i < len; i++){
            assistQueue.push(node.children[i]);
        }
        tmpArr.push(node);
    }
    this.animQueue = tmpArr;
    if(animate){
        this.animate();
    }
};
Tree.prototype.dft = function (animate){  //depthFirstTraverse 深度优先遍历
    var tmpArr = [];
    this.init();
    (function recurse (node){
        tmpArr.push(node);
        if(node.children.length){
            for(var i = 0, len = node.children.length; i < len; i++){
                recurse(node.children[i]);
            }
        }
    })(this.root);
    this.animQueue = tmpArr;
    if(animate){
        this.animate();
    }
};
Tree.prototype.bfs  = function (){  //breadthFirstSearch 广度优先搜索
    var searchValue = trim(document.getElementById('search').value);
    if(searchValue == ''){
        alert('请输入查询字符串');
        return false;
    }
    this.init();
    this.bft(false);
    this.search(searchValue);
};
Tree.prototype.dfs = function (){  //depthFirstSearch 深度优先搜索
    var searchValue = trim(document.getElementById('search').value);
    if(searchValue == ''){
        alert('请输入查询字符串');
        return false;
    }
    this.dft(false);
    this.search(searchValue);
};
Tree.prototype.search = function (value){
    var start = 0;
    var tmpArr =  this.animQueue;
    var resultArr = [];
    this.matched.length = 0;
    this.searched = true;
    for (var i = 0, len = tmpArr.length; i < len; i++) {
        var j = 0;
        while(tmpArr[i].childNodes[j++].nodeType !== 3);
        resultArr[i] = trim(tmpArr[i].childNodes[j - 1].textContent);
    }
    while(resultArr.indexOf(value, start) !== -1){
        this.matched[resultArr.indexOf(value, start)] = true;
        this.matched.length++;
        start = resultArr.indexOf(value, start) + 1;
    }
    this.animate();
}
Tree.prototype.addNode = function (){
    var tmpArr = this.nodeCached;
    if(tmpArr.length === 0){
        alert('请先选择节点');
        return false;
    }
    for(var i = 0 ,len = tmpArr.length; i < len; i++){
        var newNode = document.createElement('div');
        newNode.innerHTML = trim(document.getElementById('node').value);
        tmpArr[i].appendChild(newNode);
    }
}
Tree.prototype.delNode = function (){
    var tmpArr = this.nodeCached;
    if(tmpArr.length === 0){
        alert('请先选择节点');
        return false;
    }
    while(tmpArr.length) {
        var node = tmpArr.shift();
        if(node === this.root){
            alert('根节点就别删了吧');
            removeClass(node, 'selected');
            continue;
        }
        node.parentNode.removeChild(node);
    }
}
Tree.prototype.animate = function (){
    if(this.animQueue.length == 0) return false;
    this.isAnimating = true;
    var arr = this.animQueue,
        matchedObj = this.matched,
        len = arr.length,
        time = parseInt(document.getElementById('time').value, 10) || 200,
        that = this,
        count = 0,
        time;
    time = setInterval(function (){
        if(!that.searched || !matchedObj[Math.max(count - 1, 0)]){
            arr[Math.max(count - 1, 0)].style.backgroundColor = '';
        }else {
            arr[Math.max(count - 1, 0)].style.backgroundColor = '#00f';
        }
        arr[Math.min(count, len - 1)].style.backgroundColor = '#09f';
        count++;
        if(count > len){
            clearInterval(time);
            that.isAnimating = false;
            if(!that.searched || !matchedObj[Math.max(count - 1, 0)]){
                arr[len - 1].style.backgroundColor = '';
            }
            if(that.searched && matchedObj.length === 0){
                alert('没有查询到对应节点');
            }
        }
    }, time);
}
Tree.prototype.init = function (){
    while(this.nodeCached.length) {
        var node = this.nodeCached.shift();
        removeClass(node, 'selected');
    }
    for(var i in this.matched){
        if(i !== 'length'){
            this.animQueue[i].style.backgroundColor = '';
        }
    }
    this.animQueue = [];
    this.matched = {};
    this.searched = false;
}
function addEvent(elem, event, func){
    if(elem.addEventListener){
        elem.addEventListener(event, func, false);
    }else if(elem.attachEvent){
        elem.attachEvent('on'+event, func);
    }
}
function hasClass(element, value) {
    return element.className.indexOf(value) !== -1;
}

function addClass(element, newClassName) {
    if (element.nodeType === 1 && typeof newClassName === 'string') {
        if (!element.className) {
            element.className = newClassName;
        } else if (!hasClass(element, newClassName)) {
            element.className += ' ' + newClassName;
        }
    }
}

function removeClass(element, oldClassName) {
    if (element.nodeType === 1) {
        if (arguments.length === 1) {
            element.className = '';
        } else if (hasClass(element, oldClassName)) {
            var reg = new RegExp('(\\s|^)' + oldClassName + '(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    }
}
function trim(str) {
    //\uFEFF是utf8的字节序标记，"\xA0"是全角空格
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
window.onload = function() {
    var root = document.getElementById('root');
    var tree = new Tree(root);
    var btns = document.getElementsByTagName('button');
    Array.prototype.forEach.call(btns, function (item, index){
        addEvent(item, 'click', function(){
            if(tree.isAnimating){
                alert('动画正在进行，请稍候再进行遍历操作！')
            }else {
                var method = item.getAttribute('data-method');
                tree[method](true);
            }
        });
    });
    addEvent(root, 'click', function (e){
        if(tree.isAnimating){
            alert('动画正在进行，请稍候再进行操作！');
            return false;
        }
        if(tree.animQueue.length){
            tree.init();
        }
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName.toLowerCase() == 'div'){
            toggleState(target, 'selected');
        }
    });
    function toggleState(element, className){
        if(hasClass(element, className)){
            removeClass(element, className);
            tree.nodeCached.splice(tree.nodeCached.indexOf(element), 1);
        }else {
            addClass(element, className);
            tree.nodeCached.push(element);
        }
    }
};
