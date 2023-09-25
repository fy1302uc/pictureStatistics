
//获取元素
var shoot = document.querySelector(".shoot");
var container = document.querySelector(".shoot>.watermarkCamera");
var video = document.querySelector(".shoot>.watermarkCamera>video");
var canvas = document.querySelector(".shoot>canvas");
var camera = document.querySelector(".shoot>.watermarkCamera>.camera");
var changer = document.querySelector(".shoot>.watermarkCamera>.camera>.changer");
var point = document.querySelector(".shoot>.watermarkCamera>.camera>.changer>.point");
var floatingLabel = document.querySelector(".shoot>#floating");
var systemCamera = document.querySelector(".shoot>.systemCamera");
var image = document.querySelector(".shoot>.systemCamera>img");
var input = document.querySelector(".selector>#opencamera");
var saveImage = document.querySelector(".selector>.saveImage");
const watermark = document.querySelector(".selector>.watermark");


//var label =document.querySelector(".selector>label");
var context = canvas.getContext('2d');
var width = 1000;//水印相机拾取分辨率
var height = 1000;
var textColor = ['black', "white", "red", "green", "blue"];//标签设置文本长按颜色变换
var floatingLabelFontSize = floatingLabel.clientHeight;//获取标签文本的像素值
var sharp = 0.2;//设置下载图片清晰度
var videoMode = false;//设置红点是否显示及处于何种模式

// image.align="middle";
//添加浮动的标签文本被长按事件(改变颜色用)
floatingLabel.addEventListener("touchstart", function (event) {
    this.timer = setTimeout(() => {//被长按事件
        this.style.color = textColor[this.timer % textColor.length];//长按改变颜色
        //this.timer%2?this.style.color = "white":this.style.color = "black";
        this.timer = 0;
    }, 500);
});
floatingLabel.addEventListener("touchmove", function (event) {
    clearTimeout(this.timer);
});
floatingLabel.addEventListener("touchend", function (event) {
    clearTimeout(this.timer);
});

/* 添加触摸移动文本位置事件 */
let distance = (p1, p2) => {//计算两触点距离
    //return Math.sqrt(Math.pow(p2.clientX-p1.clientX,2)+Math.pow(p2.clientY-p1.clientY,2));
    return Math.sqrt((p2.clientX - p1.clientX) * (p2.clientX - p1.clientX) + (p2.clientY - p1.clientY) * (p2.clientY - p1.clientY)) / 3;
}

shoot.addEventListener("touchstart", function (ev) {
    /* 实现双击效果 */
    this.count++;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        if (this.count == 2 && !ev.touches[1]) {//双击功能实现
            floatingLabel.innerText = prompt("请输入水印文本", floatingLabel.innerText) || floatingLabel.innerText;
            floatingLabel.style.top = 0;
            floatingLabel.style.left = 0;
        }
        this.count = 0;
    }, 200);

    /* 实现缩放及移动标签前置工作 */
    ev = ev || event;
    this.dist = ev.touches[1] ? distance(ev.touches[0], ev.touches[1]) : 0;//保存文本缩放前两指距离
    this.pointstart = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };//实现标签移动前保存手指开始数据
    if (!this.pointend) this.pointend = { x: 0, y: 0 }; this.pointmove = this.pointstart;//处理开始为空报错及未移动报错(手指快速按下并抬起)
});

shoot.addEventListener("touchmove", function (ev) {
    ev = ev || event;
    /* 实现移动标签功能 */
    this.pointmove = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    floatingLabel.style.top = this.pointmove.y - this.pointstart.y + this.pointend.y + "px";
    floatingLabel.style.left = this.pointmove.x - this.pointstart.x + this.pointend.x + "px";

    /* 实现手指缩放标签 */
    floatingLabelFontSize = floatingLabelFontSize + (this.dist ? distance(ev.touches[0], ev.touches[1]) - this.dist : 0);//手指缩放调整文本大小
    this.dist = this.dist ? distance(ev.touches[0], ev.touches[1]) : 0;
    floatingLabel.style.fontSize = floatingLabelFontSize + "px";
});
shoot.addEventListener("touchend", function (ev) {
    ev = ev || event;

    this.dist = 0;
    this.pointend = { x: this.pointmove.x - this.pointstart.x + this.pointend.x, y: this.pointmove.y - this.pointstart.y + this.pointend.y };//将移动位置存储
    //console.log(this.pointstart,this.pointend);
})

//添加系统相机拍摄完成的图片
input.addEventListener("change", function (event) {
    systemCamera.style.display = "block";
    container.style.display = "none";
    var file = event.target.files[0];
    let reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    reader.onload = (readerEvent) => {
        image.src = readerEvent.target.result;

        //console.log()
    }
});

function success(stream) {
    //兼容webkit核心浏览器
    //let CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
    //console.log(stream);
    //video.src = CompatibleURL.createObjectURL(stream);
    video.srcObject = stream;
    //video.play();
}
function error(error) {
    console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
}
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)//调用后置摄像头'video':{ 'facingMode': "environment" }，前置摄像头使用'video':{ 'facingMode': "user" }
            .then(success)
            .catch(error)
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}
const startMedia = () => {
    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        //调用用户媒体设备, 访问摄像头
        getUserMedia({
            audio: false,
            video: { facingMode: "environment", width, height }//视频分辨率在之后的安卓开发中将在设置中自动获取并由用户选择设置
        }, success, error);
    } else {
        alert('不支持访问用户媒体');
    }
}
startMedia();//*************

/* 关闭视频流采集 */
const stopMedia = () => {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
        track.stop();
    });
    video.srcObject = null;
}

// 点击camera按钮，从视频流中截取一帧图片并画在canvas中并下载
camera.addEventListener("click", function () {
    if(!videoMode) drawImage(video);
});
camera.addEventListener("touchstart", () => {
    
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        videoMode=!videoMode;
        point.style.display=videoMode?"block":"none";
    }, 1000);
});
camera.addEventListener("touchend", () => {
    clearTimeout(this.timer);
});


//点击水印相机按钮弹出和关闭水印相机窗口
watermark.addEventListener("click", function () {
    if (video.paused) {
        container.style.display = "block";
        systemCamera.style.display = "none";
        video.play();
    } else {
        container.style.display = "none";
        systemCamera.style.display = "block";
        video.pause();
    }
});

// 在用户离开或隐藏这个页面时关闭视频采集,节省资源*************
document.addEventListener("visibilitychange", function () {

    if (document.visibilityState == "hidden") {
        this.timer = setTimeout(() => {//设置定时器延迟1000秒在关闭视频流
            container.style.display = "none";
            stopMedia();
            video.pause();
            this.timer = 0;
        }, 1000000);
    } else if (document.visibilityState == "visible") {
        this.timer ? clearTimeout(this.timer) : startMedia();//根据定时器的关闭与否进行清除定时或重新打开视频流
    }

});

/* 阻止弹出菜单 */
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

saveImage.addEventListener("click", () => {
    drawImage.call(image, image);
})
