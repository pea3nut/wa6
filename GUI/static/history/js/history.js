(function(){
    /**
     * 时间对象数组，每一个元素的格式如下：
     * <dt>date</dt>
     * <dd>JSON中的时间</dd>
     * <dt>day</dt>
     * <dd>将date转换成的天数</dd>
     * <dt>msg</dt>
     * <dd>JSON中的说明</dd>
     * */
    var event_obj_list=[];

    /**
     * 时间线的长度，单位天
     * @type {Int}
     * */
    var time_length=1;

    var tree_body =document.getElementById("tree_body");

    var timebase_l =document.getElementById("timebase_l");
    var timebase_r =document.getElementById("timebase_r");

    /**
     * 将JSON格式化为Obj，属性如下
     * <dt>date</dt>
     * <dd>JSON中的时间</dd>
     * <dt>day</dt>
     * <dd>将date转换成的天数</dd>
     * <dt>msg</dt>
     * <dd>JSON中的说明</dd>
     * @param {Object} $json 以时间为key 事件说明为value的JSON对象
     * @return {Array} 格式好的事件对象数组
     * */
    function create_event_object($json){
        var obj_arr=[];
        for(var key in $json){
            obj_arr.push({
                "date"  :key,
                "days"  :toDay(key),
                "msg"   :$json[key]
            });
        }
        return obj_arr;
        function toDay(date){
            var reg_time=/(\d+)-(\d+)-(\d+)/;
            if(reg_time.test(date)){
                return RegExp.$1*365+RegExp.$2*30+(+RegExp.$3);
            }else{
                return 0;
            }
        };
    };

    /**
     * 排序事件数组，将每一个的days降到最低
     * @return {Int} 时间线的长度（days的最大值-最小值）
     * */
    function tidy_event_object($list){
        //对原数组进行排序
        $list.sort(function(a ,b){return a.days-b.days})
        //同时降低所有的天数
        for(var i=0 ,min_days=$list[0].days ;i<$list.length ;i++){
            $list[i].days -=min_days;
        };
        //返回时间线长度
        return $list[$list.length-1].days;
    };

    function init_tree_height($length ,$step){
        //树的各个部位的长度
        var head_img_height =parseFloat( getComputedStyle(document.getElementById("tree_head") ,false).height );
        var body_img_height =parseFloat( getComputedStyle(document.getElementById("tree_body") ,false).height );
        var foot_img_height =parseFloat( getComputedStyle(document.getElementById("tree_foot") ,false).height );
        //一共需要的高度 = 总天数*每天需要的像素
        var need_height =$length*$step;
        //树根可作为树干用的百分比
        var head_eff=0.78;
        //避开不可用的树根
        document.getElementById("timebase").style.marginTop =-foot_img_height*(1-head_eff)+"px";
        //需要树干的长度 = 共需要的像素-树根可用的像素 + 为了美观额外增加的高度
        tree_body.style.height =need_height-foot_img_height*head_eff +100 +"px";
    };

    function cerate_tag($list){
        for(var i=0 ;i<$list.length ;i++){
            var li_elt =document.createElement("li");
            li_elt.innerHTML="<span><p>"+$list[i].date+"</p><p>"+$list[i].msg+"</p></span>";
            $list[i].elt=li_elt;
        };
    };


    function count_position($list ,$step){
        for(var i=0 ;i<$list.length ;i++){
            $list[i].elt.style.bottom =$list[i].days*$step+"px";
            if(i%2){
                timebase_l.appendChild($list[i].elt);
            }else{
                timebase_r.appendChild($list[i].elt);
            };
        };
    };

    window.onload=function(){
        //从事件JSON格式化事件对象
        event_obj_list =create_event_object(HIS_CONF.EVENT);

        //整理事件对象，返回时间范围
        time_length =tidy_event_object(event_obj_list);

        //根据日期范围和步长，增加树的高度
        init_tree_height(time_length ,HIS_CONF.STEP_SIZE);
        //窗口大小改变时，重新计算
        window.onresize=function(){init_tree_height(time_length ,HIS_CONF.STEP_SIZE)};

        //生成标签元素，绑定到事件对象中的elt属性
        cerate_tag(event_obj_list);

        //计算各个标签的位置
        count_position(event_obj_list ,HIS_CONF.STEP_SIZE);
    };
})();

