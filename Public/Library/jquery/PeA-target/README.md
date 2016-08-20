# 插件简介 #
PeA-target插件允许开发者设置锚点链接的偏移量，简单的一个锚点链接偏移功能，PeA-target却将他做的很好。

- a标签点击的锚点链接
- 外联来的锚点链接
- 保留原有锚点URL显示
- 提供JS调用锚点接口

值得一提的是，使用PeA-target几乎不需要任何配置。

# 项目配置 #

PeA-target是一个jQuery插件，所以首先您需要在引入PeA-target之前引入jQuery库，然后下载PeA-target源码，引入您的项目。

    <script charset="utf-8" src="script/PeA-target.js"></script>

然后设置您想让锚点偏移的像素

	jQuery.PeATarget.deviation =160;//160是PeA-target的默认值

理论上此时PeA-target无需任何配置已经可以正常工作了，因为PeA-target是默认开启的。如果您需要关闭PeA-target，可以在DOMLoad事件之前将偏移量设置为0即可

    jQuery.PeATarget.deviation =0;
    
需要注意的是，PeA-target为了拦截外链来的锚点请求，在windows的load事件中阻止了默认事件，这可能会导致一定的问题，请根据项目情况自行处理。

# 版本号 #

PeA-target版本号由ABCD四部分组成，如1.2.1b，格式为

    A.B.CD

 - A版本迭代表示API升级，并不再向下兼容低版本的API，部署此版本需要更新您的项目
 - B版本迭代表示增加新的API，您可以阅读项目中的README.md文件来了解使用它
 - C版本迭代表示API接口小幅度更新升级，某个API可能会增加新功能。当然，这不影响旧版本的使用
 - D版本通常是用一个字母表示，表示项目的Bug修复。无论如何请保证此版本为最新版本！

# API #
PeA-target为js开发者提供了一个静态接口，用来手动的触发锚点链接事件

	jQuery.PeATarget.scroll(targetElt ,[deviation])

jQuery.PeATarget.scroll方法接受2个参数：

- (String/Element/jQuery) targetElt 被锚点的目标元素
- (Number) [deviation] 可选，要向下偏移的像素

targetElt参数支持多种类型。

targetElt可以是一个完整的带锚点的URL

    jQuery.PeATarget.scroll(document.URL);
    jQuery.PeATarget.scroll(document.getElementsByTagName("a")[0].href）);

targetElt也可以是一个有ID属性的DOM节点

    jQuery.PeATarget.scroll(document.getElementById("targetElt"));
    
当然，直接传递一个Element的ID值也是可以的
    
    jQuery.PeATarget.scroll(targetEltId);

targetElt还可以是一个jQuery对象

	jQuery.PeATarget.scroll( $("#targetElt") );

deviation 可选，如果不传任何值，将读取jQuery.PeATarget.deviation的值作为默认值

    jQuery.PeATarget.scroll("targetElt" ,160);

jQuery.PeATarget.scroll方法是健壮的，几乎传递任何错误值都不会抛出错误。
