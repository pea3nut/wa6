<?php
namespace Home\Controller;
use Think\Controller;
class MarkMasterController extends Controller {
    public function get(){
        $md_path =$this->getMarkdownPath($_SERVER['PATH_INFO']);

        if(file_exists($md_path)){
            echo file_get_contents($md_path);
        }else{
            $this->ajaxReturn(array('error'=>'404','path'=>$md_path));
            header('HTTP/1.1 404 Not Found');
            header("status: 404 Not Found");
            exit;
        }
    }

    protected function getMarkdownPath($url){
        $arr =array();
        if(preg_match('/get\\/(.+)$/',$url ,$arr)){
            return APP_PATH.MODULE_NAME.'/Public/MarkMap/'.$arr[1].'.md';
        };
    }
}