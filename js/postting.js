/* 若不存在设置默认参数 */
//localStorage.clear();
if (!localStorage.getItem("cameraParams")) {
  const cameraSystem = {
    project: "XX小区",
    message: {
      WhetherDate: true, //是否显示日期时间
      addDate: true, //true为原日期，false为今日期
      addTime: false, //添加时间
      memo: "" //备注文本
    },
    storageSize: {
      videoWidth: 1000, //视频像素宽度
      videoHeight: 1000, //视频像素高度
      imageQuality: 0.9, //图片输出清晰度
      videoQuality: 20000000 //视频输出比特/秒
    },
    inspectionTable: ["装修前", "装修中", "装修后"], //图片分类
    building: {
      total: 12, //总楼数
      unit: 5, //单元数
      perFloor: 5, //层户数
      floors: 30 //层高
    },
    flagSetting: {
      color: "#000000", //标记文本颜色
      width: 20 //标记文本宽度vw
    },
    autoText: true //是否自动添加文本
  }
  localStorage.setItem("cameraParams", JSON.stringify(cameraSystem));
  //console.log(camera);
}

/* 每次加载重新调用本地参数 */
let cameraParams = JSON.parse(localStorage.getItem("cameraParams")); //获取本地相机参数

// 获取媒体方法（旧的浏览器可能需要前缀）
const getOldStream = () => {
  navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  // 获取视频流
  navigator.getMedia(
    {
      video: { facingMode: "environment", width, height }, //视频分辨率在之后的安卓开发中将在设置中自动获取并由用户选择设置
      // video: { width, height },//视频分辨率在之后的安卓开发中将在设置中自动获取并由用户选择设置
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        //var vendorURL = window.URL || window.webkitURL;
        video.srcObject = stream;
      }
      // video.play();

    },
    function(err) {
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
    .then(function(mediaStream) {
      video.srcObject = mediaStream;
      // video.onloadedmetadata = function (e) {
      //     video.play();
      // };
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }); // 总是在最后检查错误

}

/* 实现拍摄的图片保存下载,从视频流中截取一帧图片并画在canvas中并下载 */
let drawImage = (el) => {
  //console.log(floatingLabel.innerHTML);
  let width = el.naturalWidth ? el.naturalWidth : window.width; //处理元素img和video原始宽度兼容
  //alert("imgWidth:"+width);
  canvas.width = width;
  canvas.height = width * (el.clientHeight / el.clientWidth);
  context.save();
  context.fillStyle = getComputedStyle(floatingLabel).color;
  context.font = `${floatingLabelFontSize * (width / el.clientWidth)}px normal`; //-----------------------------修改字体样式-----------------------------------------

  context.beginPath();
  //console.log( getComputedStyle(floatingLabel).backgroundColor);
  context.drawImage(el, 0, 0, canvas.width, canvas.height);
  //console.log(floatingLabel.innerHTML,(width/el.clientWidth),getComputedStyle(floatingLabel).color,floatingLabel.offsetTop);

  context.fillText(floatingLabel.innerText, floatingLabel.offsetLeft * (width / el.clientWidth), (floatingLabel.offsetTop + floatingLabelFontSize) * (width / el.clientWidth));
  context.restore();
  var dataUrl = canvas.toDataURL("image/jpeg", sharp); //-----------------------------------------需要设置清晰度-----------------------------------------------------
  var link = document.createElement("a");
  link.href = dataUrl;
  link.download = building.options[building.selectedIndex].text + '_' + getCustomDate().datetime + ".jpg"; //-----------------------------------------------需要随着楼号及时间改名---------------------------------------------------
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
/* 视频流错误处理 */
function error(error) {
  console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
}

/* 视频流兼容处理 */
function getUserMedia(constraints, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints) //调用后置摄像头'video':{ 'facingMode': "environment" }，前置摄像头使用'video':{ 'facingMode': "user" }
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
/*//调用用户媒体设备, 访问摄像头 */
const startMedia = () => {
  if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    //调用用户媒体设备, 访问摄像头
    getUserMedia({
      audio: false,
      video: { facingMode: "environment", width, height } //视频分辨率在之后的安卓开发中将在设置中自动获取并由用户选择设置
    }, success, error);
  } else {
    alert('不支持访问用户媒体');
  }
}
/* 关闭视频流采集 */
const stopMedia = () => {
  const stream = video.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  video.srcObject = null;
}
/* 添加触摸移动文本位置事件 */
let distance = (p1, p2) => { //计算两触点距离
  //return Math.sqrt(Math.pow(p2.clientX-p1.clientX,2)+Math.pow(p2.clientY-p1.clientY,2));
  return Math.sqrt((p2.clientX - p1.clientX) * (p2.clientX - p1.clientX) + (p2.clientY - p1.clientY) * (p2.clientY - p1.clientY)) / 3;
}
/* 执行录制视频并下载 */
const videoRecordingDownload = () => {
  const stopRecorder = () => { //停止录制函数
    /* finishing为true执行视频保存视频 样式设置*/
    clearInterval(this.timer2);
    changer.style.borderRadius = "50%";
    camera.style.padding = "2vw";
    point.style.backgroundColor = "red";
    this.finishing = false; //视频录制完毕

    /* 保存录制的视频 */
    this.mediaRecorder.stop();
    cancelAnimationFrame(this.timer3);
  }

  if (!this.finishing) { //
    /* finishing为false执行录制视频 样式设置*/
    changer.style.borderRadius = "0";
    camera.style.padding = "4vw";
    this.finishing = true; //正在录制视频中
    let pointColor = "transparent";
    point.style.backgroundColor = pointColor;

    /* 处理红点闪灭 */
    clearInterval(this.timer2);
    this.timer2 = setInterval(() => {
      point.style.backgroundColor = pointColor = pointColor == "red" ? "transparent" : "red";
    }, 500);

    /* 避免不小心开启并忘记关毕,记录器录制30分钟自动保存关闭 */
    clearTimeout(this.timer3);
    this.timer3 = setTimeout(() => {
      if (this.mediaRecorder.state != "inactive") {
        stopRecorder();
      }
    }, 1800000);

    /* 开始录制视频 */
    canvas.width = width;
    canvas.height = width * (video.clientHeight / video.clientWidth);

    /* 创建canvas实时绘制函数 */
    const update = () => {
      context.save();
      context.fillStyle = getComputedStyle(floatingLabel).color;
      context.font = `${floatingLabelFontSize * (width / video.clientWidth)}px normal`; //-----------------------------修改字体样式-----------------------------------------
      context.beginPath();
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.fillText(floatingLabel.innerHTML, floatingLabel.offsetLeft * (width / video.clientWidth), (floatingLabel.offsetTop + floatingLabelFontSize) * (width / video.clientWidth));
      context.restore();
      this.timer3 = requestAnimationFrame(update);
    }
    update();

    /* 创建视频录制,将canvas画面数据流赋值给视频录制组件 */
    const stream = canvas.captureStream();
    this.mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 128000, videoBitsPerSecond: cameraParams.storageSize.videoQuality, mimeType: 'video/webm' }); //---------------------------videoBitsPerSecond调整视频清晰度-----------------------------------------------------------
    const data = [];
    this.mediaRecorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size) {
        data.push(ev.data);
      }
    }
    this.mediaRecorder.onstop = () => {
      const dataUrl = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));
      var link = document.createElement("a");
      link.href = dataUrl;
      link.download = building.options[building.selectedIndex].text + '_' + getCustomDate().datetime + ".webm"; //-----------------------------------------------需要随着楼号及时间改名---------------------------------------------------
      link.click();
    }
    this.mediaRecorder.start();
  } else {
    // /* finishing为true执行视频保存视频 样式设置*/
    // clearInterval(this.timer2);
    // changer.style.borderRadius = "50%";
    // camera.style.padding = "2vw";
    // point.style.backgroundColor = "red";
    // this.finishing = false;//视频录制完毕

    // /* 保存录制的视频 */
    // this.mediaRecorder.stop();
    // cancelAnimationFrame(this.timer3);
    stopRecorder();
  }



}

