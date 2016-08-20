// +----------------------------------------------------------------------
// | PeA-target ( https://github.com/pea3nut/PeA-target )
// +----------------------------------------------------------------------
// | Copyleft (c) 2016 http://pea.nutjs.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: 花生PeA <626954412@qq.com>
// +----------------------------------------------------------------------
// | Data: 2016-3-23
// +----------------------------------------------------------------------

(function(){
    //赋值对象
    jQuery.PeATarget ={
        "varsion":"1.2.1b"
    };
    //添加标识符
    window.PeA_nut =window.PeA_nut ||[];
    window.PeA_nut.push({"PeA-target":jQuery.PeATarget["varsion"]});
    //启动PeA-target
    jQuery.PeATarget.start =new Function();
    //关闭PeA-target
    jQuery.PeATarget.close =new Function();
    //将页面滚动到某个元素
    jQuery.PeATarget.scroll =new Function();
    //额外向下偏离的位置
    jQuery.PeATarget.deviation =160;
    //默认启动PeA-target
    jQuery(function(){
        with(jQuery.PeATarget){
            deviation && start();
        };
    });
})();
jQuery.PeATarget.start =function(){
    var PeATarget =this;
    jQuery(window).on('load',function(e){
        //阻止外链来锚点默认事件
        e.preventDefault();
        //根据URL锚点进行滚动
        PeATarget.scroll(document.URL);
    });
    jQuery(function(){
        //根据URL锚点进行滚动
        PeATarget.scroll(document.URL);
    });
    jQuery('body').delegate('a[href*="#"]',"click",function(e){
        //判断是否为本页面的锚点
        var nowUrl =document.URL.match(/^[^\?#]*/)[0];
        var targetUrl =this.href.match(/^[^\?#]*/)[0];
        if(nowUrl !==targetUrl) return;
        //阻止默认的锚点点击
        e.preventDefault();
        //滚动到指定元素
        PeATarget.scroll(this.href);
    })
};
jQuery.PeATarget.scroll =function(targetElt ,deviation){
    //支持动态的设置偏移量
    deviation =deviation ||this.deviation;
    //若传来的是一个string而不是element，则转换为element
    if(typeof targetElt === 'string' && targetElt.indexOf("#") !=-1){
        //通过URL获取对应的元素ID
        var targetId =targetElt.replace(/^.*#/,'');
        //解码URL
        targetId =decodeURI(targetId);
        //若ID存在则获取对应的元素
        if(targetId){
            targetElt =document.getElementById(targetId);
        }else{
            console.warn('PeA-target: targetId is "'+targetId+'"');
            return;
        };
        //若ID值未对应任何元素，则仅更新hash值
        if(!targetElt){
            console.warn('PeA-target: Not find Elt from "'+targetId+'"');
            location.hash =targetId;
            return;
        };
    };
    //若传来的是一个jQuery对象而不是element，则转换为element
    if(targetElt instanceof jQuery){
        targetElt =targetElt.get(0);
    };
    //检查是否是有ID的DOM节点
    if(targetElt instanceof Element && targetElt.id){
        //初始化URL的hash值
        location.hash =targetElt.id;
        //计算偏移量
        var targetScroll =parseInt(targetElt.offsetTop) -parseInt(deviation);
        //滚动到指定的偏移量
        window.scrollTo(0,targetScroll);
    };
};