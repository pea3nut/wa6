# wa6

利用Vue.js与ThinkPHP构建的网站，不依赖node环境，但是需要*AMP环境。

# Demo

[Demo](http://test.wa6.nutjs.com/)

# 配置部署

1. 配置网站前请先部署Apache+PHP环境，并开启Apache**分布式配置文件支持**和加载`rewrite_module`模块。
2. 复制API模块配置文件（`/API/Application/Home/Conf/config.inc.php`），重命名为`config.php`，按注释内容进行相关配置。
3. 复制GUI模块配置文件（`/GUI/script/CONF.inc.js`），重命名为`CONF.js`，按注释内容进行相关配置。

QQ登陆默认回调`/GUI/qq_callback.html`文件，本地测试时，你可以选择手动触发登陆事件或配置hosts文件来解决跨域问题。

## 使用

这个项目的公开主要目的是供其他人参考用，网站项目中分为2部分，各部分使用的开源协议不同

1. 代码部分：如函数、类、组件等
2. 内容部分：如Logo、`.md`文件、导航栏的内容配置文件等

代码部分使用[MIT License](http://choosealicense.com/licenses/mit/)协议，你可以无任何的顾虑自由的使用它们（如复制、二次修改、散布）

内容部分则使用[Mozilla Public License 2.0](http://choosealicense.com/licenses/mpl-2.0/)协议，可能会有一些限制。

你可以将这个项目完整的复制下来，删掉内容部分（只保留MIT协议部分），然后将它替换成自己想要的内容而变成另一个网站去做**任何**事。