/* setting 设置从本地读取的数据加载到设置列表 */
function loadParameter(cameraParams) {
  details[0].querySelector("label>input").value = cameraParams.project;
  details[1].querySelectorAll("label>input").forEach((el, index, arr) => {
    switch (index) {
      case 0:
        el.checked = cameraParams.message.WhetherDate;
        break;
      case 1:
        el.value = cameraParams.message.memo;
        break;
      case 2:
        el.checked = cameraParams.message.addDate;
        break;
      case 3:
        el.checked = !cameraParams.message.addDate;
        break;
      case 4:
        el.checked = cameraParams.message.addTime;
        break;

        // el.querySelector("label>input[value='time']").checked = cameraParams.message.addTime;
        /* el.querySelectorAll("label>input").forEach((el, index) => {
            if (index == 1) {
                el.checked = cameraParams.message.addDate;
            } else if (index == 2) {
                el.checked = cameraParams.message.addTime
            }
        }) */
    }
  });
  details[2].querySelector(".showVideoSize>label>input").value = cameraParams.storageSize.videoWidth;
  details[2].querySelector(".showVideoSize>label:last-child>input").value = cameraParams.storageSize.videoHeight;

  details[2].querySelector(".outImageSharp>.progress>p").innerText = cameraParams.storageSize.imageQuality * 100 + "%";
  details[2].querySelector(".outImageSharp>.progress>.lineWrap>div").style.width = details[2].querySelector(".outImageSharp>.progress>.lineWrap").offsetWidth * cameraParams.storageSize.imageQuality + "px";
  details[2].querySelector(".outVideoSharp>.progress>p").innerText = cameraParams.storageSize.videoQuality / 1000000 + "Mbps";
  details[2].querySelector(".outVideoSharp>.progress>.lineWrap>div").style.width = details[2].querySelector(".outVideoSharp>.progress>.lineWrap").offsetWidth * (cameraParams.storageSize.videoQuality / 50000000) + "px";

  details[4].querySelector("select").innerHTML = "";
  cameraParams.inspectionTable.forEach((el, index) => {
    details[4].querySelector("select").innerHTML += `<option value='${el}'>${el}</option>`;
  });
  details[5].querySelectorAll("label>input[type='number']").forEach((el, index, arr) => {
    el.value = Object.values(cameraParams.building)[index];
  });
  details[6].querySelector("label>input[type='color']").value = cameraParams.flagSetting.color;
  details[6].querySelector("label>input[type='number']").value = cameraParams.flagSetting.width;
  details[7].querySelector("label>input[type='radio']").checked = cameraParams.autoText;
  details[7].querySelector("label:last-child>input[type='radio']").checked = !cameraParams.autoText;
}
/*setting 将设置保存到本地 */
function saveSetting() {
  document.querySelectorAll("ul>div label>input").forEach((el, index) => {
    if (el.name in cameraParams) {
      cameraParams[el.name] = el.type == "text" ? el.value : el.value == "fullAuto" ? el.checked : !el.checked;
    } else if (el.name in cameraParams.message) {
      el.name == "memo" ? cameraParams.message[el.name] = el.value : cameraParams.message[el.name] = el.value == "current" ? !el.checked : el.checked;
      // cameraParams.message[el.name]=el.value;
    } else if (el.name in cameraParams.storageSize) {
      cameraParams.storageSize[el.name] = el.value;
    } else if (el.name in cameraParams.building) {
      cameraParams.building[el.name] = el.value;
    } else if (el.name in cameraParams.flagSetting) {
      cameraParams.flagSetting[el.name] = el.value;
    }
  });
  /* 添加列表选项 */
  let v = document.querySelector("ul>.addSort>select").options; //获取列表框中的列表项
  let arr = [];
  for (o of v) {
    arr.push(o.innerText);
  }
  cameraParams.inspectionTable = arr;
  /* 将列保存尺寸中的进度条赋值给对象 */
  cameraParams.storageSize.imageQuality = parseInt(document.querySelector("ul>.sharp>.outImageSharp>.progress>p").innerText) / 100;
  cameraParams.storageSize.videoQuality = parseInt(document.querySelector("ul>.sharp>.outVideoSharp>.progress>p").innerText) * 1000000;

  // console.log(cameraParams);
  localStorage.setItem("cameraParams", JSON.stringify(cameraParams));

}

