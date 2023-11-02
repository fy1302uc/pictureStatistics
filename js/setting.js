const back = document.querySelector("header>span");
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
//localStorage.setItem("camera",JSON.stringify({name:'liubo',age:23,gender:'male'}));
//localStorage.clear();


if (!localStorage.getItem("camera")) {
    const cameraSystem = {

    }
    //console.log(camera);
}
//let camera = JSON.parse(localStorage.getItem("camera"));


/* 点击左上角返回按钮删除本页跳转主页面 */
back.addEventListener("click", function () {
    window.location.replace("./index.html");
});
/* 提取折叠展开设置 */
const setfolding = (index) => {
    /* 设置输入界面展示到列表中 */
    if (this.isShowDiv) {
        this.menuText = "";
    } else {
        switch (index) {
            case 0: this.menuText = details[index].querySelector("label>input").value; break;//列表第一项
            case 1:
                details[index].querySelectorAll("label>input").forEach((el, index, arr) => {//第二项
                    this.menuText += arr[0].checked && el.checked && index ? "[" + el.parentNode.innerText + "]" : "";//添加备注文本并判断添加日期是否选中,若选中将尾部日期信息添加到列表中
                });
                this.menuText = details[index].querySelector("label>input[type='text']").value + this.menuText;//最后将备注文本添加到列表文本前面;
                break;
            case 2:
                details[index].querySelectorAll(".showVideoSize>label>input").forEach((el, index, arr) => {//将分辨率添加到列表项中
                    this.menuText += index == 0 ? "[" + el.value + "×" : el.value + "]";
                });
                this.menuText += "[" + details[index].querySelector(".outImageSharp>.progress>p").innerText + "]";//添加图片清晰度
                this.menuText += "[" + details[index].querySelector(".outVideoSharp>.progress>p").innerText + "]";//添加视频流分辨率
                break;
            case 3: this.menuText = "网页版不支持"; break;
            case 4:
                let v = details[index].querySelector("select").options;//获取列表框中的列表项
                for (o of v) {
                    this.menuText += o.index < v.length - 1 ? o.innerText + "," : o.innerText;//将列表项的文本提取
                }
                this.menuText = "[" + this.menuText + "]";
                break;
            case 5:
                details[index].querySelectorAll("label>input[type='number']").forEach((el, index, arr) => {
                    this.menuText += el.value + " ";
                });
                break;
            case 6:
                this.menuText = `<input type='color' disabled value=${details[index].querySelector("label>input[type='color']").value}> `;
                this.menuText += details[index].querySelector("label>input[type='number']").value + "vw";
                break;
            case 7: details[index].querySelectorAll("label>input[type='radio']").forEach((el, index, arr) => {
                this.menuText += el.checked ? el.parentNode.innerText : "";
            });
                break;

        }
    }

    li[index].children[1].innerHTML = this.menuText;//将列表选项内容添加到列表项中

}


/* 点击列表右侧>号显示每条设置详情 */
rightSpan.forEach((el, index) => {
    el.addEventListener("click", function () {
        this.isShowDiv = this.isShowDiv ? false : true;//通过三元运算符变换同步是否打开
        details[index].style.display = this.isShowDiv ? "block" : "none";
        rightSpan[index].innerText = this.isShowDiv ? "∨" : ">";
        /* 设置输入界面展示到列表中 */
        if (this.isShowDiv) {
            this.menuText = "";
        } else {
            switch (index) {
                case 0: this.menuText = details[index].querySelector("label>input").value; break;//列表第一项
                case 1:
                    details[index].querySelectorAll("label>input").forEach((el, index, arr) => {//第二项
                        this.menuText += arr[0].checked && el.checked && index ? "[" + el.parentNode.innerText + "]" : "";//添加备注文本并判断添加日期是否选中,若选中将尾部日期信息添加到列表中
                    });
                    this.menuText = details[index].querySelector("label>input[type='text']").value + this.menuText;//最后将备注文本添加到列表文本前面;
                    break;
                case 2:
                    details[index].querySelectorAll(".showVideoSize>label>input").forEach((el, index, arr) => {//将分辨率添加到列表项中
                        this.menuText += index == 0 ? "[" + el.value + "×" : el.value + "]";
                    });
                    this.menuText += "[" + details[index].querySelector(".outImageSharp>.progress>p").innerText + "]";//添加图片清晰度
                    this.menuText += "[" + details[index].querySelector(".outVideoSharp>.progress>p").innerText + "]";//添加视频流分辨率
                    break;
                case 3: this.menuText = "网页版不支持"; break;
                case 4:
                    let v = details[index].querySelector("select").options;//获取列表框中的列表项
                    for (o of v) {
                        this.menuText += o.index < v.length - 1 ? o.innerText + "," : o.innerText;//将列表项的文本提取
                    }
                    this.menuText = "[" + this.menuText + "]";
                    break;
                case 5:
                    details[index].querySelectorAll("label>input[type='number']").forEach((el, index, arr) => {
                        this.menuText += el.value + " ";
                    });
                    break;
                case 6:
                    this.menuText = `<input type='color' disabled value=${details[index].querySelector("label>input[type='color']").value}> `;
                    this.menuText += details[index].querySelector("label>input[type='number']").value + "vw";
                    break;
                case 7: details[index].querySelectorAll("label>input[type='radio']").forEach((el, index, arr) => {
                    this.menuText += el.checked ? el.parentNode.innerText : "";
                });
                    break;

            }
        }

        li[index].children[1].innerHTML = this.menuText;//将列表选项内容添加到列表项中
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
setfolding()
addProgressEvent(outImageProgress);
addProgressEvent(outVideoProgress, "video");

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