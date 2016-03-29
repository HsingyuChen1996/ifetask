var aqiData = {};
//去除空格
function trim(str) {
    //\uFEFF是utf8的字节序标记，"\xA0"是全角空格
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
//类型检查
function type(obj) {
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
        allType[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}
//绑定事件
function addEvent(elem, event, func){
    if(elem.addEventListener){
        elem.addEventListener(event, func, false);
    }else if(elem.attachEvent){
        elem.attachEvent('on'+event, func);
    }
}
//事件代理
function delegateEvent(element, tag, eventName, listener) {
    var fn = (function (){
        return function (event){
            event = event || window.event;
            var target = event.target || event.srcElement;
            if(target.tagName.toLowerCase() === tag.toLowerCase()){
                return listener.call(target);
            }
        }
    })();
    addEvent(element, eventName, fn);
}

function addAqiData() {
    var city = trim(document.getElementById('aqi-city-input').value);
    var quality = parseInt(trim(document.getElementById('aqi-value-input').value), 10);
    console.log(city);
    console.log(quality); 
    if(!city || !quality){
        alert('不能为空');
        return false;
    }else if(type(quality) !== 'number'){
        alert('空气质量必须为数字');
        return false;
    }else{
        aqiData[city] = quality;
        return true;
    }
}
/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = document.getElementById('aqi-table');
    var tableStr = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
    for(var i in aqiData){
        tableStr += '<tr data-city='+ i +'><td>' + i + '</td><td>' + aqiData[i] + '</td><td><button>删除</button></td>';
    }
    table.innerHTML = tableStr;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    if(addAqiData()){
        renderAqiList();
    }
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    var city = this.parentNode.parentNode.getAttribute('data-city');
    delete aqiData[city];
    renderAqiList();
}

function init() {
    var addBtn = document.getElementById('add-btn'); 
    var table = document.getElementById('aqi-table');
    addEvent(addBtn, 'click', addBtnHandle);
    delegateEvent(table, 'button', 'click', delBtnHandle);
}
window.onload = function (){
    init();
}
