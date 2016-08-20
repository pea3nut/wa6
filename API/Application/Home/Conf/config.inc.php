<?php
return array(
    //数据库信息
    'DB_TYPE'=>'mysql', //数据库类型
    'DB_HOST'=>'localhost', //服务器地址
    'DB_NAME'=>'wa6', //数据库名
    'DB_USER'=>'root', //用户名
    'DB_PWD'=>'', //密码
    'DB_PORT'=>3306, //端口
    'DB_PREFIX'=>'wa6_', //数据库表前缀
    'db_charset' => 'utf8',//数据库字符集
    'DB_PARAMS' => array(//链接参数
        PDO::ATTR_EMULATE_PREPARES => false,//不将number字段强制转换成string
    ),


    //自定义配置
    'CLIENT_ID'=>'',//QQ登陆的APP ID
    'CLIENT_SECRET'=>'',//QQ登陆的APP KEY


    //项目个性配置
    'DEFAULT_MODULE'=>'GUI',// 默认模块
    'COOKIE_PREFIX'=>'wa_',//Cookie前缀
    'COOKIE_EXPIRE'=>3600,//Cookie过期时间
    'URL_HTML_SUFFIX'=>'',//支持所有后缀名
    'URL_ROUTER_ON' => false,//关闭路由，路由模块在入口文件
    'URL_PARAMS_BIND_TYPE' => 1,//开启参数绑定
    'READ_DATA_MAP'=>true,//开启Model字段映射
    'LOG_RECORD' => true, // 开启日志记录
    'LOG_LEVEL' =>'EMERG,ALERT,CRIT,ERR', // 只记录EMERG ALERT CRIT ERR 错误
    'TMPL_TEMPLATE_SUFFIX'=>'.tpl',//模板文件名后缀
    'URL_MODEL'=>2,//定义路径模式
    'TMPL_ENGINE_TYPE' =>'PHP',//禁用ThinkPHP原有模板渲染引擎
    'MULTI_MODULE' => false,//关闭多模块访问
    'DEFAULT_MODULE' => 'Home',//绑定模块


    //调试配置
    'SHOW_PAGE_TRACE' =>true,//页面调试工具


);