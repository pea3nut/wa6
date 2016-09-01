//# 组件定义
COMP["user-check"] =Vue.extend({
    "data":function(){return {
        "is_login":null,
        "state":null,
    }},
    "events":{
        "hook:created":function(onSuccess){
            var vm =this;
            $.get("/API/MemberControl/GetStatus" ,function(reMsg){
                vm.is_login =reMsg.is_login>0;
                vm.state =reMsg.state;
                onSuccess &&onSuccess();
                if(vm.state =='100'){
                    router.trackThis();
                    router.go('/member/signup');
                };
            });
        },
        "signin":function(onSuccess){

            var vm =this;

            //执行回调和队列回调
            if(this.is_login ===true){
                return true;
            }

            //等待created钩子初始化完毕
            if(this.is_login ===null){
                var unWatch =this.$watch("is_login" ,function(){
                    unWatch();
                    this.$emit("signin");
                });
                return;
            };

            var callbackUrl =location.protocol+"//"+location.host+"/qq_callback.html";
            var target ="https://graph.qq.com/oauth2.0/authorize?response_type=code"
                +"&client_id="+CONF['client_id']
                +"&redirect_uri="+encodeURI(callbackUrl)
                +"&state="+CONF['login_token']
            ;
            window.open(
                target
                ,"_blank"
                ,"height=600,width=1000,top=0,left=0,toolbar=no,menubar=no,scrollbars=auto,resizable=yes,location=no,status=no"
            );


            window.SIGNIN =function(data){
                if(data['token'] !== CONF['login_token']){
                    VM['nutjs_alert'].$emit("start" ,{
                        "msg":"错误：令牌不符！请求令牌为："+data['token'],
                        "user":vm,
                    });
                    return;
                };

                $.get("/API/MemberControl/SignInReal?token="+data['token']+"&code="+data['code'],function(reObj){
                    if(reObj['errcode'] === "0"){
                        VM['user_check'].$emit('hook:created' ,onSuccess);
                        delete window.SIGNIN;
                    }else{
                        VM['nutjs_alert'].$emit("start" ,{
                            "msg" :reObj['errcode']+"错误："+reObj['errmsg'],
                        });
                    };
                });
            };


        },
    }
})
COMP["modal-basic"] =Vue.extend({
    "data":function(){return {
        "modal_id":(function(){
            return 'modal-'+getRandomChar(8);
        })(),
        "task_list":[],
        "is_free":true,
        "user":NaN,
        "temp_fn":null,
    }},
    "computed":{
        "modalElt":function(){
            return $("#"+this.modal_id);
        },
    },
    "events":{
        /**
         * @param {Object} options 选项
         * - user 辨别多次调用的标识符
         * */
        "start":function(options){

            //允许多次调用
            if(this.is_free !==true){
                this.task_list.push(options);//添加队列
                return;
            };

            this.is_free =false;
            this.user =options.user;

            var vm =this;
            VM["nutjs_tools"].$emit("onceUrlChange" ,this.temp_fn =function(){
                vm.$emit("abort");
            });

        },
        "next":function(time){

            this.$emit("abort");
            if(this.task_list.length !==0){
                this.$emit("start" ,this.task_list.shift());
            }

        },
        "abort":function(){

            this.is_free =true;
            this.user =NaN;

            VM["nutjs_tools"].$emit("offUrlChange" ,this.temp_fn);
            this.temp_fn =null;


        },
    },
});
COMP["alert-simple"] ={
    "mixins":[COMP["modal-basic"]],
    "template":function(){/*
        <div class="modal bs-example-modal-sm" :id="modal_id">
            <div class="modal-dialog modal-sm" style="margin-top:100px">
                <div class="modal-content">
                    <div class="modal-body">
                        <p>{{{msg}}}</p>
                        <div class="text-right">
                            <button type="button" class="btn btn-info btn-sm" data-dismiss="modal">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    */}.parseString(),
    "data":function(){return {
        "msg":"",
    }},
    "events":{
        /**
         * @param {Object} options 选项
         * - callback 当窗口隐藏时的回调函数
         * - msg 提示信息
         * */
        "start":function(options){

            if(options.user !==this.user) return;

            //必要的初始化工作
            this.msg =options.msg ||"OK";
            this.callback =options.callback;
            this.modalElt.modal('show');

            //绑定隐藏事件
            var vm =this;
            this.modalElt.one('hidden.bs.modal', function(){
                vm.callback &&vm.callback();
                vm.callback =null;
                vm.$emit("next");
            });

        },
        "end":function(caller){
            if(caller ===this.user){
                this.$emit("abort");
            }else if(!Number.isNaN(caller)){
                for(var i=0 ;i<this.task_list.length ;i++){
                    if(this.task_list[i].user ===caller){
                        this.task_list[i].callback &&this.task_list[i].callback();
                        this.task_list.splice(i,1);
                        return;
                    };
                };
                console.warn("alert-simple::end未找到标识符：");
                console.warn(caller);
            };
        },
        "abort":function(){
            this.modalElt.modal('hide');
        },
    },
};
COMP["alert-cmd"] ={
    "mixins":[COMP["modal-basic"]],
    "template":function(){/*
        <div class="modal fade alert-basic-modal" :id="modal_id">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <p v-for="msg of msg_list" track-by="$index">&gt; {{{msg}}}</p>
                    </div>
                </div>
            </div>
        </div>
    */}.parseString(),
    "data":function(){return {
        "msg_list":["开始执行任务"],
        "timer":null,
    }},
    "events":{
        /**
         * @param {Object} options 选项
         * - callback 当窗口隐藏时的回调函数
         * */
        "start":function(options){

            if(options.user !==this.user) return;

            //必要的初始化工作
            this.msg_list=new Array();
            this.modalElt.modal('show');


            $.extend(this ,options);


            //绑定隐藏事件
            var vm =this;
            this.modalElt.one('hidden.bs.modal', function () {
                vm.callback &&vm.callback();
                vm.callback =null;
                vm.$emit("next");
            });

        },
        /**
         * @param {mixed} user 标识符
         * @param {String} ...msg 要添加的信息
         * */
        "add":function(){
            var argn =[];
            Array.prototype.push.apply(argn ,arguments);
            var caller =argn.shift();
            if(caller ===this.user){
                Array.prototype.push.apply(this.msg_list ,argn);
            }else{
                for(var i=0 ;i<this.task_list.length ;i++){
                    if(this.task_list[i].user ===caller){
                        if(this.task_list[i].msg_list instanceof Array){
                            Array.prototype.push.apply(this.task_list[i].msg_list ,argn);
                        }else{
                            this.task_list[i].msg_list =argn;
                        };
                        return;
                    };
                };
                console.warn("add未找到标识符：");
                console.warn(caller);
                console.warn("丢弃"+argn);
            };
        },
        "end":function(caller ,time){
            if(caller ===this.user){
                var obj =this.user;
                this.timer =setTimeout(function(vm){
                    vm.user===obj &&vm.$emit("abort");
                } ,time ,this);
            }else if(!Number.isNaN(caller)){
                for(var i=0 ;i<this.task_list.length ;i++){
                    if(this.task_list[i].user ===caller){
                        this.task_list[i].callback &&this.task_list[i].callback();
                        this.task_list.splice(i,1);
                        return;
                    };
                }
                console.warn("alert-cmd::end未找到标识符：");
                console.warn(caller);
            };
        },
        "abort":function(){
            clearTimeout(this.timer);
            this.timer=null;
            this.modalElt.modal('hide');
        },
    },
};
COMP["confirm-basic"] ={
    "mixins":[COMP["modal-basic"]],
    "template":function(){/*
        <div class="modal fade bs-example-modal-sm" :id="modal_id">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="no" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{{title}}}</h4>
                    </div>
                    <div class="modal-body">
                        <p>{{{msg}}}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="no">取消</button>
                        <button type="button" class="btn btn-success" @click="ok">确定</button>
                    </div>
                </div>
            </div>
        </div>
    */}.parseString(),
    "data":function(){return {
        "msg":"",
        "title":"",
    }},
    "methods":{
        "ok":function(){
            this.$emit("end" ,this.user ,true);
        },
        "no":function(){
            this.$emit("end" ,this.user ,false);
        },
    },
    "events":{
        /**
         * @param {Object} options 选项
         * - callback 当窗口隐藏时的回调函数，回调是会携带一个bool参数
         * - msg 提示信息
         * */
        "start":function(options){

            if(options.user !==this.user) return;

            //必要的初始化工作
            this.msg =options.msg ||"请确认你的操作";
            this.title =options.title ||"你的确定要这么做吗？";
            this.callback =options.callback;
            this.modalElt.modal('show');


            //绑定隐藏事件
            var vm =this;
            this.modalElt.one('hidden.bs.modal', function(){
                vm.$emit("next");
            });

        },
        "end":function(caller ,res){
            if(caller ===this.user){
                this.callback &&this.callback(res);
                this.callback =null;
                this.$emit("abort");
            }else if(!Number.isNaN(caller)){
                for(var i=0 ;i<this.task_list.length ;i++){
                    if(this.task_list[i].user ===caller){
                        this.task_list[i].callback(res);
                        this.task_list.splice(i,1);
                        return;
                    };
                }
                console.warn("end未找到标识符：");
                console.warn(caller);
            };
        },
        "abort":function(){
            this.callback &&this.callback(res);
            this.callback =null;
            this.modalElt.modal('hide');
        },
    },
};
COMP["tools-basic"] =Vue.extend({
    "data":function(){return {
        "urlChangeEvents":new Array(),
        "urlChangeEventsOne":new Array(),
    }},
    "events":{
        "onUrlChange":function(fn){
            this.urlChangeEvents.push(fn);
        },
        "onceUrlChange":function(fn){
            this.urlChangeEventsOne.push(fn);
        },
        "offUrlChange":function(fn){
            this.urlChangeEvents.$remove(fn);
            this.urlChangeEventsOne.$remove(fn);
        },
        "urlChange":function(fn){
            for(var i=0 ;i <this.urlChangeEvents.length ;i++){
                this.urlChangeEvents[i]();
            };
            for(var i=0 ;i <this.urlChangeEventsOne.length ;i++){
                this.urlChangeEventsOne[i]();
            };
            this.urlChangeEventsOne =new Array();
        },

    },
});

