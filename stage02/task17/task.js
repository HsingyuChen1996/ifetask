/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}
function getRandomColor(){
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256); 
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ',' + g + ',' + b +')';
}
//事件绑定
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

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
}

function caculateWeek(){
    var weekData = {};
    for(var i in aqiSourceData){
        var day = (new Date('2016-01-01')).getDay();
        var weekAmount  = 91/7 == 0 && day == 1 ? 91/7 : 91/7 + 1;
        var data = [];
        var week = 0;
        weekData[i] = {};
        for(var j = 1; j <= weekAmount; j++){
            weekData[i]['2016年第' + j + '周'] = 0;
            data[j-1] = [0,0];
        }
        for(var k in aqiSourceData[i]){
            data[week][0] += aqiSourceData[i][k];
            data[week][1]++;
            day++;
            if(day == 7) {
                day = 0;
            }else if(day == 1){
                week++;
            }
        }
        console.log(data)
        week = 0;
        for(var m in weekData[i]){
            weekData[i][m] = parseInt(data[week][0]/data[week][1], 10);
            week++;
        }
    }
    return weekData;
}

function caculateMonth(){
    var monthData = {};
    for(var i in aqiSourceData){
        var monthDay = [31, 29, 31],
            data = [0, 0, 0],
            day = 0,
            month = 0;
        monthData[i] = {
            '2016-01': 0,
            '2016-02': 0,
            '2016-03': 0
        };
        for(var k in aqiSourceData[i]){
            data[month] += aqiSourceData[i][k];
            if(day++ == monthDay[month]){
                day = 0;
                month++;
            }
        }
        month = 0;
        for(var m in monthData[i]){
            monthData[i][m] = parseInt(data[month]/monthDay[month], 10);
            month++;
        }
    }
    return monthData;
}
/**
 * 渲染图表
 */
function renderChart() {
    var weatherData = chartData[pageState['nowGraTime']][pageState['nowSelectCity']];
    var chart = document.getElementById('aqi-chart');
    var chartWidth = parseInt(chart.getBoundingClientRect().width);
    var divide = {
        "day": 200,
        "week": 20,
        "month": 5,
    }
    var lis = '';
    for(var i in weatherData){
        lis += '<li style="height:' + weatherData[i] + 'px; width:' + chartWidth/divide[pageState.nowGraTime] + 'px; background-color:' + getRandomColor() + ';" title="日期：' + i + '&nbsp;空气质量：' + weatherData[i] + '"></li>';
    }
    chart.innerHTML = lis;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    var timeValue = this.value;
    pageState.nowGraTime = timeValue;
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    // 设置对应数据
    // 调用图表渲染函数
    var cityValue = this.value;
    pageState.nowSelectCity = cityValue;
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var graTime = document.getElementById('form-gra-time');
    var inputs = document.getElementsByName('gra-time');
    for(var i = 0, len = inputs.length; i < inputs.length; i++){
        if(inputs[i].checked == true){
            pageState.nowGraTime = inputs[i].value;
        }
    }
    delegateEvent(graTime, 'input', 'change', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    var citySelect = document.getElementById('city-select');
    for(var i in aqiSourceData){
        var option = new Option(i,i);
        citySelect.add(option,undefined);
    }
    pageState.nowSelectCity = citySelect.value;
    addEvent(citySelect, 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    chartData.day = aqiSourceData;
    chartData.week = caculateWeek();
    chartData.month = caculateMonth();
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}
window.onload = init;
