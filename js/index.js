//获取元素
var menu = document.querySelector(".navigate>.menu");
var menuSelect = document.querySelector(".shoot>.menuSelect");
var buildingList = document.querySelector(".shoot>.buildingList");
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
var inputSystem = document.querySelector(".selector>#opencamera");
var inputMedia = document.querySelector(".selector>#openmedia");
var saveImage = document.querySelector(".selector>.saveImage");
const watermark = document.querySelector(".selector>.watermark");
const inspection = document.querySelector('.navigate>#inspection');
const building = document.querySelector('.navigate>#building');

//var label =document.querySelector(".selector>label");
var context = canvas.getContext('2d');
var width = cameraParams.storageSize.videoWidth; //水印相机拾取分辨率7
var height = cameraParams.storageSize.videoHeight;
var textColor = [cameraParams.flagSetting.color, 'black', "white", "red", "green", "blue"]; //标签设置文本长按颜色变换自动加入标记颜色
var floatingLabelFontSize = floatingLabel.clientHeight; //获取标签文本的像素值
var sharp = cameraParams.storageSize.imageQuality; //设置下载图片清晰度
var videoMode = false; //设置红点是否显示及处于何种模式false为拍照模式
var menuShow = false; //右上角菜单是否显示;
// image.align="middle";
/*启动添加楼号列表*/
addBuildingList();
/*默认获取本地小区*/
building.innerHTML = '<option>' + cameraParams.project + '</option>';
/*设置标签默认颜色与标识颜色相同*/
//floatingLabel.style.color=cameraParams.flagSetting.color;
/*添加楼房选择事件*/
building.addEventListener('touchstart', function(ev) {
  buildingList.style.display = (this.showList = !this.showList) ? 'block' : 'none';
  building.innerHTML = '<option>' + cameraParams.project + '</option>'; //点击左上角下拉列表直接修改为默认小区
  addBuildingList()
  ev.preventDefault();
});
/*此部需要重新寻找简便方法处理，已在下面解决*/
/*buildingList.children.forEach((el,index)=>{
  el.addEventListener('touchstart',function(ev){
    console.log(this.innerText);
  });
})*/
/*阻止楼号列表冒泡*/
buildingList.addEventListener('click', function(ev) {
  this.innerHTML = '';
  if (/^\d+#楼$/.test(ev.target.innerText)) {
    for (let i = 1; i < cameraParams.building.unit; i++) {
      this.innerHTML += `<li>${ev.target.innerText.split('#楼',1)[0]}-${i}单元</li>`
    }
  } else if (/^\d+-\d+单元$/.test(ev.target.innerText)) {
    for (let i = 1; i < cameraParams.building.floors; i++) {
      this.innerHTML += `<li>${ev.target.innerText.split('单元')[0]}-${i}层</li>`;
    }
  } else if (/^\d+-\d+-\d+层$/.test(ev.target.innerText)) {
    for (let i = 1; i < cameraParams.building.perFloor; i++) {
      this.innerHTML += `<li>${ev.target.innerText.split('层')[0]}${('0'+i).slice(-2)}</li>`;
    }

  } else if (/^\d+-\d+-\d+$/.test(ev.target.innerText)) {
    building.innerHTML = `<option>${ev.target.innerText}</option>`;
    buildingList.style.display = 'none';
    building.showList = false;
    addBuildingList();
  }

  // console.log(ev.target.innerText.split('#楼',1)[0]);
  //ev.stopPropagation();
});
/*阻止列表冒泡*/
buildingList.addEventListener('touchstart', function(ev) {
  ev.stopPropagation();
});
buildingList.addEventListener('touchmove', function(ev) {
  ev.stopPropagation();
});
buildingList.addEventListener('touchend', function(ev) {
  ev.stopPropagation();
});

//添加巡查表列表
inspection.innerHTML = '';
cameraParams.inspectionTable.forEach((item, index) => {
  inspection.innerHTML += `<option>${item}</option>`;
});