/*setting 提取折叠展开设置 */
function setFolding(index) {
  /* 设置输入界面展示到列表中 */
  this.menuText = "";
  if (this.isShowDiv) {
    this.menuText = "";
    //loadParameter(cameraParams);
  } else {
    switch (index) {
      case 0:
        this.menuText = details[index].querySelector("label>input").value;
        break; //列表第一项
      case 1:
        details[index].querySelectorAll("label>input").forEach((el, index, arr) => { //第二项
          this.menuText += arr[0].checked && el.checked && index ? "[" + el.parentNode.innerText + "]" : ""; //添加备注文本并判断添加日期是否选中,若选中将尾部日期信息添加到列表中
        });
        this.menuText = this.menuText + details[index].querySelector("label>input[type='text']").value; //最后将备注文本添加到列表文本前面;
        break;
      case 2:
        details[index].querySelectorAll(".showVideoSize>label>input").forEach((el, index, arr) => { //将分辨率添加到列表项中
          this.menuText += index == 0 ? "[" + el.value + "×" : el.value + "]";
        });
        this.menuText += "[" + details[index].querySelector(".outImageSharp>.progress>p").innerText + "]"; //添加图片清晰度
        this.menuText += "[" + details[index].querySelector(".outVideoSharp>.progress>p").innerText + "]"; //添加视频流分辨率
        break;
      case 3:
        this.menuText = "网页版不支持";
        break;
      case 4:
        let v = details[index].querySelector("select").options; //获取列表框中的列表项
        for (o of v) {
          this.menuText += o.index < v.length - 1 ? o.innerText + "," : o.innerText; //将列表项的文本提取
        }
        this.menuText = "[" + this.menuText + "]";
        break;
      case 5:
        details[index].querySelectorAll("label>input[type='number']").forEach((el, index, arr) => {
          this.menuText += el.value + " ";
        });
        break;
      case 6:
        this.menuText = `<input type='color' style='height:6vw;' disabled value=${details[index].querySelector("label>input[type='color']").value}> `;
        this.menuText += details[index].querySelector("label>input[type='number']").value + "vw";
        break;
      case 7:
        details[index].querySelectorAll("label>input[type='radio']").forEach((el, index, arr) => {
          this.menuText += el.checked ? el.parentNode.innerText : "";
        });
        break;

    }
  }

  li[index].children[1].innerHTML = this.menuText; //将列表选项内容添加到列表项中

}

