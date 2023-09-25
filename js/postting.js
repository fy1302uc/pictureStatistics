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
    context.font = `${floatingLabelFontSize * (width / el.clientWidth)}px serif`;

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
