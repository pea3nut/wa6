<?php
use Think\Model;
use Think\Log;
use Home\Model\UsersModel;
/**
 * 生成给定长度的随机字符串
 * @param string $code 用户输入的验证码字符串
 * @param int $length 要生成字符串的长度
 * @return string 生成的随机字符串
 * */
function get_rand_char($length){
    $str = null;
    $strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    $max = strlen($strPol)-1;
    for($i=0;$i<$length;$i++){
        $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
    }
    return $str;
}

function test_login(){
    if(
        !empty(cookie('login_token'))
        && cookie('login_token') === session('login_token')
    ){
        return true;
    }else{
        return false;
    }
};

function get_status(){
    if(test_login()){
        $mo =new UsersModel();
        $mo->where(array('open_id'=>session('qq_login.open_id')));
        $state =$mo->getField('state');
        if(is_null($state)){
            return array("state"=>"100","is_login"=>true);
        }else{
            return array("state"=>$state,"is_login"=>true);
        };
    }else{
        return array("state"=>"0","is_login"=>false);
    };
};


















/**
 * 删除目录和文件
 * @param String $dirName 要删除的文件路径
 * @return Bool 成功返回true
 * */
function del_file_all($dirName){
    if ($handle =opendir($dirName)){
        while (false !==($item = readdir($handle))){
            if ($item != "." && $item != ".."){
                if(is_dir("$dirName/$item")){
                    del_file_all("$dirName/$item");
                }else{
                    unlink("$dirName/$item");
                }
            }
        }
        closedir($handle);
        rmdir($dirName);
        return true;
    }else{
        return false;
    };
};
/**
 * 将路径转换为URL路径
 * @param String $path 要转换的路径，支持相对和绝对路径
 * @return String 可以直接被使用的URL
 * */
function toURL($path){
    $project_root =realpath('./');
    $target_path =realpath($path);
    $url =str_replace($project_root, URL_ROOT, $target_path);
    $url=str_replace('\\','/',$url);
    return $url;
};
/**
 * 检查用户是否有效登陆
 * 若未登录则直接跳转到登陆页面
 * 开启调试模式与Not_Control_Page参数可以让避免跳转
 * */
function test_control_login(){
    if(! (APP_DEBUG &&C('Not_Control_Page'))){//取消页面权限检查
        test_token() or $this->error('请重新登录' ,'sign_in');
    };
};
/**
 * 检测输入的验证码是否正确
 * @param string $code 用户输入的验证码字符串
 * @param int $id 当前验证码的id，适用于多个验证码
 * @return bool
 * */
function check_verify($code, $id = ''){
    $verify = new \Think\Verify();
    return $verify->check($code, $id);
}
/**
 * 生成用于登陆的Cookie
 * @param $uid 要生成的Cookie的协会编号
 * */
function log_in($uid){
    //检查是否token表中是否有此用户，没有则inset，有则updata
    $hasRow=false;
    $tokenMo=new \Home\Model\TokenModel();
    $tokenMo->where(array('uid'=>$uid));
    if(empty($tokenMo->find())){
        $hasRow=true;
    }else {
        $hasRow=false;
    };
    //更新token
    $tokenMo->field('uid,date,token');
    $tokenMo->create(
        array('uid'=>$uid),
        $hasRow ? Model::MODEL_UPDATE : Model::MODEL_INSERT
    ) or drop($tokenMo->getError());
    //更新token，如果不存在则生成一条新记录
    if ($hasRow) {
        $tokenMo->add()     or drop(EC_3361.$tokenMo->getError());
    }else{
        $tokenMo->save()    or drop(EC_3562.$tokenMo->getError());
    };
    //获取生成的token
    $token =$tokenMo->getToken();
    //生成Cookie
    cookie('uid'    ,$uid);
    cookie('token'  ,$token);
};
/**
 * 输出指定信息，有可能会执行退出操作。
 * 此函数的行为略微复杂
 * $msg传入不同的参数会有不同的效果
 * @param $msg String/Bool 要返回的信息
 * <h5>Bool情况：</h5>
 *   <li>若为true，则等同于echo drop('1200,ok',true)</li>
 *   <li>若为false，则等同于drop('1201,error')</li>
 * <h5>String情况：</h5>
 * - 以逗号分隔的错误信息，格式：错误码,错误信息。注意逗号是英文逗号<br />
 * - 如drop('1202,非法的数据对象');
 *
 * @param $return Bool 若为true，则将格式好的信息返回，不打印也不退出
 * @param $extra Array 额外添加的数据
 * @param $noToLower Bool 不进行强制小写转换
 * @return String/Void 若$return为true则返回Json字符串
 * */
