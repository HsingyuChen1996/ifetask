var spaceships = {},
    CANVAS_WIDTH = 900,
    CANVAS_HEIGHT = 600,
    EARTH_DIAMETER = 200,
    SPACESHIP_WIDTH = 30,
    SPACESHIP_HEIGHT = SPACESHIP_WIDTH * 2.116,
    SPACESHIP_SPEED = 1,
    FONT_HEIGHT = 15,
    ORBIT_AMOUNT = 4,
    ORBIT_SPACING = 45,
    FAILURE_RATE = 0.3,
    CHARGE_RATE = 1, //飞船充电速度
    CONSUME_RATE = 2, //飞船放电速度
    POWERBAR_POS_OFFSET = 5, //电量条位置位移
    POWERBAR_COLOR_GOOD = "#0f0", //电量良好状态颜色
    POWERBAR_COLOR_MEDIUM = "#ff0", //电量一般状态颜色
    POWERBAR_COLOR_BAD = "#f00"; //电量差状态颜色
    POWERBAR_HEIGHT = 15,
    POWERBAR_WIDTH = 40;

window.requestAnimFrame=(function(){
    return window.requestAnimationFrame||
           window.webkitRequestAnimationFrame||
           window.mozRequestAnimationFrame||
           window.oRequestAnimationFrame||
           window.msRequestAnimationFrame||
           function(/*function*/callback,/*DOMElement*/element){
                window.setTimeout(callback,1000/60);
           };
})();

//采用中介者模式
var Mediator = (function () {
    var send = function (params){
        var method = params.command;
        var orbit = params.orbit;
        ConsoleUtil.add('飞船' + orbit + method);
        return (spaceships[orbit] == null ? (spaceships[orbit] = new Spaceship(orbit)) : spaceships[orbit])[method]();     
    }
    return {
        // register: function (params){
        //     var command = params.command;
        //     var orbit = params.orbit;
        //     if(spaceship[orbit]){
        //         stack[orbit] = [];
        //         stack.push(command);
        //     }
        // },
        send: send 
    }
})();

function Commander() {
    this.name = 'cz';
    this.cmds = [];
};

Commander.prototype.send = function (orbit, method){
    this.cmds.push({
        command : method, 
        orbit: orbit
    });
    Mediator.send({
        command : method, 
        orbit: orbit
    });
};

function Spaceship(orbit){
    this.orbit = orbit; //飞船所在轨道，初始飞船不存在，设置为-1；
    this.power = 100;
    this.state = 'hide'; // hide, launch, stop
    this.deg = 0;
    this.timer = null;
}

Spaceship.prototype = (function (){
    //飞船控制系统
    var controlSystem = (function (){
        var create = function (){
            if(this.state !== 'hide'){
                alert('飞船' + this.orbit + '已被创建');
                return;
            }
            this.state = 'stop';
        }

        var launch = function (){
            if(this.state === 'stop'){
                this.state = 'launch';
                this.consume();
            }else if(this.state === 'launch'){
                alert('飞船' + this.orbit + '正在飞行');
            }else{
                alert('飞船' + this.orbit + '还未创建');
            }
        }

        var stop = function (){
            if(this.state === 'launch'){
                this.state = 'stop';
                this.charge();
            }else if(this.state === 'stop'){
                alert('飞船' + this.orbit + '已经停止');
            }else{
                alert('飞船' + this.orbit + '还未创建');
            }
        }

        var destroy = function (){
            if(this.state === 'hide'){
                alert('飞船' + this.orbit + '还未创建')
            } else {
                this.power = 100;
                this.state = 'hide';
                this.deg = 0;
            }
        }

        return {
            create: create,
            launch: launch,
            stop: stop,
            destroy: destroy
        }
    })();
    //飞船能源系统
    var powerSystem = (function (){
        var charge = function (){           
            var that = this;
            clearInterval(that.timer);
            that.timer = setInterval(function(){
                that.power += CHARGE_RATE;
                if(that.power >= 100){
                    clearInterval(that.timer);
                    that.power = 100;
                }
            },100);
        }
        
        var consume = function (){
            var that = this;
            clearInterval(that.timer);
            that.timer = setInterval(function(){
                that.power -= CONSUME_RATE;
                if(that.power <= 0){
                    clearInterval(that.timer);
                    that.state = 'stop';
                    that.power = 0;
                    that.charge();
                }
            },100);
        }

        return {
            charge: charge,
            consume: consume
        }
    })();
    //飞船
    return {
        constructor: Spaceship,
        create: controlSystem.create,
        launch: controlSystem.launch,
        stop: controlSystem.stop,
        destroy: controlSystem.destroy,
        charge: powerSystem.charge,
        consume: powerSystem.consume
    }
})();

