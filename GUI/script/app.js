window.COMP={/*组件列表*/};
window.VM={/*ViewModel列表*/};


$(function(){

Vue.directive("attr", {
    "update": function (newAttr) {
        var elt =$(this.el);
        for(var key in newAttr){
            elt.prop(key ,newAttr[key]);
        };
    },
});
Vue.config.debug =true;

var compRoot =Vue.extend({
    "template": function(){/*
        <div id="main">
            <router-view></router-view>
            <nutjs-alert v-ref:nutjs_alert></nutjs-alert>
            <nutjs-tools v-ref:nutjs_tools></user-check>
            <user-check v-ref:user_check></user-check>
        </div>
    */}.parseString(),
    "components":{
        "nutjs-alert":COMP["alert-basic"],
        "nutjs-tools":COMP["tools-basic"],
        "user-check":COMP["user-check"],
    },
    "ready":function(){
        window.VM=this.$refs;
    },
});

window.router = new VueRouter({
    "history":true,
});
router.alias({
    "/web/*path":"/md/web/:path",
    "/about/*path":"/md/about/:path",
});
router.map({
    "/":{
        "component":Vue.extend({
            "template": function(){/*
                <router-view></router-view>
            */}.parseString(),
            "route":{
                "data":function(transition){
                    VM['nutjs_tools'].$emit("urlChange");
                    if(this.$route.query.login ==1){
                        VM['user_check'].$emit("signin");
                    };
                    transition.next();
                },
            },
        }),
        "subRoutes":{
            "/static/*path":{
                "component" :{"route" :{"canActivate" :function(transition){
                    window.open(transition.to.path ,"_blank");
                    transition.abort();
                }}},
            },
            "/main":{
                "component":COMP["nutjs-main"],
            },
            "/member/signout":{
                "component":COMP["signout-basic"],
            },
            "/member/signup":{
                "component":{
                    "extends":COMP["member-basic"],
                    "route":{"data":function(transition){
                        if(transition.to.query.login !=1){
                            router.replace({"query":$.extend({} ,transition.to.query, {"login":1})});
                        }else{
                            transition.next();
                        };
                    }}
                },
            },
            "/member/changeinfo":{
                "component":COMP["member-basic"],
            },
            "/md/*path":{
                "component":COMP["md-basic"],
            },
        },
    },
});
router.start(compRoot, 'nutjs-app');
});



//函数定义
function getThat(list ,callback){
    var successNum =0;
    var data =new Array(list.length);
    for(var i=0 ;i<list.length ;i++){
        $.get(list[i] ,null ,
            (function(){
                var index=i;
                return function(reMsg){
                    data[index] =reMsg;
                    if(++successNum === list.length){
                        callback(data);
                    };
                }
            })(i)
        ,"text");
    };
};
function getRandomChar(lgth){
    var chars ='ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var randomStr =[];
    for(var i=0 ;i<lgth ;i++){
        randomStr.push(
            chars.charAt(
                Math.floor(
                    Math.random()
                    *chars.length
                )
            )
        )
    };
    return randomStr.join("");
};
Function.prototype.parseString =function(){
    var temp_arr =this.toString().split("\n");
    temp_arr.pop();
    temp_arr.shift();
    return temp_arr.join("\n");
};
(function(oldSerialize){
    jQuery.prototype.serialize =function(unsetEmptyField){
        if(unsetEmptyField){
            var str =oldSerialize.call(this);
            str =str.replace(/[\w\-]+=(&|$)/g ,'');
            str =str.replace(/&$/g ,'');
            return str;
        }else{
            return oldSerialize.call(this);
        };
    };
})(jQuery.prototype.serialize);
$.fn.extend({
    "showFiledError":function(){
        var css ="has-error has-feedback";
        var elt =$('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
        var par =this.parents(".form-group:first");
        par.addClass(css);
        this.after(elt);
        this.one("click" ,function(){
            par.removeClass(css);
            elt.remove();
        });
    },
    "showMsg":function(options){
        var styleClass ={
            "success"   :"alert alert-success",
            "info"      :"alert alert-info",
            "warning"   :"alert alert-warning",
            "danger"    :"alert alert-danger",
            "error"     :"alert alert-danger",
        }

        options =options ||{};
        options['style'] =options['style'] ||"danger";
        options['class'] =options['class'] ||styleClass[options['style']];
        options['times'] =options['times'] ||0;

        if(this.attr("show-msg-class") !== undefined){
            this.removeClass(this.attr("show-msg-class"));
            this.removeAttr("show-msg-class");
        };
        if(this.attr("show-msg-timer") !== undefined){
            clearTimeout(this.attr("show-msg-timer"));
            this.removeAttr("show-msg-timer");
        };

        this.html(options.msg);
        this.addClass(options['class']);
        this.show("normal");
        if(options['times'] !==0){
            var timer =setTimeout(function(elt){
                elt.hide("normal" ,function(){
                    $(this).removeClass(options['class']).removeAttr("show-msg-timer");
                });
            } ,options['times'] ,this);
            this.attr("show-msg-timer" ,""+timer);
        }else{
            if(this.attr("show-msg-class") !== undefined){
                this.attr("show-msg-class" ,this.attr("show-msg-class")+" "+options['class']);
            }else{
                this.attr("show-msg-class" ,options['class']);
            };
        };

    },
});
VueRouter.prototype.goDefault =function(path ,replace){
    var target =this._default_url ||path;
    delete this._default_url;
    replace ?this.replace(target) :this.go(target);
};
VueRouter.prototype.getThisPath =function(url){
    var exp =/^.+?\/\/.+?(\/.*)$/
    var path =url ||document.URL;
    return path.match(exp)[1];
};
VueRouter.prototype.trackThis =function(){
    this._default_url =this.getThisPath.apply(this ,arguments)
};


