<?php
namespace Home\Model;
use Think\Model;
/**
 * 用户信息表
 * */
class UsersModel extends Model{
    /**
     * 数据表中所有字段
     * 实际使用是应手动的调用filed()方法来指定要操作的字段
      * @var Array
     * @access protected
     * */
    protected $fields=array('id','nickname','realname','gender','phone','wechat','create_time' ,'open_id' ,'state');
    /**
     * 数据表的主键
     * @var String
     * @access protected
     * */
    protected $pk='id';
    /**
     * 校验字段的规则
     * ThinkPHP的系统变量，名称不可变更
     * @var Array
     * @access protected
     * */
    protected $_validate=array(
        //12 插入时，有下面的字段是必填的
        array('nickname' ,'require'         ,'nickname'  ,self::MUST_VALIDATE   ,'regex'    ,self::MODEL_INSERT),
        array('phone'    ,'require'         ,'phone'     ,self::MUST_VALIDATE   ,'regex'    ,self::MODEL_INSERT),
        //24 所有的字段，如果有则需要校验格式
        array('open_id'  ,'/^[\w_]+$/'      ,'open_id'   ,self::EXISTS_VALIDATE ,'regex'    ,self::MODEL_BOTH),
        array('gender'   ,'number'          ,'gender'    ,self::EXISTS_VALIDATE ,'regex'    ,self::MODEL_BOTH),
        array('phone'    ,'number'          ,'phone'     ,self::EXISTS_VALIDATE ,'regex'    ,self::MODEL_BOTH),
        array('wechat'   ,'/^[\w_]+$/'      ,'wechat'    ,self::EXISTS_VALIDATE  ,'regex'    ,self::MODEL_BOTH),
    );
}