//添加浮动的标签文本被长按事件(改变颜色用)
floatingLabel.addEventListener("touchstart", function(event) {
  this.timer = setTimeout(() => { //被长按事件
    this.style.color = textColor[this.timer % textColor.length]; //长按改变颜色
    //this.timer%2?this.style.color = "white":this.style.color = "black";
    this.timer = 0;
  }, 500);
});
floatingLabel.addEventListener("touchmove", function(event) {
  clearTimeout(this.timer);
});
floatingLabel.addEventListener("touchend", function(event) {
  clearTimeout(this.timer);
});



shoot.addEventListener("touchstart", function(ev) {
  /* 实现双击效果打开标签文本输入框 */
  this.count++;
  clearTimeout(this.timer);
  this.timer = setTimeout(() => {
    if (this.count == 2 && !ev.touches[1]) { //双击功能实现

      // console.log(prompt("请输入水印文本", floatingLabel.innerText));
      let result = prompt("请输入水印文本", floatingLabel.innerText);
      //floatingLabel.innerText = prompt("请输入水印文本", floatingLabel.innerText) || floatingLabel.innerText;
      // 获取当前本地日期时间
      
      // console.log(localeDate);
      floatingLabel.innerText = cameraParams.autoText ? result ? floatingLabel.autoText ? result : (building.options[building.selectedIndex].text == cameraParams.project ? '' : building.options[building.selectedIndex].text) + result + inspection.options[inspection.selectedIndex].text + getCustomDate().localeDate + cameraParams.message.memo : floatingLabel.innerText : result;
      //-----------------------------------------------------------------------------------------
      floatingLabel.autoText = floatingLabel.innerText ? true : false;

      //console.log(floatingLabel.innerText)
      floatingLabel.style.top = 0;
      floatingLabel.style.left = 0;

      //this.pointstart={}
      this.pointend = { x: 0, y: 0 };
    }
    this.count = 0;
  }, 200);

  menuSelect.style.display = (menuShow = false) ? "block" : "none"; //点击其他地方关闭菜单
  /* 实现缩放及移动标签前置工作 */
  ev = ev || event;
  this.dist = ev.touches[1] ? distance(ev.touches[0], ev.touches[1]) : 0; //保存文本缩放前两指距离
  this.pointstart = { x: ev.touches[0].clientX, y: ev.touches[0].clientY }; //实现标签移动前保存手指开始数据
  if (!this.pointend) this.pointend = { x: 0, y: 0 };
  this.pointmove = this.pointstart; //处理开始为空报错及未移动报错(手指快速按下并抬起)
});

shoot.addEventListener("touchmove", function(ev) {
  ev = ev || event;
  /* 实现移动标签功能 */
  this.pointmove = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  floatingLabel.style.top = this.pointmove.y - this.pointstart.y + this.pointend.y + "px";
  floatingLabel.style.left = this.pointmove.x - this.pointstart.x + this.pointend.x + "px";

  /* 实现手指缩放标签 */

  floatingLabelFontSize = floatingLabelFontSize + (this.dist ? (distance(ev.touches[0], ev.touches[1]) - this.dist) : 0); //手指缩放调整文本大小
  this.dist = this.dist ? distance(ev.touches[0], ev.touches[1]) : 0;
  if (this.dist) floatingLabel.style.fontSize = floatingLabelFontSize + innerWidth / 25 + "px"; //加上文字原始尺寸，单手不触发
});
shoot.addEventListener("touchend", function(ev) {
  ev = ev || event;

  this.dist = 0;
  floatingLabelFontSize = floatingLabel.clientHeight; //处理浮动标签字体大小不准确问题
  this.pointend = { x: this.pointmove.x - this.pointstart.x + this.pointend.x, y: this.pointmove.y - this.pointstart.y + this.pointend.y }; //将移动位置存储
  //console.log(this.pointstart,this.pointend);
})

