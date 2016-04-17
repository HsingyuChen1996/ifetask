function FileManager(node){
    this.root = node;
    this.stack = [];
    this.matched = {};                          //搜索匹配值
    this.init =  function (){
        if(this.matched.length > 0){
            for(var i in this.matched){
                if(hasClass(this.stack[i], 'folder')){
                    removeClass(this.stack[i].getElementsByTagName('div')[0], 'searched');
                }else {
                    removeClass(this.stack[i], 'searched');
                }
                if(this.stack[i].parentNode && this.stack[i].parentNode.parentNode){
                    removeClass(this.stack[i].parentNode.parentNode, 'active');
                }
            }
        }
        this.stack = [];
        this.matched = {};
    };
}

FileManager.prototype = {
    constructor: FileManager,
    addFolder: function (){
        var msg;
        if(msg = prompt('请输入文件夹的名称')){
            msg = trim(msg);
            var folder = document.createElement('li');
            var div = document.createElement('div');
            var folderSub = document.createElement('ul');
            folder.className = 'folder';
            div.className = 'folder-item';
            div.innerHTML = msg;
            folderSub.className ='folder-sub';
            folder.appendChild(div);
            folder.appendChild(folderSub);
            var parent = this.parentNode.parentNode.parentNode;
            if(hasClass(parent, 'root')){
                parent.appendChild(folder);
            }else {
                parent.getElementsByTagName('ul')[0].appendChild(folder);
            }
        }else {
            alert('添加失败')
        }
    },
    addFile: function (){
        var msg;
        if(msg = prompt('请输入文件的名称')){
            msg = trim(msg);
            var file = document.createElement('li');
            file.className = 'file';
            file.innerHTML = msg;
            var parent = this.parentNode.parentNode.parentNode;
            if(parent === this.root){
                parent.parentNode.appendChild(file);
            }else {
                parent.getElementsByTagName('ul')[0].appendChild(file);
            }
        }else {
            alert('添加失败');
        }
    },
    delFolder: function (){
        if(hasClass(this.parentNode.parentNode.parentNode, 'root')){
            return alert('这个不让删！')
        }
        if(confirm('确认删除这个文件夹吗？')){
                this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode);
        }
    },
    delFile: function (){
        if(confirm('确认删除这个文件吗？')){
            this.parentNode.parentNode.removeChild(this.parentNode);
        }
    },
    search: function (){
        var searchValue = trim(document.getElementById('search').value);
        if(searchValue === ''){
            alert('请输入查询字符串');
            return false;
        }
        this.init();
        var stack = [];
        var textStack = [];
        var tmpArr = [];
        var start = 0;
        tmpArr.push(this.root);
        while(tmpArr.length){
            var node = tmpArr.shift();
            for(var i = 0, len = node.children.length; i < len; i++){
                tmpArr.push(node.children[i]);
            }
            if(node.tagName.toLowerCase() === 'li'){
                stack.push(node);
                if(hasClass(node, 'folder')){
                    textStack.push(node.getElementsByTagName('div')[0].firstChild.nodeValue);
                }else {
                    textStack.push(node.firstChild.nodeValue);
                }
            }
        }
        this.stack = stack;
        this.matched.length = 0;
        while(textStack.indexOf(searchValue, start) !== -1){
            this.matched[textStack.indexOf(searchValue, start)] = true;
            this.matched.length++;
            start = textStack.indexOf(searchValue, start) + 1;
        }
        if(this.matched.length === 0){
            return alert('没有查询到相应文件或文件夹');
        }
        for(var i in this.matched){
            if(hasClass(stack[i], 'folder')){
                addClass(stack[i].getElementsByTagName('div')[0], 'searched');
            }else {
                addClass(stack[i], 'searched');
            }
            if(stack[i].parentNode && stack[i].parentNode.parentNode){
                addClass(stack[i].parentNode.parentNode, 'active');
            }
        }
    }
}

function addEvent(elem, event, func){
    if(elem.addEventListener){
        elem.addEventListener(event, func, false);
    }else if(elem.attachEvent){
        elem.attachEvent('on'+event, func);
    }
}
function hasClass(element, value) {
    return element.className ? element.className.indexOf(value) !== -1 : false;
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
function toggleClass(element, className) {
    if(hasClass(element, className)){
        removeClass(element, className);
    }else {
        addClass(element, className);
    }
}

function trim(str) {
    //\uFEFF是utf8的字节序标记，"\xA0"是全角空格
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
window.onload = function() {
    var root = document.querySelector('.root');
    var fileManager = new FileManager(root);
    var searchbtn = document.getElementById('bfs');
    var folderFragment = createFolderFragment();
    var fileFragment = createFileFragment();
    addEvent(root, 'click', function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;

        if(hasClass(target,'folder-item')){
            toggleClass(target.parentNode, 'active');
        }else if(target.tagName.toLowerCase() == 'li' && hasClass(target,'folder')){
            toggleClass(target, 'active');
        }
    });
    addEvent(root, 'mouseover', function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(hasClass(target, 'folder-item') || hasClass(target,'root-name')){
            target.appendChild(folderFragment);
        }else if(hasClass(target, 'file')){
            target.appendChild(fileFragment);
        }
    });
    addEvent(searchbtn, 'click', function () {
        fileManager.search();
    });
    function createFileFragment(){
        var fragment = document.createElement('a');
        var text = document.createTextNode('删除');
        fragment.setAttribute('id', 'delFile');
        fragment.appendChild(text);
        addEvent(fragment, 'click', fileManager['delFile']);
        return fragment;
    }
    function createFolderFragment(){
        var fragment = document.createElement('span');
        var content = ['添加文件夹', '添加文件', '删除'];
        var contentId = ['addFolder', 'addFile', 'delFolder'];
        for (var i = 0, len = content.length; i < len; i++) {
            var span = document.createElement('a');
            var text = document.createTextNode(content[i]);
            span.setAttribute('id', contentId[i]);
            span.appendChild(text);
            fragment.appendChild(span);
            addEvent(span, 'click', fileManager[contentId[i]]);
            addEvent(span, 'click', function (){
                fileManager.init();
            });
        }
        return fragment;
    }
};