var AnimateUtil = (function (){
    var earth = new Image(),
        spaceship = new Image(),
        universe = document.getElementById('canvas'),
        context = universe.getContext('2d');

    //加载图片
    (function (){
        earth.src = 'earth.png';
        spaceship.src = 'spaceship.png';
        spaceship.onload = function (){
            spaceship.complete = true;
        }
        earth.onload = function (){
            earth.complete = true;
        }
        context.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    })();

    var drawOrbit = function (){
        context.strokeStyle = "#333";
        for (var i = 0; i < ORBIT_AMOUNT; i++) {
            context.beginPath();
            context.arc(0, 0, EARTH_DIAMETER/2 + ORBIT_SPACING * (i + 1), 0, 2 * Math.PI);
            context.stroke();
        }
    };

    var drawBackground = function (){
        context.beginPath();
        context.clearRect(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(earth, -EARTH_DIAMETER/2, -EARTH_DIAMETER/2, EARTH_DIAMETER, EARTH_DIAMETER);
        drawOrbit();
    }

    var drawSpaceship = function (){
        if(!spaceship.complete){
            drawSpaceship(position);
        }
        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillStyle = "#000";
        switch (this.state){
            case 'stop':
                context.save();
                context.rotate(this.deg * Math.PI/180);
                context.drawImage(spaceship, (EARTH_DIAMETER - SPACESHIP_WIDTH)/2 + this.orbit * ORBIT_SPACING, -SPACESHIP_HEIGHT/2, SPACESHIP_WIDTH, SPACESHIP_HEIGHT);
                // context.fillStyle = 'green';
                // context.fillRect((EARTH_DIAMETER - POWERBAR_WIDTH)/2 + this.orbit*ORBIT_SPACING, -SPACESHIP_HEIGHT/2 - POWERBAR_HEIGHT - POWERBAR_POS_OFFSET, POWERBAR_WIDTH, POWERBAR_HEIGHT);
                context.fillText(this.power + "%", EARTH_DIAMETER/2 + this.orbit * ORBIT_SPACING, -SPACESHIP_HEIGHT/2 - POWERBAR_HEIGHT/2);
                context.restore();
                break;
            case 'launch':
                context.save();
                context.rotate(this.deg * Math.PI/180);
                context.drawImage(spaceship, (EARTH_DIAMETER - SPACESHIP_WIDTH)/2 + this.orbit * ORBIT_SPACING, -SPACESHIP_HEIGHT/2, SPACESHIP_WIDTH, SPACESHIP_HEIGHT);
                // context.fillStyle = 'green';
                // context.fillRect((EARTH_DIAMETER - POWERBAR_WIDTH)/2 + this.orbit*ORBIT_SPACING, -SPACESHIP_HEIGHT/2 - POWERBAR_HEIGHT - POWERBAR_POS_OFFSET, POWERBAR_WIDTH, POWERBAR_HEIGHT);
                context.fillText(this.power + "%", EARTH_DIAMETER/2 + this.orbit * ORBIT_SPACING, -SPACESHIP_HEIGHT/2 - POWERBAR_HEIGHT/2);
                context.restore();
                this.deg -= SPACESHIP_SPEED;
                break;
            case 'hide':
            default: break;
        }
    };

    var loop = function (){
        drawBackground();
        for (var i in spaceships) {
            drawSpaceship.call(spaceships[i]);
        }
    }

    var start = function (){
        loop();
        requestAnimFrame(start);
    }
    return {
        start: start
    };
})();

var ConsoleUtil = (function (){
    var consoleLog = document.getElementById('console');
    var add = function (msg){
        var p = document.createElement('p');
        p.innerHTML = msg;
        consoleLog.appendChild(p);
    }
    return {
        add: add
    }
})();

var buttonHandler = function (commander){
    function addEvent(elem, event, func){
        if(elem.addEventListener){
            elem.addEventListener(event, func, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on'+event, func);
        }
    }
    var command = document.getElementById('command');
    addEvent(command, 'click', function (e){
        e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName.toLowerCase() === 'button'){
            var method = target.getAttribute('data-method');
            var orbit = target.parentNode.getAttribute('data-orbit');
            commander.send(orbit, method);
        }
    });
}

window.onload = function (){
    var commander = new Commander();
    buttonHandler(commander);
    // Mediator.register();
    AnimateUtil.start();
};
