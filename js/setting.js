const back = document.querySelector("header>span");
const rightSpan = document.querySelectorAll("ul>li>span");
const li = document.querySelectorAll("ul>li");
const details = document.querySelectorAll("ul>div");
const showDate = document.querySelector('ul>.setDate > div:first-child > label>input[type="checkbox"]');
const selectDate = document.querySelector('ul>.setDate > div:last-child');
const videoSizeInput = document.querySelectorAll('ul > div.sharp > .showVideoSize > label > input');
const outImageProgress = document.querySelector('ul > div.sharp > .outImageSharp > .progress');
const outVideoProgress = document.querySelector('ul > div.sharp > .outVideoSharp > .progress');
/* const lineWrap = document.querySelector('ul > div.sharp > .outImageSharp > .progress > .lineWrap');
const lineInner = document.querySelector('ul > div.sharp > .outImageSharp > .progress > .lineWrap>div');
const progressLabel = document.querySelector('ul > div.sharp > .outImageSharp > .progress > p');
 */
/* 点击左上角返回按钮删除本页跳转主页面 */
back.addEventListener("click", function () {
    window.location.replace("./index.html");
});

/* 点击列表右侧>号显示每条设置详情 */
rightSpan.forEach((el, index) => {
    el.addEventListener("click", function () {
        this.isShowDiv = this.isShowDiv ? false : true;
        details[index].style.display = this.isShowDiv ? "block" : "none";
        rightSpan[index].innerText = this.isShowDiv ? "∨" : ">";
        // switch(index){
        //     case 0:break;
        //     case 1:break;
        //     case 2:break;
        //     case 3:break;
        //     case 4:break;
        //     case 5:break;
        // }
    })
});

/* 日期选择变化显示隐藏日期选择选项 */
showDate.addEventListener("input", function () {
    //console.log("日期变化",this.checked);
    selectDate.style.display = this.checked ? "flex" : "none";
});

videoSizeInput.forEach((el, index) => {
    el.addEventListener("input", function (ev) {

    })
});

/* 进度条改变事件*/
const addProgressEvent=(progressWrap,str="image")=>{//测试
    const progressLabel=progressWrap.children[0];
    const lineWrap=progressWrap.children[1];
    const lineInner=lineWrap.children[0];
    lineWrap.addEventListener("touchstart", function (ev) {
        lineInner.style.width = ev.touches[0].clientX - this.offsetLeft + "px";
        this.value = (ev.touches[0].clientX - this.offsetLeft) / this.offsetWidth;
        //console.log(ev.touches[0].clientX - this.offsetLeft)/this.offsetWidth;
    });
    lineWrap.addEventListener("touchmove", function (ev) {
        lineInner.style.width = ev.touches[0].clientX - this.offsetLeft + "px";
        this.value = (ev.touches[0].clientX - this.offsetLeft) / this.offsetWidth;
        //progressLabel.innerText=Math.trunc(this.value*1000)/10+"%";
        progressLabel.innerText=str=="image"?Math.trunc(this.value*1000)/10+"%":Math.trunc(this.value*1000)/10/2+"Mbps";
    });
    lineWrap.addEventListener("touchend", function (ev) {
        if (this.value < 0) {
            this.value = 0
        }else if(this.value>1){
            this.value=1;
        };
        progressLabel.innerText=str=="image"?Math.trunc(this.value*1000)/10+"%":Math.trunc(this.value*1000)/10/2+"Mbps";
    });
}

addProgressEvent(outImageProgress);
addProgressEvent(outVideoProgress,"video");

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