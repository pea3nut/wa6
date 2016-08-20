# wa6

利用Vue.js与ThinkPHP构建的网站

# 配置部署

配置网站前请先部署Apache+PHP环境，并开启Apache分布式配置文件支持和加载`rewrite_module`模块。

需配置`./API/Application/Home/Conf/config.inc.php`文件，修改数据库连接信息以及QQ登陆`APP ID`和`APP KEY`

QQ登陆默认回调`./GUI/qq_callback.html`文件，你可以选择手动触发登陆事件或配置hosts文件来解决跨域问题。
