var time =null;

function changwidth(){
    var sli = $(".pane-item .page-3 .border-round section");

    console.log($(".page-3-bg").hasClass("current"));
    if($(".page-3-bg").hasClass("current")){
        var w_arr = [];
        for(var i = 0; i < sli.length; i++ ){
            var width = 55 + Math.random()*45;
            var speed = 3 + Math.random()*7;
            w_arr.push(width);
            sli.eq(i).css({"width":width + "%","left":(100-width)/2 + "%","animationDuration":speed + "s"});

        }
        /*time = setInterval(function(){
            for( var j = 0; j <sli.length; j++){
                if(w_arr[j]+1 > 100){
                    w_arr[j] = w_arr[j]-1;
                    sli.eq(j).css({"width":w_arr[j] + "%"});
                }else{
                    if(w_arr[j]-1 < 50){
                        w_arr[j] = w_arr[j]+1;
                        sli.eq(j).css({"width":w_arr[j] + "%"});
                    }else{
                        w_arr[j] = w_arr[j]-1;
                        sli.eq(j).css({"width":w_arr[j] + "%"});
                    }
                }

            }
        },60);*/
    }
}

function dirProp(direction, hProp, vProp) {
    return (direction & Hammer.DIRECTION_HORIZONTAL) ? hProp : vProp
}

function HammerCarousel(container, direction) {
    this.container = container;
    this.direction = direction;

    this.panes = Array.prototype.slice.call(this.container.children, 0);
    this.containerSize = this.container[dirProp(direction, 'offsetWidth', 'offsetHeight')];

    this.currentIndex = 0;
    this.end = false;

    this.hammer = new Hammer.Manager(this.container);
    this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
    this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));

    this.show(this.currentIndex);

}


HammerCarousel.prototype = {

    show: function(showIndex, percent, animate){
        showIndex = Math.max(0, Math.min(showIndex, this.panes.length - 1));
        percent = percent || 0;

        var className = this.container.className;
        if(animate) {
            if(className.indexOf('animate') === -1) {
                this.container.className += ' animate';
            }
        } else {
            if(className.indexOf('animate') !== -1) {
                this.container.className = className.replace('animate', '').trim();
            }
        }

        var paneIndex, pos, translate;
        for (paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
            pos = (this.containerSize / 100) * (((paneIndex - showIndex) * 100) + percent);
            if(this.direction & Hammer.DIRECTION_HORIZONTAL) {
                //translate = 'translate3d(' + pos + 'px, 0, 0)';
            } else {
                translate = 'translate3d(0, ' + pos + 'px, 0)'
            }
            this.panes[paneIndex].style.transform = translate;
            this.panes[paneIndex].style.mozTransform = translate;
            this.panes[paneIndex].style.webkitTransform = translate;
        }

        this.currentIndex = showIndex;

    },
    setIndex:function(index){
        this.currentIndex = index;

    },
    onPan : function (ev) {
        if(ev.direction == 16 && this.currentIndex == 0 ) return;
        if(ev.direction == 8 && this.currentIndex == this.panes.length-1 ) return;

        var delta = dirProp(this.direction, ev.deltaX, ev.deltaY);
        var percent = (100 / this.containerSize) * delta;
        var animate = false;

        if (ev.type == 'panend' || ev.type == 'pancancel') {
            if (Math.abs(percent) > 10 && ev.type == 'panend') {
                this.currentIndex += (percent < 0) ? 1 : -1;
            }
            percent = 0;
            animate = true;
        }

        this.show(this.currentIndex, percent, animate);
        //add
        /*       var downTop = Math.abs(delta*1.5);
         var downBlock = $(".download-block");
         downBlock.css({"bottom":70-downTop+"px"});*/
        if(ev.isFinal){
            var arrow = $(".arrow-tips");
            $(".panes .pane-item").removeClass("current").removeClass("reset-current").eq(this.currentIndex).addClass("current");
            if(this.currentIndex == this.panes.length - 1){
                arrow.hide();
            }else{
                arrow.show();
            }
            /* if($h > 440){
             downBlock.animate({"bottom":"70px"},400);
             }else{
             downBlock.animate({"bottom":"40px"},400);
             }*/
        }
    }
};
var main;
// var outer = new HammerCarousel(document.querySelector(".panes.wrapper"), Hammer.DIRECTION_HORIZONTAL);
Hammer.each(document.querySelectorAll(".pane .panes"), function(container) {
    main = new HammerCarousel(container, Hammer.DIRECTION_VERTICAL);

});

