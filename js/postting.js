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
    var dataUrl = canvas.toDataURL("image/jpeg", 0.2);//-----------------------------------------需要设置清晰度-----------------------------------------------------
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = "myTest.jpg";//-----------------------------------------------需要随着楼号及时间改名---------------------------------------------------
    link.click(); 
}