function drop($msg ,$return=false ,$extra=null ,$noToLower=false){
    //最终要格式化的对象
    $reArray=array();
    //最终返回的信息
    $reMsg='';
    //读取布尔参数
    if(is_bool($msg)){
        if($msg){
            echo drop('1200,ok',true ,$extra ,$noToLower);
            return;
        }else{
            return drop('1201,error' ,$extra ,$noToLower);
        };
    //读取字符串参数
    }else if(is_string($msg)){
        //分割字符串
        preg_match('/^([^,]*),(.*)$/', $msg ,$msg);
        //赋值返回数组
        $reArray['errcode']=$msg[1];
        $reArray['errmsg']=$msg[2];
        //检测是否是严重错误，记录日志
        $errlv =substr($reArray['errcode'], 2 ,1);
        if($errlv >= 4){
            $loglv =array(4=>'ALERT' ,5=>'EMERG');
            $logmsg ="drop抛出{$reArray['errcode']}错误码\n".
                "-GET:"
                .print_r($_GET,true).
                "-POST:"
                .print_r($_POST,true).
                "-Cookie:"
                .print_r($_COOKIE,true)
            ;
            Log::write($logmsg ,$loglv[$errlv] );
        };
    };
    //检测添加额外的数组
    if (is_array($extra)){
        $reArray =array_merge($reArray ,$extra);
    };
    //根据调试模式状态格式化JSON数据
    $json_option =APP_DEBUG ? JSON_UNESCAPED_UNICODE : JSON_FORCE_OBJECT;
    $reMsg =json_encode($reArray,$json_option);
    if(!$noToLower)$reMsg =mb_strtolower($reMsg);
    //返回JSON数据
    header('Content-Type:application/json; charset=utf-8');
    if($return) return $reMsg;
    else        exit($reMsg);
}
/**
 * 检查令牌是否合法
 * @param String(4) $uid 协会编号，默认cookie('uid')
 * @param String(20) $token 令牌值，默认cookie('token')
 * @return bool
 * */
function test_token($uid,$token){
    //初始值
    if(empty($uid)) $uid=cookie('uid');
    if(empty($token)) $token=cookie('token');
    //校验字段格式
    if(!preg_match(RegExp_uid, $uid)) return false;
    //查询返回结果
    $mo=new \Home\Model\TokenModel();
    $mo->where(array('uid'=>$uid));
    $db_token = $mo->getField('token');
    if($db_token == $token && !empty($token)){
        return true;
    }else{
        return false;
    };
}
/**
 * 查询当前协会编号的状态(users表中的state字段)
 * @param $uid String(4) 要查询的协会编号
 * @return String(3) 当前协会编号的状态
 * */
function get_state($uid){
    //初始值
    if(empty($uid)) $uid=cookie('uid');
    //校验字段格式
    if(!preg_match(RegExp_uid, $uid)) return '';
    //查询返回结果
    $mo=new \Home\Model\UsersModel();
    $mo->where(array('uid'=>$uid));
    return $mo->getField('state');
}
/**
 * 查询当前是否正常登陆且账号状态可用
 * @param String(4) $uid 协会编号，默认cookie('uid')
 * @param String(20) $token 令牌值，默认cookie('token')
 * @return bool
 * */
function test_uid($uid,$token){
    $pass_code=array('200','999');
    return test_token($uid,$token) && in_array(get_state($uid) ,$pass_code);
}
/**
 * 以一个友好的格式返回的当前完整时间
 * @return String Y-m-d H:i:s
 * @param $date 传来的时间，会尝试转换成Y-m-d H:i:s，若失败则返回当前时间
 * */
function get_sql_date($date){
    if (empty($date)){
        return date('Y-m-d H:i:s');
    }else {
        $timestamp=strtotime($date);
        if ($timestamp){
            return date('Y-m-d H:i:s',$timestamp);
        }else{
            return date('Y-m-d H:i:s');
        }
    }
}
/**
 * 以一个友好的格式返回的当前年月日
 * @return String Y-m-d
 * @param $date 传来的时间，会尝试转换成Y-m-d，若失败则返回当前时间
 * */
function get_sql_short_date($date){
    if (empty($date)){
        return date('Y-m-d');
    }else {
        $timestamp=strtotime($date);
        if ($timestamp){
            return date('Y-m-d',$timestamp);
        }else{
            return date('Y-m-d');
        }
    }
}
/**
 * 渲染输出Markdown文件，渲染前会对源码进行htmlspecialchars编码
 * @param String $path 要渲染的文件路径
 * @return String 渲染成的HTML字符串
 * */
function decode_markdown($path){
    //检测文件是否存在
    if(!file_exists($path)) return;
    //获取文件内容
    $md=file_get_contents($path);
    //对所有下划线转义
    $md =preg_replace('/_/','\\_', $md);
    //渲染Markdown
    require_once '.\Public\Library\Michelf\Markdown.inc.php';
    $parser = new \Michelf\Markdown;
    $parser->no_markup=true;
    $html =$parser ->transform($md);
    //渲染模板
    $html =preg_replace('/URL_ROOT/', URL_ROOT, $html);
    //返回
    return $html;
};













