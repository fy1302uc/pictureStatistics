//获取元素
var container = document.querySelector(".watermarkCamera");
var video = document.querySelector(".watermarkCamera>video");
var canvas = document.querySelector(".watermarkCamera>canvas");
var camera = document.querySelector(".watermarkCamera>.camera");
var floatingLabel = document.querySelector("#floating");
var systemCamera = document.querySelector(".systemCamera");
var image = document.querySelector(".systemCamera>img");
var input = document.querySelector(".selector>#opencamera");
const watermark = document.querySelector(".selector>.watermark");


//var label =document.querySelector(".selector>label");
var context = canvas.getContext('2d');
var width = 600;
var height = 1000;
// image.align="middle";

//添加系统相机拍摄完成的图片
input.addEventListener("change", function (event) {
    systemCamera.style.display="block";
    container.style.display = "none";
    var file = event.target.files[0];
    let reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }

    reader.onload = (readerEvent) => {
        image.src = readerEvent.target.result;
    }
});

//添加浮动的标签文本被长按事件(改变颜色用)
floatingLabel.addEventListener("touchstart", function (event) {
    let timer = setTimeout(() => {//被长按事件
        timer = 0;
        this.style.color = "black";
        console.log("被长按");
    }, 600);
    //console.log("被点击")
    this.addEventListener("touchmove", function (event) {
        clearTimeout(timer);
    })
    this.addEventListener("touchend", function (event) {
        clearTimeout(timer);
    })
})

// 获取媒体方法（旧的浏览器可能需要前缀）
const getOldStream = () => {
    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    // 获取视频流
    navigator.getMedia(
        {
            video: { facingMode: "environment", width, height },//视频分辨率在之后的安卓开发中将在设置中自动获取并由用户选择设置
            // video: { width, height },//视频分辨率在之后的安卓开发中将在设置中自动获取并由用户选择设置
            audio: false
        },
        function (stream) {
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
            } else {
                //var vendorURL = window.URL || window.webkitURL;
                video.srcObject = stream;
            }
            // video.play();

        },
        function (err) {
            console.log("An error occured! " + err);
        }
    );
}

// 获取媒体方法(新浏览器使用的新协议)
const getStream = () => {
    var constraints = { audio: false, video: { width, height, facingMode: { exact: "environment" } } };
    //var constraints = { audio: false, video: { width, height } };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (mediaStream) {
            video.srcObject = mediaStream;
            // video.onloadedmetadata = function (e) {
            //     video.play();
            // };
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        }); // 总是在最后检查错误

}



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
        //     audio: false,
        //     video: { width, height, facingMode: { exact: "environment" } }
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints)//调用后置摄像头，前置摄像头使用'video':{ 'facingMode': "user" }
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
const stopMedia = () => {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
        track.stop();
    });
    video.srcObject = null;
}
// 点击camera按钮，从视频流中截取一帧图片并在canvas中展示并下载

camera.addEventListener("click", function () {
    canvas.width = width;
    canvas.height = width * (video.clientHeight / video.clientWidth);
    context.save();
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();

    var dataUrl = canvas.toDataURL("image/jpeg", 1);
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = "myTest.jpg";
    link.click();
});



//点击水印相机按钮弹出和关闭水印相机窗口
watermark.addEventListener("click", function () {
    if (video.paused) {
        container.style.display = "block";
        systemCamera.style.display="none";
        video.play();
    } else {
        container.style.display = "none";
        systemCamera.style.display="block";
        video.pause();
    }
});

// 在用户离开或隐藏这个页面时关闭视频采集,节省资源*************
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState == "hidden") {
        container.style.display = "none";
        stopMedia();
        video.pause();
    } else if (document.visibilityState == "visible") {
        startMedia();
    }
});
