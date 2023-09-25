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

/* 实现拍摄的图片保存下载,从视频流中截取一帧图片并画在canvas中并下载 */
let drawImage =(el)=>{
    let width = el.naturalWidth?el.naturalWidth:window.width;//处理元素img和video原始宽度兼容
    console.log("imgWidth:"+width);
    canvas.width = width;
    canvas.height = width * (el.clientHeight / el.clientWidth);
    context.save();
    context.fillStyle = getComputedStyle(floatingLabel).color;
    context.font = `${floatingLabelFontSize * (width / el.clientWidth)}px normal`;//-----------------------------修改字体样式-----------------------------------------

    context.beginPath();
    //console.log( getComputedStyle(floatingLabel).backgroundColor);
    context.drawImage(el, 0, 0, canvas.width, canvas.height);
    //console.log(floatingLabel.innerHTML,(width/el.clientWidth),getComputedStyle(floatingLabel).color,floatingLabel.offsetTop);
    context.fillText(floatingLabel.innerHTML, floatingLabel.offsetLeft * (width / el.clientWidth), (floatingLabel.offsetTop + floatingLabelFontSize) * (width / el.clientWidth));
    context.restore();
    var dataUrl = canvas.toDataURL("image/jpeg", sharp);//-----------------------------------------需要设置清晰度-----------------------------------------------------
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = "myTest.jpg";//-----------------------------------------------需要随着楼号及时间改名---------------------------------------------------
    link.click(); 
}

/* 添加开启视频流并添加到video中 */
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
/* 关闭视频流采集 */
const stopMedia = () => {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
        track.stop();
    });
    video.srcObject = null;
}