$(function(){
   // var $h = $(window).height();
    //var $w = $(window).width()
    //下载
/*    var plat;
    function download(){
        $.post("http://www.test.iaround.com/ad/analysis/logDownloadRecord.do",{plat:plat,appVersion:"6.0.0"},function(json){
            console.log(json)
            window.location = json.data;
        },"json");
    }*/
    var ua = navigator.userAgent;

    var android = ua.match(/(Android)\s+([\d.]+)/),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    var downloadbtn = $(".download-btn");

    if (android) {
        downloadbtn.text("Android下载");
    }else if(iphone){
        downloadbtn.text("iOS下载");
    }

    //点击
    var paneIndex, pos, translate,showIndex;
   $(".arrow-tips").on("tap",function(){
       var panes = document.querySelectorAll("#panes .pane");
       var $panes =  $("#panes .pane");
       showIndex = $panes.index(".current");
       if(showIndex != $panes.length-1){
           $panes.removeClass("current").removeClass("reset-current").eq(showIndex+1).addClass("current");
           var containerSize = $panes.height();
           for (paneIndex = 0; paneIndex < $panes.length; paneIndex++) {
               pos = (containerSize / 100) * (((paneIndex - (showIndex+1)) * 100));
               translate = 'translate3d(0, ' + pos + 'px, 0)'
               panes[paneIndex].style.transform = translate;
               panes[paneIndex].style.mozTransform = translate;
               panes[paneIndex].style.webkitTransform = translate;
           }
       }
       if(showIndex != $panes.length-2){
           $(this).show();
       }else{
           $(this).hide();
       }
       main.setIndex(showIndex+1);

   })
    //第三页重播
    $(document).on("tap",".reset",function(){
        var $panes =  $("#panes .pane");
        var showIndex = 2;
        var html = $panes.eq(showIndex).html();
        $panes.eq(showIndex).empty().append(html).removeClass("current").addClass("reset-current");
    });

    // 横屏提示
    onorientationchange();
    function onorientationchange() {
        var webkit = function() {
            //浏览器特有css样式的
            var css3_div = document.createElement("div");
            css3_div.style.cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
            if (css3_div.style.webkitTransition) {
                return '-webkit-';
            } else if (css3_div.style.mozTransition) {
                return '-moz-';
            } else if (css3_div.style.oTransition) {
                return '-o-';
            } else if (css3_div.style.msTransition) {
                return '-ms-';
            } else {
                return '';
            }
        }();

        //横屏警告
        var warn = function() {
            var _warn = document.createElement("div"),
                _warn_wrp = document.createElement('div');
            _warn_wrp.style.cssText = 'position:absolute; width:200%; height:200%; overflow:hidden; left:0; top:0; z-index:9999; background-color:#e3556a; display:none;',
                _warn.style.cssText = 'position:absolute; left:25%; top:25%; width:250px; height:150px; margin:-75px 0 0 -125px; text-align:center; color:#ffffff;';
            document.body.appendChild(_warn_wrp),
                _warn_wrp.appendChild(_warn);
            var _warn_text = document.createTextNode('为了更好的体验，请使用竖屏浏览');
            _warn.appendChild(document.createElement('br')),
                _warn.appendChild(_warn_text);

            var setCssText = function(wrp, icon, text) {
                //设置warn的样式
                if (typeof(wrp) == 'string') _warn.style.cssText = wrp;
                if (typeof(text) == 'string') _warn_text.nodeValue = text;
            }
            var show = function() {
                _warn_wrp.style.display = 'block';
            }
            var hide = function() {
                _warn_wrp.style.display = 'none';
            }

            return {
                show: show,
                hide: hide,
                setCssText: setCssText
            };
        }();

        var need_watch = 'onorientationchange' in window;
        var clientHeight = document.documentElement.clientHeight,
            clientWidth = document.documentElement.clientWidth;
        if (need_watch) {
            if (window.orientation != '0') warn.show();
            window.addEventListener('orientationchange', function() {
                if (window.orientation != '0') {
                    warn.show();
                } else {
                    warn.hide();
                }
            }, false);
        } else {
            if (clientHeight < clientWidth) warn.show();
        }
        //监听窗口变化
        window.addEventListener('resize', function() {

            clientHeight = document.documentElement.clientHeight, clientWidth = document.documentElement.clientWidth;

            if (!need_watch) { //没办监听orientationchange，用resize代替
                if (clientHeight < clientWidth) {
                    warn.show();
                } else {
                    warn.hide();
                }
            }
        }, false);
    }


})