//无依赖
COMP["show-basic"] =Vue.extend({
    "template":function(){/*
        <div class="alert alert-info alert-dismissible container show-basic" role="alert">
            <button @click="offEvent" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <strong>Note: </strong>{{{phrase[index]}}}
        </div>
    */}.parseString(),
    "data":function(){return {
        "phrase":[
            "理论上，你点击页面的任何链接都不会导致页面重新刷新。这，就是单页应用的魅力！",
            "搭建这个网站我们用了十种以上的开源库，这也是为什么我们坚持投身开源运动",
            "Vue.js非常好用，但不支持IE8，因此这个网站也是不支持IE8及其以下",
            "我们为了手机用户做了大量的优化，因此你在手机看到大部分的页面也将是正常的",
            "网站底部的版权不是Cotyright而是Copyleft，这意味着你可以自由的使用本网站的所有内容",
            "Nutjs团队是Web开发协会的运营支持团队，二者都是非盈利的",
            "网站Logo中的“e”代表着大家熟悉的IE浏览器，同时也是enthusiasm（热情）的首字母",
            "网站后端是由PHP语言驱动的，不过前端却可以完全不依赖它独立运行，这非常酷",
            "或许你已经猜到了，wa6是Web开发协会官网第六次重构的版本",
            '你可以通过<a href="http://github.com/pea3nut/wa6" target="_blank">Github</a>来获取这个网站的源码并实时掌握网站的更新情况'
        ],
        "index":null,
    }},
    "methods":{
        "randomIndex":function(){
            this.index =Math.floor(Math.random()*this.phrase.length);
        },
        "offEvent":function(){
            VM['nutjs_tools'].$emit("offUrlChange" ,this.randomIndex);
        },
    },
    "ready":function(){
        var vm =this;
        VM['nutjs_tools'].$emit("onUrlChange" ,vm.randomIndex =function(){
            vm.index =Math.floor(Math.random()*vm.phrase.length);
        });

        this.randomIndex();

    },
    "beforeDestroy":function(){
        this.offEvent();
    },
});
COMP["main-basic"] =Vue.extend({
    "template":function(){/*
        <div id="carousel-example-generic" class="carousel slide container main-basic-carousel" data-ride="carousel">
            <!-- Indicators -->
            <ol class="carousel-indicators">
                <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                <li data-target="#carousel-example-generic" data-slide-to="2"></li>
            </ol>

            <!-- Wrapper for slides -->
            <div class="carousel-inner" role="listbox">
                <div class="item active">
                    <img src="/image/carousel-1.jpg">
                </div>
                <div class="item">
                    <img src="/image/carousel-2.jpg">
                </div>
                <div class="item">
                    <a target="_blank" href="https://github.com/pea3nut/wa6"><img src="/image/carousel-3.jpg"></a>
                </div>
            </div>

            <!-- Controls -->
            <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>

        <main-body></main-body>
    */}.parseString(),
    "created":function(){
        $("body").addClass("bg-gray01");
    },
    "components":{
        "main-body":function(resolve){
            $.get("/GUI/tpl/main-body.html" ,function(reMsg){
                var comp =Vue.extend({
                    "template":reMsg,
                });
                resolve(comp);
            });
        }
    },
    "beforeDestroy":function(){
        $("body").removeClass("bg-gray01");
    },
});
COMP["nav-basic"] =function(resolve){
    getThat([
        "/tpl/nav-basic.html",
        "/tpl/nav-basic.json"
    ],function(reMsg){
        var comp =Vue.extend({
            "template":reMsg[0],
            "data": function(){
                return {
                    "list":JSON.parse(reMsg[1]),
                    "icon_text":CONF['icon_text'],
                    "icon":["book","briefcase"]
                };
            },
            "methods":{
                "signin":function(){
                    VM['user_check'].$emit("signin");
                },
            },
            "computed":{
                "is_login":function(){
                    var table =['000','100']
                    return VM['user_check'].is_login && ( table.indexOf(VM['user_check'].state) == '-1');
                },
            },
        });
        resolve(comp);
    });
};
COMP["foot-basic"] =function(resolve){
    $.get("/tpl/foot-basic.html",function(reMsg){
        var comp =Vue.extend({
            "template":reMsg
        });
        resolve(comp);
    });
};
COMP["markdown-body"] =Vue.extend({
    "template":function(){/*
        <article
            class="container markdown-body"
            v-html="markdown | marked"
        >
        </article>
    */}.parseString(),
    "props":["markdown"],
    "filters": {
        "marked": marked
    },
    "created":function(){
        $("body").addClass("bg-star01");
        this.$watch("markdown" ,function(){

            setTimeout(function(){
                //增加索引
                var pea =new jQuery.PeAIndex(3);
                pea.addPrefix=true;
                pea.prefix =pea.prefixTpl.zhTier;
                pea.index();
                //提高用户体验
                $(".markdown-body a").prop("target" ,"_blank");
                $(".markdown-body img").addClass("img-responsive");
                document.title =$("h1").html()+" - Web开发协会";
            },0);

        });
    },
    "beforeDestroy":function(){
        $("body").removeClass("bg-star01");
    },
});
COMP["input-basic"] =Vue.extend({
    "template":function(){/*
        <label for="name" class="col-sm-3 control-label">{{info.label}}</label>
        <div class="col-sm-8">
            <input class="form-control" v-attr="info.attribute" />
        </div>
    */}.parseString(),
    "props":["info"],
    "data":function(){return {
    }}
});
COMP["radio-basic"] =Vue.extend({
    "template":function(){/*
        <label for="name" class="col-sm-3 control-label">{{info.label}}</label>
        <div class="col-sm-8">
            <label class="radio-inline col-xs-3 col-sm-2" v-for="radioInfo of info.el">
                <input v-attr="radioInfo.attribute" type="radio">{{radioInfo.label}}
            </label>
        </div>
    */}.parseString(),
    "props":["info"],
    "data":function(){return {
    }}
});
COMP["signout-basic"] =Vue.extend({
    "route":{
        "canActivate":function(transition){
            transition.abort();
            var that =this;
            var reqUrl ="/API/MemberControl/SignOut";
            VM['nutjs_cmd'].$emit("start" ,{
                "msg_list":["初始化队列"],
                "user":this,
            });
            VM['nutjs_cmd'].$emit("add" ,this ,"向服务器发送注销请求求","请求地址为："+reqUrl,"&nbsp;","等待响应中...");
            $.get(reqUrl ,function(reMsg){
                VM['user_check'].$emit('hook:created');
                VM['nutjs_cmd'].$emit("add" ,that ,"&nbsp;" ,"注销成功");
                VM['nutjs_cmd'].$emit("end" ,that ,800);
                $.getJSON("/API/MemberControl/SignIn" ,function(reObj){
                    CONF['login_token'] =reObj['token'];
                });
            });
        },
    },
});

