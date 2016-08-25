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
                    router.trackThis(document.URL.replace(/[\?|&]login=1/ ,''));
                    router.go('/member/signup');
                };
            });
        },
        "signin":function(callback){
            if(this.is_login ===true) return;
            if(this.is_login ===null){
                var unWatch =this.$watch("is_login" ,function(){
                    this.$emit("signin");
                    unWatch();
                });
                return;
            };
            var that =this;
            var callbackUrl =location.protocol+"//"+location.host+"/qq_callback.html";
            var reqUrl ="/API/MemberControl/SignIn";

            VM['nutjs_alert'].$emit("refresh");
            VM['nutjs_alert'].$emit("start" ,"初始化队列" ,function(){
                var exp =/[\?|&]login=1/;
                router.replace(router.getThisPath().replace(exp ,"") ,true);
            });
            VM['nutjs_alert'].$emit("add" ,"开始服务器请求","请求地址为："+reqUrl,"&nbsp;","等待响应中...");

            $.get(reqUrl ,function(reMsg){
                VM['nutjs_alert'].$emit("add" ,"&nbsp;" ,"服务器返回令牌："+reMsg['token'] ,"打开登陆链接");
                window.open(
                    "https://graph.qq.com/oauth2.0/authorize?response_type=code"
                        +"&client_id="+CONF['client_id']
                        +"&redirect_uri="+encodeURIComponent(callbackUrl)
                        +"&state="
                        +reMsg['token']
                    ,"_blank" ,"height=600,width=1000,top=0,left=0,toolbar=no,menubar=no,scrollbars=auto,resizable=yes,location=no,status=no"
                );

                window.SIGNIN =function(data){
                    if(data['token'] !== reMsg['token']){
                        VM['nutjs_alert'].$emit("add" ,"错误：令牌不符！请求令牌为："+data['token']);
                        return;
                    };
                    VM['nutjs_alert'].$emit("add" ,"&nbsp;" ,"响应成功，获取最终登陆令牌","刷新状态中...");
                    $.get("/API/MemberControl/SignInReal?token="+data['token']+"&code="+data['code'],function(realMsg){
                        VM['user_check'].$emit('hook:created' ,function(){
                            VM['nutjs_alert'].$emit("add" ,"&nbsp;" ,"刷新成功!");
                            VM['nutjs_alert'].$emit("end" ,1000);
                        });
                        delete window.SIGNIN;
                    });
                };

                VM['nutjs_alert'].$emit("add" ,"&nbsp;" ,"打开事件端口window.SIGNIN，等待响应中...");
            });


        },
    }
})
COMP["alert-basic"] =Vue.extend({
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
        "modal_id":(function(){
            return 'modal-'+getRandomChar(8);
        })(),
        "msg_list":["开始执行任务"],
        "_fn":function(){},
    }},
    "computed":{
        "modalElt":function(){
            return $("#"+this.modal_id);
        },
    },
    "events":{
        "start":function(msg ,callback){
            this.msg_list=[msg];
            this.modalElt.modal('show');
            if(callback){
                var vm =this;
                var elt =this.modalElt;
                elt.on('hidden.bs.modal', vm._fn=function (e) {
                    elt.off('hidden.bs.modal' ,vm._fn);
                    callback.call(vm);
                });
            }
        },
        "add":function(){
            this.msg_list.push.apply(this.msg_list ,arguments);
        },
        "end":function(time){
            var vm =this;
            setTimeout(function(){
                vm.modalElt.modal('hide');
            } ,time);
        },
        "refresh":function(){
            this.modalElt.off('hidden.bs.modal' ,this._fn);
            this.msg_list=[];
            this.modalElt.modal('hide');
        },
    },
});
COMP["tools-basic"] =Vue.extend({
    "data":function(){return {
        "urlChangeEvents":new Array(),
    }},
    "events":{
        "onUrlChange":function(fn){
            this.urlChangeEvents.push(fn);
        },
        "offUrlChange":function(fn){
            this.urlChangeEvents.$remove(fn);
        },
        "urlChange":function(fn){
            for(var i=0 ;i <this.urlChangeEvents.length ;i++){
                setTimeout(this.urlChangeEvents[i] ,0);
            };
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
            console.log("r");
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
                    <img src="/image/carousel-3.jpg">
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
                    "icon":["book","briefcase"]
                };
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
            console.log(transition);
            transition.abort();
            var that =this;
            var reqUrl ="/API/MemberControl/SignOut";
            VM['nutjs_alert'].$emit("start" ,"初始化队列");
            VM['nutjs_alert'].$emit("add" ,"向服务器发送注销请求求","请求地址为："+reqUrl,"&nbsp;","等待响应中...");
            $.get(reqUrl ,function(reMsg){
                VM['user_check'].$emit('hook:created');
                VM['nutjs_alert'].$emit("add" ,"&nbsp;" ,"注销成功");
                VM['nutjs_alert'].$emit("end" ,800);
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
    getThat([
        "/tpl/form-basic.html",
        "/tpl/form-basic.json"
    ],function(reMsg){

        var formConf =_parse(reMsg[1]);

        var comp =Vue.extend({
            "template":reMsg[0],
            "props":["action"],
            "data":function(){return {
                "form":formConf,
            }},
            "methods":{
                "_loadField":function(data){
                    for(var $name in data){
                        var elt =$("[name='"+$name+"']");
                        if(elt.length ==1){
                            elt.val(data[$name]);
                        }else{
                            elt.filter("[value='"+data[$name]+"']").prop("checked" ,true);
                        };
                    }
                },
                "changeinfo_success":function(){
                    $("#_fb_from")
                    .find("#_fb_showmsg")
                    .showMsg({
                        "style":"success",
                        "msg":"修改成功",
                        "times":2000,
                    });
                },
                "signup_success":function(){
                    router.goDefault('/main' ,true);
                    VM['user_check'].$emit('hook:created');
                },
                "changeinfo_ready":function(){
                    var vm =this;
                    VM['nutjs_alert'].$emit("start" ,"拉取信息中...");
                    $.get("/API/MemberControl/GetInfo" ,function(reObj){
                        vm._loadField(reObj);
                        VM['nutjs_alert'].$emit("end" ,"&nbsp;");
                    });
                },
                "signup_ready":function(){
                    var vm =this;
                    VM['nutjs_alert'].$emit("start" ,"拉取QQ信息中...");
                    $.getJSON("/API/MemberControl/GetQQInfo" ,function(reObj){
                        vm._loadField({
                            "gender":reObj['gender'] =="女"?2:1,
                            "nickname":reObj['nickname'],
                        });
                        VM['nutjs_alert'].$emit("end" ,"&nbsp;");
                    });
                },
                "sendAjax":function(){
                    var fm =$("#_fb_from");
                    var sign =fm.find("#_fb_showmsg");
                    $.ajax({
                        "type"  :fm.prop("method"),
                        "url"   :fm.prop("action"),
                        "data"  :fm.serialize(true),
                        "context":this,
                        "success":function(reObj){
                            switch(reObj['errcode']){
                                case 0:
                                    if(this[this.action+"_success"] instanceof Function){
                                        this[this.action+"_success"].call(this);
                                    };
                                    break;
                                case 401:
                                    router.replace('?login=1');
                                    break;
                                case 402:
                                    fm.find("[name='"+reObj['field']+"']").showFiledError();
                                    sign.showMsg({
                                        "style":"error",
                                        "msg":reObj['errmsg'],
                                    });
                                    break;
                                case 403:
                                case 404:
                                    fm.find("#_fb_showmsg").html("错误："+reObj['errmsg']).show();
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
                if(this[this.action+"_ready"] instanceof Function){
                    this[this.action+"_ready"].call(this);
                };
            },
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





