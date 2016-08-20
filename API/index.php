<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用入口文件

// 检测PHP环境
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG',true);
APP_DEBUG and header('Access-Control-Allow-Origin: *');

// 定义应用目录
define('APP_PATH','./Application/');

//自动生成
define('DIR_SECURE_FILENAME', 'default.html');//目录安全文件名
define('DIR_SECURE_CONTENT', 'Dir!');//目录安全文件内容
define('BUILD_CONTROLLER_LIST','Index,User,Mnt');//生成控制器

//默认将此文件绑定Home模块
define('BIND_MODULE','Home');

//引入常量文件
include APP_PATH.BIND_MODULE.'/Common/constant.php';

// 引入ThinkPHP入口文件
require './ThinkPHP/ThinkPHP.php';