//有依赖
COMP["basic-frame"] =Vue.extend({
    "template":function(){/*
        <nutjs-nav></nutjs-nav>
        <nutjs-show></nutjs-show>
        <slot></slot>
        <nutjs-foot></nutjs-foot>
    */}.parseString(),
    "components":{
        "nutjs-nav":COMP['nav-basic'],
        "nutjs-foot":COMP['foot-basic'],
        "nutjs-show":COMP['show-basic'],
    },
});
COMP["form-basic"] =function(resolve){
    var vm =this;
    getThat({
        "tpl"   :"/tpl/form-basic.html",
        "field" :"/tpl/form-basic.json"
    },function(reMsg){
        var comp =Vue.extend({
            "template":reMsg['tpl'],
            "props":["action","success"],
            "data":function(){return {
                "form":_parse(reMsg['field']),
                "sign":null,
            }},
            "methods":{
                "sendAjax":function(){
                    var fm =$("#_fb_from");
                    $.ajax({
                        "type"  :fm.prop("method"),
                        "url"   :fm.prop("action"),
                        "data"  :fm.serialize(true),
                        "context":this,
                        "success":function(reObj){
                            switch(reObj['errcode']){
                                case 0:
                                    this.success &&this.success();
                                    break;
                                case 401:
                                    VM['user_check'].$emit("signin");
                                    break;
                                case 402:
                                    fm.find("[name='"+reObj['field']+"']").showFiledError();
                                    this.sign.showMsg({
                                        "style":"error",
                                        "msg":reObj['errmsg'],
                                    });
                                    break;
                                case 403:
                                case 404:
                                    this.sign.showMsg({
                                        "style":"error",
                                        "msg":"错误："+reObj['errmsg'],
                                    });
                                    break;
                            }
                        },
                    });
                },
            },
            "computed":{
                "formField":function(){return this.form[this.action]},
            },
            "components":{
                "form-input":COMP['input-basic'],
                "form-radio":COMP['radio-basic'],
            },
            "ready":function(){
                this.sign =$("#_fb_from").find("#_fb_showmsg");
            },
            "events":{
                "loadField":function(data){
                    for(var $name in data){
                        var elt =$("[name='"+$name+"']");
                        if(elt.length ==1){
                            elt.val(data[$name]);
                        }else{
                            elt.filter("[value='"+data[$name]+"']").prop("checked" ,true);
                        };
                    }
                },
            }
        });
        resolve(comp);
    });

    function _parse(jsonStr){
        var json =JSON.parse(jsonStr);
        for(var action in json){
            if('same_as' in json[action]){
                //获取alias对象
                var alias;
                var same_as=json[action]['same_as'];
                delete json[action]['same_as'];
                same_as =same_as.split('.');
                for(var i=0 ;i<same_as.length ;i++){
                    alias =json[same_as[i]];
                };
                alias =JSON.parse(JSON.stringify(alias));
                json[action] =$.extend(alias ,json[action]);
            };
        };
        return json
    };

};
COMP["signup-basic"] =Vue.extend({
    "template":function(){/*
        <nutjs-frame>
            <from-basic action="signup" :success="success" v-ref:from></from-basic>
        </nutjs-frame>
    */}.parseString(),
    "components":{
        "nutjs-frame":COMP['basic-frame'],
        "from-basic":COMP["form-basic"],
    },
    "methods":{
        "success":function(){
            router.goDefault('/main' ,true);
            VM['user_check'].$emit('hook:created');
        },
    },
    "events":{
        "hook:attached":function(){
            var vm =this;


            if(VM['user_check'].is_login ===null){
                var unWatch =VM['user_check'].$watch("is_login" ,function(){
                    unWatch();
                    vm.$emit("hook:attached");
                });
                return;
            };


            if(VM['user_check'].is_login !==true){
                VM['nutjs_alert'].$emit("start",{
                    "user":this,
                    "msg":"请先登录",
                });
                VM['user_check'].$emit("signin" ,function(){
                    VM['nutjs_alert'].$emit("end" ,vm);
                    vm.$emit("hook:attached");
                });
                return;
            };

            if(VM['user_check'].state !=="100"){
                VM['nutjs_alert'].$emit("start" ,{
                    "msg":"本账号可以正常使用，无需注册",
                    "user":this,
                });
                return;
            };

            VM['nutjs_cmd'].$emit("start" ,{
                "msg":"拉取QQ信息中...",
                "user":this,
            });
            $.getJSON("/API/MemberControl/GetQQInfo" ,function(reObj){
                vm.$broadcast("loadField" ,{
                    "gender":reObj['gender'] =="女"?2:1,
                    "nickname":reObj['nickname'],
                });
                VM['nutjs_cmd'].$emit("end" ,vm);
            });
        },
    },
    "beforeDestroy":function(){
        if(VM['nutjs_alert'].user ===this){
            VM['nutjs_alert'].$emit("abort");
        };
    },
});
COMP["changeinfo-basic"] =Vue.extend({
    "template":function(){/*
        <nutjs-frame>
            <from-basic action="changeinfo" :success="success" v-ref:from></from-basic>
        </nutjs-frame>
    */}.parseString(),
    "components":{
        "nutjs-frame":COMP['basic-frame'],
        "from-basic":COMP["form-basic"],
    },
    "methods":{
        "success":function(){console.log("signup-basic success");
            this.$refs['from'].sign.showMsg({
                "style":"success",
                "msg":"修改成功",
                "times":2000,
            });
        },
    },
    "events":{
        "hook:attached":function(){
            var vm =this;
            VM['nutjs_cmd'].$emit("start" ,{
                "msg_list" :["拉取信息中..."],
                "user" :vm,
            });
            $.get("/API/MemberControl/GetInfo" ,function(reObj){
                $(function(){vm.$refs['from'].$emit("loadField" ,reObj)});
                VM['nutjs_cmd'].$emit("end" ,vm);
            });
        },
    },
    "beforeDestroy":function(){
        if(VM['nutjs_alert'].user ===this){
            VM['nutjs_alert'].$emit("abort");
        };
    },
});
COMP["nutjs-main"] =Vue.extend({
    "template":function(){/*
        <nutjs-frame>
            <nutjs-index></nutjs-index>
        </nutjs-frame>
    */}.parseString(),
    "components":{
        "nutjs-frame":COMP['basic-frame'],
        "nutjs-index":COMP['main-basic'],
    }
});
COMP["md-basic"] =Vue.extend({
    "template":function(){/*
        <nutjs-frame>
            <nutjs-md :markdown="md_file"></nutjs-md>
        </nutjs-frame>
    */}.parseString(),
    "components":{
        "nutjs-frame":COMP['basic-frame'],
        "nutjs-md":COMP['markdown-body'],
    },
    "data":function(){return {
        "md_file":"加载md文件中...",
        "cache":{},
    }},
    "route":{
        "data":function(transition){

            if(this.cache[this.$route.params.path]){
                this.md_file =this.cache[this.$route.params.path];
                return;
            };


            var vm =this;
            vm.md_file="加载md文件中...";
            $.get("/API/MarkMaster/get/"+vm.$route.params.path,function(reMsg){
                vm.md_file =vm.cache[vm.$route.params.path] =reMsg;
                transition.next();
            });

        },
    },
});
COMP["member-basic"] =Vue.extend({
    "template":function(){/*
        <nutjs-frame>
            <nutjs-form :action="act"></nutjs-form>
        </nutjs-frame>
    */}.parseString(),
    "data":function(){return {
    }},
    "computed":{
        "act":function(){return this.$route.path.match(/.+\/(\w+)/)[1]},
    },
    "components":{
        "nutjs-frame":COMP['basic-frame'],
        "nutjs-form":COMP['form-basic'],
    }
});
COMP["profit-basic"] =Vue.extend({
    "template":function(){/*
        <nutjs-frame>
            <nutjs-profit :data="user_info"></nutjs-profit>
        </nutjs-frame>
    */}.parseString(),
    "data":function(){return {
        "nameMap":{
            'id':"用户编号",
            'nickname':"昵称",
            'realname':"真实姓名",
            'gender':"性别",
            'phone':"手机号",
            'wechat':"微信号",
            'create_time':"注册时间"
        },
        "valueMap":{
            "gender":function(val){
                if(val ==2)
                    return "女";
                else
                    return "男";
            },
        },
        "user_info":{},
    }},
    "ready":function(){
        var vm =this;
        $.get("/API/MemberControl/GetInfo" ,function(reObj){
            for(var key in reObj){
                if(key in vm.valueMap){
                    reObj[key] =vm.valueMap[key](reObj[key]);
                };
                if(key in vm.nameMap){
                    reObj[vm.nameMap[key]] =reObj[key];
                    delete reObj[key];
                };
            };
            vm.user_info =reObj;
        });
    },
    "components":{
        "nutjs-frame":COMP['basic-frame'],
        "nutjs-profit":function(resolve){

            var comp =Vue.extend({
                "template":function(){/*
                    <div class="container my-body">
                        <div class="col-xs-12 col-sm-9 col-md-6 center-block" style="float: none;">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h1 class="panel-title">个人信息查看</h1>
                                </div>
                                <ul class="list-group panel-body">
                                    <li class="list-group-item" v-for="(key ,value) of data">
                                        <label for="name" class="col-sm-3 control-label">{{key}}</label>
                                        <div class="col-sm-8">
                                            {{value}}
                                        </div>
                                        <div class="clearfix"></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                */}.parseString(),
                "props":['data']
            });

            resolve(comp);


        },
    }
});





