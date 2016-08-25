<?php
namespace Home\Controller;
use Think\Controller;
use Home\Model\UsersModel;
use Think\Model;

include './../Public/Library/php-curl/curl.php';

class MemberControlController extends Controller{

    private $logs =array();

    public function SignUp(){
        test_login()
            or $this->ajaxReturn(array('errcode'=>ERR_NO_LOGIN,'errmsg'=>'登陆校验失败'))
        ;
        get_status()['state'] == '100'
            or $this->ajaxReturn(array('errcode'=>ERR_ILLEGAL,'errmsg'=>'用户已注册'))
        ;
        $mo =new UsersModel();
        $mo->field(array('nickname','realname','gender','phone','wechat' ,'open_id' ,'state'));
        $mo->create(
                array_merge(
                    I('post.')
                    ,array(
                        'open_id'=>session('qq_login.open_id'),
                        'state' =>'200'
                    )
                )
            ,Model::MODEL_INSERT
        ) or $this->ajaxReturn(array(
            'errcode'=>ERR_FIELD
            ,'field'=>$mo->getError()
            ,'errmsg'=>'字段验证失败')
        );
        $id =$mo->add()
            or $this->ajaxReturn(array('errcode'=>ERR_UNKNOWN,'field'=>$mo->getError(),'errmsg'=>'添加失败'))
        ;
        $this->ajaxReturn(array('errcode'=>0,'id'=>$id,'errmsg'=>'新增成功'));
    }
    public function SignIn(){
        $qq_signin_token =get_rand_char(6);

        session('qq_signin_token' ,$qq_signin_token);

        $this->ajaxReturn(array('token'=>$qq_signin_token));
    }
    public function SignOut(){
        cookie(null);
        session(null);
        $this->ajaxReturn(array('errcode'=>'0'));
    }
    public function ChangeFigure(){
        ;
    }
    public function ChangeInfo(){
        test_login()
            or $this->ajaxReturn(array('errcode'=>ERR_NO_LOGIN,'errmsg'=>'登陆校验'))
        ;
        $mo =new UsersModel();
        $mo->field(array('nickname','realname','gender','phone','wechat'));
        $mo->create(I('post.') ,Model::MODEL_UPDATE)
            or $this->ajaxReturn(array('errcode'=>ERR_FIELD,'field'=>$mo->getError(),'errmsg'=>'字段验证失败'))
        ;
        $mo->where(array('open_id'=>session('qq_login.open_id')));
        $mo->save() !==false
            or $this->ajaxReturn(array('errcode'=>ERR_UNKNOWN,'field'=>$mo->getError(),'errmsg'=>'添加失败'))
        ;
        $this->ajaxReturn(array('errcode'=>0,'errmsg'=>'更新成功'));
    }

    public function GetStatus(){
        $this->ajaxReturn(get_status());
    }
    public function GetFigure(){
        ;
    }
    public function GetInfo(){
        test_login()
            or $this->ajaxReturn(array('errcode'=>ERR_NO_LOGIN,'errmsg'=>'登陆校验失败'))
        ;
        $mo =new UsersModel();
        $mo->where(array('open_id'=>session('qq_login.open_id')));
        $mo->field(array('id','nickname','realname','gender','phone','wechat','create_time'));
        $this->ajaxReturn($mo->find());
    }
    public function GetQQInfo(){
        $curl =new \Curl;
        $curl->options['CURLOPT_SSL_VERIFYPEER']=false;
        $response = $curl->get('https://graph.qq.com/user/get_user_info', $vars = array(
            'oauth_consumer_key'=>C('CLIENT_ID'),
            'access_token'=>session('qq_login.access_token'),
            'openid'=>session('qq_login.open_id'),
        ));
        echo $response->body;
    }


    public function SignInReal(){
        $qq_signin_token =I('get.token');
        if($qq_signin_token !== session('qq_signin_token')){
            $this->ajaxReturn(array('errcode'=>ERR_FIELD,'errmsg'=>'token令牌不符！'));
            return;
        }
        session('qq_signin_token' ,null);

        $qq_login =$this->requestQQ(I('get.code'));//获取access_token和open_id

        if(empty($qq_login)) $this->ajaxReturn(array('errcode'=>ERR_FIELD,'errmsg'=>'code字段无效！'));
        $token =get_rand_char(6);
        session('qq_login' ,$qq_login);
        session('login_token' ,$token);
        cookie('login_token' ,$token);

        $this->ajaxReturn(array('errcode'=>'0','errmsg'=>'登陆成功','token'=>$token));
    }

    private function requestQQ($code){

        $return_data =array();
        $curl =new \Curl;
        $curl->options['CURLOPT_SSL_VERIFYPEER']=false;


        $response = $curl->get('https://graph.qq.com/oauth2.0/token', $vars = array(
            'grant_type'=>'authorization_code',
            'client_id'=>C('CLIENT_ID'),
            'client_secret'=>C('CLIENT_SECRET'),
            'code'=>$code,
            'redirect_uri'=>'http://mnt.nutjs.com/qq_sign_in/callback.php',
        ));
        $reMsg =$response->body;
        array_push($this->logs ,'oauth2.0/token:'.$reMsg);
        $reArr =array();
        if(!preg_match('/access_token=(\w+).+?refresh_token=(\w+)/' ,$reMsg ,$reArr)){
            array_push($this->logs ,'获取access_token失败，服务器返回'.$reMsg);
            return;
        };
        $return_data['access_token'] =$reArr[1];
        $return_data['refresh_token'] =$reArr[2];


        //获取open_id
        $response = $curl->get('https://graph.qq.com/oauth2.0/me', $vars = array(
            'access_token'=>$return_data['access_token'],
        ));
        $reMsg =$response->body;
        array_push($this->logs ,'oauth2.0/me:'.$reMsg);
        $reArr =array();
        if(!preg_match('/"client_id":"(\w+)".+"openid":"(\w+)"/' ,$reMsg ,$reArr)){
            array_push($this->logs ,'获取openid失败，服务器返回'.$reMsg);
            return;
        };
        if(C('CLIENT_ID') !==$reArr[1]){
            array_push($this->logs ,'对比client_id失败，本地记录为'.C('CLIENT_ID').'，服务器返回'.$reArr[1]);
            return;
        };;
        $return_data['open_id']=$reArr[2];

        return $return_data;

    }

}














