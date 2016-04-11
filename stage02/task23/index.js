function BinaryTree(node){
    this.root = node;
    this.isAnimating = false;
    this.animQueue = [];
    this.matched = {};
    this.searched = false;
}
BinaryTree.prototype.bft  = function (){  //breadthFirstTraverse 广度优先遍历
    var assistQueue = [];
    assistQueue.push(this.root);
    while(assistQueue.length){
        node = assistQueue.shift();
        for(var i = 0, len = node.children.length; i < len; i++){
            assistQueue.push(node.children[i]);
        }
        this.animQueue.push(node);
    }
};
BinaryTree.prototype.dft = function (node){  //depthFirstTraverse 深度优先遍历
    node = node || this.root;
    this.animQueue.push(node);
    if(node.children.length){
        for(var i = 0, len = node.children.length; i < len; i++){
            this.dft(node.children[i]);
        }
    }
};
BinaryTree.prototype.bfs  = function (){  //breadthFirstSearch 广度优先搜索
    var searchValue = trim(document.getElementById('search').value);
    if(searchValue == ''){
        alert('请输入查询字符串');
        return false;
    }
    this.bft();
    this.search(searchValue);
};
BinaryTree.prototype.dfs = function (){  //depthFirstSearch 深度优先搜索
    var searchValue = trim(document.getElementById('search').value);
    if(searchValue == ''){
        alert('请输入查询字符串');
        return false;
    }
    this.dft();
    this.search(searchValue);
};
BinaryTree.prototype.search = function (value){
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
}
BinaryTree.prototype.animate = function (){
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
            arr[Math.max(count - 1, 0)].style.backgroundColor = '#fff';
        }else {
            arr[Math.max(count - 1, 0)].style.backgroundColor = '#00f';
        }
        arr[Math.min(count, len - 1)].style.backgroundColor = '#09f';
        count++;
        if(count > len){
            clearInterval(time);
            that.isAnimating = false;
            if(!that.searched || !matchedObj[Math.max(count - 1, 0)]){
                arr[len - 1].style.backgroundColor = '#fff';
            }
            if(that.searched && matchedObj.length === 0){
                alert('没有查询到对应节点');
            }
        }
    }, time);
}
BinaryTree.prototype.init = function (){
    for(var i in this.matched){
        if(i !== 'length'){
            this.animQueue[i].style.backgroundColor = '#fff';
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
function trim(str) {
    //\uFEFF是utf8的字节序标记，"\xA0"是全角空格
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
window.onload = function() {
    var root = document.getElementById('root');
    var tree = new BinaryTree(root);
    var btns = document.getElementsByTagName('button');
    Array.prototype.forEach.call(btns, function (item, index){
        addEvent(item, 'click', function(){
            if(tree.isAnimating){
                alert('动画正在进行，请稍候再进行遍历操作！')
            }else {
                var method = item.getAttribute('data-method');
                tree.init();
                tree[method]();
                tree.animate();
            }
        });
    })
};
