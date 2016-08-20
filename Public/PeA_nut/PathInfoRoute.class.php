<?php
namespace PeA;

/**
 * path_info模式下的路由类
 *
 * @final 禁止非作者修改本文件，如若扩展功能请直接继承
 * @author 花生PeA 626954412@qq.com
 * @version 1.1
 * */
class PathInfoRoute{

    /**
     * @param $rawPath=$_SERVER['PATH_INFO'] 要路由的路径
     * @param $routeInfo 路由映射表
     * @param $accessInfo 权限检查表
     * */
    public function __construct($rawPath='' ,$routeInfo=array() ,$accessInfo=array()){
        $this->rawPath =
            empty($rawPath)
            ?   empty($_SERVER['PATH_INFO'])
                ?'/'
                :$_SERVER['PATH_INFO']
            :$rawPath
        ;
        $this->routeInfo =$routeInfo;
        $this->accessInfo =$accessInfo;
        array_push($this->logs, "start route, rawPath is \"{$this->rawPath}\"");
    }
    public $rawPath ='';

    /**
     * 路由映射表
     * 路由语法与ThinkPHP路由语法相同，仅支持正则路由
     * @access public
     * @var array
     * */
    public $routeInfo =array(
        //'正则表达式 '=>'字符串'
    );
    public function route(){
        if(empty($this->rawPath)){
            $this->addLog('rawPath is empty');
            return $this;
        };
        if(empty($this->routeInfo)){
            $this->addLog('routeInfo is empty');
            return $this;
        };

        $this->path =$this->rawPath;
        foreach ($this->routeInfo as $regexp => $target) {
            if(!preg_match($regexp, $this->path ,$matches)){
                $this->addLog(__METHOD__." skip \"{$regexp}\" with \"{$this->path}\"");
                continue;
            }
            var_dump($matches);
            for($i=0 ;$i<count($matches) ;$i++){
                $this->path =str_replace(':'.$i, $matches[$i], $target);
            };
            $this->addLog("path changed \"{$this->path}\" with \"{$regexp}\"");
        };

        $this->addLog("end of route, path is \"{$this->path}\"");

        return $this;
    }


    /**
     * 权限检查表
     * 路由语法与ThinkPHP路由语法相同，仅支持正则路由
     * @access public
     * @var array
     * */
    public $accessInfo =array(
        //'正则表达式 '=>'函数'
    );
    public function checkAccess(){
        if(empty($this->accessInfo)){
            $this->addLog('accessInfo is empty');
            return $this;
        };

        foreach ($this->accessInfo as $regexp => $method) {
            if(!preg_match($regexp, $this->rawPath ,$matches)){
                $this->addLog(__METHOD__." skip \"{$regexp}\" with \"{$this->path}\"");
                continue;
            }
            if(!call_user_func_array($method ,$matches)){
                return false;
            };
        };

        $this->addLog("checkAccess OK");
        return true;
    }


    /**返回映射后的路径*/
    public function getPath(){return $this->path;}
    protected $path ='';


    /**输出日志*/
    public function viewLog(){
        echo join('<br />', $this->logs);
        return $this;
    }
    private function addLog($msg){
        array_push($this->logs, $msg);
        return $this;
    }
    public $logs =array();


};