//添加系统相机拍摄完成的图片
inputSystem.addEventListener("change", function(event) {
  systemCamera.style.display = "block"; //打开系统相机容器
  container.style.display = "none"; //关闭水印相机容器
  saveImage.disabled = false; //启用(保存图片)按钮
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
//添加本地媒体事件
inputMedia.addEventListener("change", function(event) {
  systemCamera.style.display = "block"; //打开系统相机容器
  container.style.display = "none"; //关闭水印相机容器
  saveImage.disabled = false; //启用(保存图片)按钮
  var file = event.target.files[0];
  let reader = new FileReader();
  if (file) {
    reader.readAsDataURL(file);
  }
  reader.onload = (readerEvent) => { //需要设置如果是视频将如何处理
    image.src = readerEvent.target.result;
    //console.log()
  }
});

//点击camera按钮，从视频流中截取一帧图片并画在canvas中并下载
camera.addEventListener("click", function() {
  videoMode ? videoRecordingDownload() : drawImage(video);
});
camera.addEventListener("touchstart", (ev) => {
  clearTimeout(this.timer);
  this.timer = setTimeout(() => { //长按进入录制模式红点出现
    videoMode = !videoMode;
    point.style.display = videoMode ? "block" : "none";
    this.timer = 0;
  }, 1000);
  return false;
});
camera.addEventListener("touchend", () => {
  clearTimeout(this.timer);
  // if(!videoMode){
  //     drawImage(video)
  // };
  // return false;
});


//点击水印相机按钮弹出和关闭水印相机窗口
watermark.addEventListener("click", function() {
  if (video.paused) {
    container.style.display = "block";
    systemCamera.style.display = "none";
    saveImage.disabled = true; //水印相机开启时禁用(保存图片)按钮
    video.play();
  } else {
    container.style.display = "none";
    systemCamera.style.display = "block";
    saveImage.disabled = false;
    video.pause();
  }
});

startMedia(); //*************
// 在用户离开或隐藏这个页面时关闭视频采集,节省资源*************
document.addEventListener("visibilitychange", function() {

  if (document.visibilityState == "hidden") {
    this.timer = setTimeout(() => { //设置定时器延迟1000秒在关闭视频流
      container.style.display = "none";
      stopMedia();
      video.pause();
      this.timer = 0;
    }, 1000000);
  } else if (document.visibilityState == "visible") {
    this.timer ? clearTimeout(this.timer) : startMedia(); //根据定时器的关闭与否进行清除定时或重新打开视频流
  }

});

menu.addEventListener("click", () => {
  menuSelect.style.display = (menuShow = !menuShow) ? "block" : "none";
});



/* 阻止窗口弹出菜单 */
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
/*将图片添加文字后下载*/
saveImage.addEventListener("click", () => {
  drawImage.call(image, image);
  floatingLabel.autoText = false;
  //floatingLabel.innerText='';
})
/* 阻止菜单传递事件 */
menuSelect.addEventListener("touchstart", function(ev) {
  ev.stopPropagation();
});
menuSelect.addEventListener("touchmove", function(ev) {
  ev.stopPropagation();
});
menuSelect.addEventListener("touchend", function(ev) {
  ev.stopPropagation();
});

for (let i = 0; i < menuSelect.children.length; i++) {
  menuSelect.children[i].addEventListener("click", function() {
    menuSelect.style.display = "none";
    switch (i) {
      case 0:
        break;
      case 1:
        window.location.replace("./setting.html");
        break;
      case 2:
        alert("大家好!这是我利用业余时间编写的网页程序,希望大家能喜欢,如有意见建议联系微信:fy1302uc");
        break;
      case 3:
        let helf = `
        1.双击屏幕会弹出输入框，输入文本后点确定会出现标签，滑动屏幕任意位置移动标签，长按标签改变颜色;
        2.输入空格确认后会自动重置输入，以后输入会自动添加备注;
        3.点击'水印相机'会出现水印拍摄界面点击拍摄会下载拍摄的水印图片;
        4.长按水印相机界面拍摄圆会出现红点，再次点击会录制水印视频，再点击下将会把处理的水印视频下载下来(处理时间随录制时间相应增加)，再次长按将会取消录制模式红点消失,视频暂时只支持webm格式且无声;
        5.点击'系统相机'按钮会调用系统相机拍摄，点击'保存图片'下载水印图片;
        6.由于网页无法获取本地目录文件，无法分类保存图片，若要分类保存请下载我的另一款安卓版;
        7.点击右侧的'...'符号会出现下拉菜单可以进行设置等操作;
        `
        alert(helf);
        break;
    }
  })
}