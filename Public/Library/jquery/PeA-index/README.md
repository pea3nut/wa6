# 插件简介

PeA-index可以帮助您快速的索引网页中的某些元素，添加前导数字并生成一个锚点导航栏。

PeA-index非常适用某些展现大量文本的页面，如[W3文档](http://http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html)。

PeA-index可以帮助您在每一个标题元素（或是您指定的）添加有层级的前导数字，并索引所有标题元素生成一个锚点导航（类似于Markdown中的[TOC]）

PeA-index创建的锚点导航还可以十分友好的配合[PeA-target](https://github.com/pea3nut/PeA-target)来偏移锚点链接。

# 项目配置

PeA-index是一个jQuery插件，所以首先您需要在引入PeA-index之前引入jQuery库，然后下载PeA-index源码，引入您的项目。

	<script charset="utf-8" src="script/PeA-target.js"></script>

无需更多配置，就可以在项目中使用PeA-index了

# 插件使用

首先您需要实例化一个PeA-index对象，传入要索引标题的层级

	var pea =new jQuery.PeAIndex(5);

然后设置是否启用添加标题前缀，以及前缀模板

	pea.addPrefix=true;
	pea.prefix =jQuery.PeAIndex.prefixTpl.zhTier;

PeA-index默认提供2套前缀模板

默认模板

	1. 这是一级标题
    	1.1 这是二级标题
    	1.2 这是二级标题
    		1.2.1 这是三级标题
    2. 这是一级标题
    	2.1 这是二级标题

中文前缀模板

	一、这是一级标题
    	1.1 这是二级标题
    	1.2 这是二级标题
    		1.2.1 这是三级标题
    二、这是一级标题
    	2.1 这是二级标题

然后手动设置要索引的元素，默认值为h2到hn，n为要索引的层级+1

	pea.indexElt=[$("h1"),$("h2"),$("h3"),$("h4"),$("h5")];

配置生成索引目录的模板函数。这里PeA-index仅提供了一套模板，并且也是PeA-index的默认值

	pea.tpl =jQuery.PeAIndex.createDefaultIndexHtml;

配置好所有参数后执行索引操作

	pea.index();

PeA-index会自动生成索引目录，并存放在`indexHtml`字段中，这里我们把它放在一个ID为pea-index-toc的DOM元素中

	$("#pea-index-toc").html(pea.indexHtml);