/* 判断文本输入框失去焦点后若内容为空将还原 */
document.querySelectorAll("ul>div label>input[type='number'],ul>div label>input[type='text'][name='project']").forEach((el, index) => {
  el.addEventListener("blur", function() {
    if (!el.value.trim()) {
      if (el.name in cameraParams) {
        el.value = cameraParams[el.name];
      } else if (el.name in cameraParams.storageSize) {
        el.value = cameraParams.storageSize[el.name];
      } else if (el.name in cameraParams.building) {
        el.value = cameraParams.building[el.name];
      } else if (el.name in cameraParams.flagSetting) {
        el.value = cameraParams.flagSetting[el.name];
      }
    }

  })
});

/*启动添加楼号列表*/
function addBuildingList() {
  buildingList.innerHTML = '';


  for (let i = 1; i < cameraParams.building.total; i++) {
    buildingList.innerHTML += `<li>${i}#楼</li>`

  }
}
/*获取本地日期时间并按照自定义格式展示*/
function getCustomDate() {
  var now = new Date();

  // 定义日期时间格式
  var year = now.getFullYear();
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var date = ('0' + now.getDate()).slice(-2);
  var hour = ('0' + now.getHours()).slice(-2);
  var minute = ('0' + now.getMinutes()).slice(-2);
  var second = ('0' + now.getSeconds()).slice(-2);

  // 拼接日期时间字符串
  var datetime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;

  // 输出日期时间字符串

  let localeDate = cameraParams.message.WhetherDate ? (cameraParams.message.addTime ? datetime : now.toLocaleDateString().replaceAll('/', '-')) : "";

  return { localeDate, datetime };

}