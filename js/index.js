(function(){
    var enterAnimate=document.getElementById("enterAnimate");
    var IndexPage=document.getElementById("indexPage");
    var newsPage=document.getElementById("newsPage");
    var formPage=document.getElementById("formPage");
    /*警告信息显示与隐藏*/
    function warmingInfoShow(message,adress){
        var warmingInfo=adress.getElementsByClassName("warmingInfo")[0];
        warmingInfo.innerHTML="";
        warmingInfo.innerHTML=message;
        warmingInfo.style.opacity=1;
        warmingInfo.style.transform="scale(1)";
    }
    function warmingInfohidden(adress){
        var warmingInfo=adress.getElementsByClassName("warmingInfo")[0];
        warmingInfo.style.opacity=0;
        warmingInfo.style.transform="scale(0)";
    }
    /*判断是否可以提交,点亮提交按钮*/
    function iscanSubmit(conditions,adress){
        var Page_footer=adress.getElementsByClassName("Page_footer")[0];
        var submitBtn=Page_footer.getElementsByTagName("input")[0];
        if(conditions){
            submitBtn.className="btn canSubmit";
            warmingInfohidden(adress);
        }else {
            submitBtn.className="btn";
        }
        return true;
    }
    /*点亮标签，
    !!!!!!!indexPage中自动运行LabelChecked()此时conditions==false，
    然后直接传给iscanSubmit(conditions,adress);所以无法点亮提交按钮*/
    /*
     function LabelChecked(conditions,adress){
        var playLabel=adress.getElementsByClassName("playLabel")[0];
        var span=adress.getElementsByTagName("span");
        for(var i=0,len=span.length; i<len; i++){
            span[i].addEventListener("touchstart",function (e){
                e.target.previousElementSibling.checked=true;
                iscanSubmit(conditions,adress);
            })
        }
     }
     */
    function LabelChecked(isNeedScore,adress){
        var playLabel=adress.getElementsByClassName("playLabel")[0];
        var span=adress.getElementsByTagName("span");
        for(var i=0,len=span.length; i<len; i++){
            if(span[i].previousElementSibling.getAttribute("checked")){
                span[i].className="active";
            }
            span[i].addEventListener("touchstart",function (e){
                /*！！！
                不能使用checked=true，重新评分时状态会重置
                必须使用setAttribute("checked","checked")，保证重新评分时状态不会重置*/
                if(this.previousElementSibling.getAttribute("checked")){
                    this.previousElementSibling.removeAttribute("checked");
                    this.className="";
                }else{
                    this.previousElementSibling.setAttribute("checked","checked");
                    this.className="active";
                }
                /*！！！
                 * 是否需要判断是否评过分*/
                if(isNeedScore){
                    iscanSubmit(isLabelChecked(adress)&&isAllGetScore(),adress);
                }else{
                    iscanSubmit(isLabelChecked(adress),adress);
                }
            })
        }

    }
    function isLabelChecked(adress){
        var playLabeItem=adress.getElementsByClassName("playLabeItem");
        for(var i=0,len=playLabeItem.length; i<len; i++){
            /*！！！
            使用getAttribute获取状态*/
            if(playLabeItem[i].getAttribute("checked")){
                return true;
            }
        }
        return false;
    }
    /*检测数否打分*/
    function isAllGetScore(){
        var input_scores=document.getElementsByClassName("scores");
        for(var k=0,len=input_scores.length; k<len; k++){
            if(input_scores[k].value==0){
                return false;
            }
        }
        return true;
    }
    init();
    function init(){
        enteranimate();
    }
    function enteranimate(){
        var timer=null;
        function enterAnimate_transitionend(){
            clearTimeout(timer);
            enterAnimate.className="page";
            showIndexPage();
            indexPage();
        }
        enterAnimate.addEventListener("transitionend",enterAnimate_transitionend,false)
        enterAnimate.addEventListener("webkitTransitionEnd",enterAnimate_transitionend,false)
        timer=setTimeout(function (){
            enterAnimate.style.opacity=0;
        },3000);
        function showIndexPage(){
            IndexPage.style.opacity=1;
            IndexPage.className="pageShow";
        }
    }
    function indexPage(){
        /*轮播广告*/
        var bannerList=document.getElementsByClassName("bannerList")[0];
        Tmove(bannerList,false,true,false,true,true,false,false,false);
        /*打分区域*/
        var startS_ele=document.getElementsByClassName("starts");
        for(var k=0,len=startS_ele.length; k<len; k++){
            getScore(startS_ele[k]);
        }
        function getScore(ul){
            var start_ele=ul.getElementsByClassName("start");
            var input_scores=ul.getElementsByClassName("scores")[0];
            for(var i=0,len=start_ele.length; i<len; i++){
                start_ele[i].index=i;
                start_ele[i].addEventListener("touchstart",function (e){
                    for(var j=0,len=start_ele.length; j<len; j++){
                        if(j<=this.index){
                            start_ele[j].className="start getStart";
                        }else {
                            start_ele[j].className="start";
                        }
                    }
                    input_scores.value=this.index+1;
                    iscanSubmit(isLabelChecked(IndexPage)&&isAllGetScore(),IndexPage);
                },false)
            }
        }
        /*点亮标签*/
        LabelChecked(true,IndexPage);
        function maskThanks_transitionend(e){
            maskThanks.style.display="none";
            IndexPage.style.filter="blur(0)";
            newspage();
        }
        /*显示谢谢*/
        function ThanksShow(){
            maskThanks.style.display="block";
            setTimeout(function (){
                maskThanks.style.opacity=1;
            },50);
            IndexPage.style.filter="blur(5px)";
        }
        /*点击提交按钮提示警告信息*/
        var maskThanks=document.getElementsByClassName("maskThanks")[0];
        var Page_footer=IndexPage.getElementsByClassName("Page_footer")[0];
        var submitBtn=Page_footer.getElementsByTagName("input")[0];
        submitBtn.addEventListener("touchstart",function (e){
            if(!isAllGetScore()){
                warmingInfoShow("请景区打分!!!∑(ﾟДﾟノ)ノ",IndexPage);
            }else if(!isLabelChecked(IndexPage)){
                warmingInfoShow("请景区打标签!!!∑(ﾟДﾟノ)ノ",IndexPage);
            }else if(iscanSubmit(isAllGetScore()&&isLabelChecked(IndexPage),IndexPage)){
                ThanksShow();
                setTimeout(function (){
                    maskThanks.style.opacity=0;
                    IndexPage.className="page";
                    newsPage.className="pageShow";
                    maskThanks.addEventListener("transitionend",maskThanks_transitionend,false);
                    maskThanks.addEventListener("webkitTransitionEnd",maskThanks_transitionend,false);
                },1000);
            }
        })
    }
    function newspage() {
        var inputFileZoom= document.getElementsByClassName("inputFileZoom")[0];
        var photo = document.getElementsByClassName("photo")[0];
        var video=document.getElementsByClassName("video")[0];
        var photo_inputFile=inputFileZoom.getElementsByTagName("input")[0];
        var video_inputFile=inputFileZoom.getElementsByTagName("input")[1];
        var submitBtn=newsPage.getElementsByClassName("btn")[0];
        var hasPhoto=false;
        var hasVideo=false;
        /*！！！！
        重新评分后多次监听，导致连续触发click()事件*/
        if(!photo.hasTouchSatrt){
            photo.addEventListener("touchstart", function (e) {
                    photo_inputFile.click()
            },false)
            photo.hasTouchSatrt=true;
        }
        if(!video.hasTouchSatrt){
            video.addEventListener("touchstart", function (e) {
                video_inputFile.click()
            },false)
            video.hasTouchSatrt=true;
        }
        photo_inputFile.onchange=function () {
            /*防止第二次直接取消 typeof this.files[0]==="undefined" */
            if (typeof this.files[0] === "undefined" || this.files[0].type.split("/")[0] !== "image") {
                warmingInfoShow("请放入图片!!!∑(ﾟДﾟノ)ノ", newsPage);
                hasPhoto=false;
            } else {
                hasPhoto = true;
            }
            iscanSubmit(hasPhoto || hasVideo, newsPage);
        }
        video_inputFile.onchange=function (){
            /*防止第二次直接取消 typeof this.files[0]==="undefined" */
            if(typeof this.files[0]==="undefined"||this.files[0].type.split("/")[0]!=="video"){
                warmingInfoShow("请放入视频!!!∑(ﾟДﾟノ)ノ",newsPage);
                hasVideo=false;
            }else{
                hasVideo=true;
            }
            iscanSubmit(hasPhoto||hasVideo,newsPage);
        }
        function newsPage_transitionend(e) {
            console.log(hasPhoto,hasVideo);
            if (iscanSubmit(hasPhoto || hasVideo, newsPage)) {
                formPage.className = "pageShow";
                newsPage.className = "page";
                newsPage.style.opacity = 1;
                formpage();
            }
        }
        if(!submitBtn.touchstart) {
            submitBtn.addEventListener("touchstart", function (e) {
                if (iscanSubmit(hasPhoto || hasVideo, newsPage)) {
                    newsPage.style.opacity = 0;
                    if (!newsPage.transitionend) {
                        newsPage.addEventListener("transitionend", newsPage_transitionend, false);
                        newsPage.addEventListener("webkitTransitionEnd", newsPage_transitionend, false);
                        newsPage.transitionend = true;
                    }
                } else {
                    return;
                }
            })
            submitBtn.touchstart = true;
        }

    }
    function formpage(){
        LabelChecked(isLabelChecked(formPage),formPage);
        iscanSubmit(isLabelChecked(formPage), formPage);
        /*点击提交按钮提示警告信息*/
        var Page_footer=formPage.getElementsByClassName("Page_footer")[0];
        var submitBtn=Page_footer.getElementsByTagName("input")[0];
        function formPage_transitionend(e){
            reSubmitPage()
            formPage.className="page";
            formPage.style.opacity=1;
        }
        submitBtn.addEventListener("touchstart",function (e){
            if(!isLabelChecked(formPage)){
                warmingInfoShow("请视频打标签!!!∑(ﾟДﾟノ)ノ",formPage);
            }else if(iscanSubmit(isLabelChecked(formPage),formPage)){
                formPage.style.opacity=0;
                formPage.addEventListener("transitionend",formPage_transitionend,false);
                formPage.addEventListener("webkitTransitionEnd",formPage_transitionend,false);
            }
        })
    }
    function reSubmitPage(){
        var wuyiPlay=enterAnimate.getElementsByClassName("wuyiPlay")[0];
        wuyiPlay.style.backgroundImage="url(images/tranks2.png)";
        wuyiPlay.style.height=4.5+"rem";
        var cctvWelcome=enterAnimate.getElementsByClassName("cctvWelcome")[0];
        cctvWelcome.style.display="none";
        var Page_footer=enterAnimate.getElementsByClassName("Page_footer")[0];
        Page_footer.innerHTML='<p class="warmingInfo"></p><input type="button" class="btn" value="重新评分">';
        var shack=enterAnimate.getElementsByClassName("shack")[0];
        shack.style.top=-0.5+"rem";
        shack.style.left=10.75+"rem";
        enterAnimate.className="pageShow";
        enterAnimate.style.opacity=1;
        iscanSubmit(true,enterAnimate)
        var Page_footer=enterAnimate.getElementsByClassName("Page_footer")[0];
        var submitBtn=Page_footer.getElementsByTagName("input")[0];
        submitBtn.addEventListener("touchstart",function (e){
            IndexPage.className="pageShow";
            enterAnimate.className="page";
        })

    }
})();

