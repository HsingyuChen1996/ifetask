function BinaryTree(root){
    this.root = root;
    this.isAnimating = false;
    this.animQueue = [];
}
BinaryTree.prototype.preOrder = function (node){
    node = node || this.root;
    this.animQueue.push(node);
    if(node.firstElementChild){
        this.preOrder(node.firstElementChild);
    }
    if(node.lastElementChild){
        this.preOrder(node.lastElementChild);
    }
};
BinaryTree.prototype.inOrder = function (node){
    node = node || this.root;
    if(node.firstElementChild){
        this.inOrder(node.firstElementChild);
    }
    this.animQueue.push(node);
    if(node.lastElementChild){
        this.inOrder(node.lastElementChild);
    }
};
BinaryTree.prototype.postOrder = function (node){
    node = node || this.root;
    if(node.firstElementChild){
        this.postOrder(node.firstElementChild);
    }
    if(node.lastElementChild){
        this.postOrder(node.lastElementChild);
    }
    this.animQueue.push(node);
};
BinaryTree.prototype.animate = function (){
    this.isAnimating = true;
    var arr = this.animQueue,
        len = arr.length,
        time = parseInt(document.getElementById('time').value, 10) || 200,
        that = this,
        count = 0,
        time;
    time= setInterval(function (){
        arr[Math.max(count - 1, 0)].style.backgroundColor = '#fff';
        arr[Math.min(count, len - 1)].style.backgroundColor = '#09f';
        count++;
        if(count > arr.length){
            clearInterval(time);
            that.animQueue = [];
            arr[len - 1].style.backgroundColor = '#fff';
            that.isAnimating = false;
        }
    }, time);
}
function addEvent(elem, event, func){
    if(elem.addEventListener){
        elem.addEventListener(event, func, false);
    }else if(elem.attachEvent){
        elem.attachEvent('on'+event, func);
    }
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
                tree[method]();
                tree.animate();
            }
        });
    })
};
