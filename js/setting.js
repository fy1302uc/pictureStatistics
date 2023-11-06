const back = document.querySelector("header>span");
const exit = document.querySelector(".btn>button:last-child");
const aboutHelp = document.querySelectorAll(".btn>button")[1];
const save = document.querySelector(".btn>button");
const rightSpan = document.querySelectorAll("ul>li>span");
const li = document.querySelectorAll("ul>li");
const details = document.querySelectorAll("ul>div");
const showDate = document.querySelector('ul>.setDate > div:first-child > label>input[type="checkbox"]');
const selectDate = document.querySelector('ul>.setDate > div:last-child');
const videoSizeInput = document.querySelectorAll('ul label > input[type="number"]');
const lineSizeInput = document.querySelector("ul > div.lineColorSize>label>input[type='number']");
const outImageProgress = document.querySelector('ul > div.sharp > .outImageSharp > .progress');
const outVideoProgress = document.querySelector('ul > div.sharp > .outVideoSharp > .progress');
/* const lineWrap = document.querySelector('ul > div.sharp > .outImageSharp > .progress > .lineWrap');
const lineInner = document.querySelector('ul > div.sharp > .outImageSharp > .progress > .lineWrap>div');
const progressLabel = document.querySelector('ul > div.sharp > .outImageSharp > .progress > p');
 */
//localStorage.setItem("camera", JSON.stringify({ name: 'liubo', age: 23, gender: 'male' }));



loadParameter(cameraParams);//加载相机本地参数到组件

//console.log(cameraParams);
/* 点击左上角返回按钮删除本页跳转主页面 */
back.addEventListener("click", function () {
    window.location.replace("./index.html");
});
/* 保存配置 */
save.addEventListener("click",function(){
    saveSetting();
});
/* 关于帮助 */
aboutHelp.addEventListener("click",function(){
    let content = `
关于：
    大家好！这是我利用业余时间编写的小程序，希望大家能喜欢，如有意见建议联系 \n微信:fy1302uc

帮助：
    ①主目录：设置为单击主窗口左上角'楼房选择'出现列表的小区名。
    ②尾部文本：选项是在主窗口图片被双击后出现输入框输入文本后点击'确认'后将自动添加在所编辑文本尾部
    ③保存尺寸：选择最右100％时所保存图片的清晰度最高，同时所占存储最大接近原图大小，否则正好相反；如果出现保存失败可以调小该值。
    ④保留原图：'保留'为不删所载入图片的原图；'不保留'为只删除同过本软件所拍摄的图片原图；'全不保留'与'保留'相反将删除所有载入的图片原图
    ⑤添加分类：为列表选择的最后分类，也是全自动添加的中间文本。
    ⑥最大值：为列表选择楼层分类的所设定的最大值。
    ⑦自动添加文本：'全自动'将会在楼房列表选择完成后再载入图片后根据所选房号自动添加备注文本，'手动'被选择将不会自动添加，但主窗口的'续写'被选中后将在路径不变情况下自动添加上次编辑的内容；
    ⑧在主窗口界面点击右上角设置按钮弹出菜单选择'标记'可以进行手绘画线，标签将不可移动，最好要设置完标签位置在点击保存按钮保存，未保存前点一次手机返回将撤销绘制内容，如果点保存后未重新选择或拍摄图片再次点击'标记'还可以重新编辑，'标记设置'可以设置画线宽度和颜色。
    ⑨在主窗口界面点击右上角设置按钮弹出菜单选择'相册'或向右快速滑动可以浏览上面编辑框路径所有图片，长安图片可以分享该图。`
    alert(content);
})

/* 退出设置重新加载主页 */
exit.addEventListener("click",function(){
    window.location.replace("./index.html");
})

/* 点击列表右侧>号显示每条设置详情 */
rightSpan.forEach((el, index) => {
    el.addEventListener("click", function () {
        this.isShowDiv = this.isShowDiv ? false : true;//通过三元运算符变换同步是否打开
        details[index].style.display = this.isShowDiv ? "block" : "none";
        rightSpan[index].innerText = this.isShowDiv ? "∨" : ">";
        /* 设置输入界面展示到列表中 */
        setFolding.call(this, index);
    })
});

/* 日期选择变化显示隐藏日期选择选项 */
showDate.addEventListener("input", function () {
    //console.log("日期变化",this.checked);
    selectDate.style.display = this.checked ? "flex" : "none";
});

videoSizeInput.forEach((el, index) => {
    el.addEventListener("input", function (ev) {
        ev.target.value == "e" | "-" ? this.value = "" : this.value = ev.target.value;
        //console.log(ev.target.defaultValue);
    })
});

/* 设置标记线条尺寸输入框最大值<100>0 */
lineSizeInput.addEventListener("input", function (ev) {
    if (ev.target.value > 100 || ev.target.value < 0) {
        ev.target.value = "";
    }
})

/* 进度条改变事件*/
const addProgressEvent = (progressWrap, str = "image") => {//测试
    const progressLabel = progressWrap.children[0];
    const lineWrap = progressWrap.children[1];
    const lineInner = lineWrap.children[0];
    lineWrap.addEventListener("touchstart", function (ev) {
        lineInner.style.width = ev.touches[0].clientX - this.offsetLeft + "px";
        this.value = (ev.touches[0].clientX - this.offsetLeft) / this.offsetWidth;
        //console.log(ev.touches[0].clientX - this.offsetLeft)/this.offsetWidth;
    });
    lineWrap.addEventListener("touchmove", function (ev) {
        lineInner.style.width = ev.touches[0].clientX - this.offsetLeft + "px";
        this.value = (ev.touches[0].clientX - this.offsetLeft) / this.offsetWidth;
        //progressLabel.innerText=Math.trunc(this.value*1000)/10+"%";
        progressLabel.innerText = str == "image" ? Math.trunc(this.value * 1000) / 10 + "%" : Math.trunc(this.value * 1000) / 10 / 2 + "Mbps";
    });
    lineWrap.addEventListener("touchend", function (ev) {
        if (this.value < 0) {
            this.value = 0
        } else if (this.value > 1) {
            this.value = 1;
        };
        progressLabel.innerText = str == "image" ? Math.trunc(this.value * 1000) / 10 + "%" : Math.trunc(this.value * 1000) / 10 / 2 + "Mbps";
    });
}
addProgressEvent(outImageProgress);
addProgressEvent(outVideoProgress, "video");
rightSpan.forEach((el, index) => {//进入页面自动加载设置数据到列表
    setFolding.call(el, index);
});

/* lineWrap.addEventListener("touchstart", function (ev) {

    lineInner.style.width = ev.touches[0].clientX - this.offsetLeft + "px";
    this.value = (ev.touches[0].clientX - this.offsetLeft) / this.offsetWidth;
    //console.log(ev.touches[0].clientX - this.offsetLeft)/this.offsetWidth;
});
lineWrap.addEventListener("touchmove", function (ev) {
    lineInner.style.width = ev.touches[0].clientX - this.offsetLeft + "px";
    this.value = (ev.touches[0].clientX - this.offsetLeft) / this.offsetWidth;
    progressLabel.innerText=Math.trunc(this.value*100)+"%";
});
lineWrap.addEventListener("touchend", function (ev) {
    if (this.value < 0) {
        this.value = 0
    }else if(this.value>1){
        this.value=1;
    };
    progressLabel.innerText=Math.trunc(this.value*100)+"%";
});
 */
document.oncontextmenu = new Function("return false");//禁止右键弹出菜单