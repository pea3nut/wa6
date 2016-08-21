# 开发规范 / 建议

## 编程原则

我们（Nutjs团队）对于Web开发协会会员开发提出如下建议，希望会员开发时尽量遵守此建议，树立良好统一的开发规范，这样将会十分利于团队合作开发。

### 可读远比风骚要好

一个良好可读的代码，不仅便于多人合作，更易于代码复用和维护，因此，相比写出一段风骚优化的代码，良好可读的代码更重要一些。

独木难成林，一个庞大的项目不是一个人凭借一己之力就能撑起来的，项目的推动需要很多人不懈的努力，因此，提高合作亲密度增强代码可读性才是最重要的。

### 越慢越好

快速的写代码不一定是好事，完成同样一件事情，面向过程的糅杂写法相比模块化面向过程的写法要快的多，但是我们不提倡这样，这不仅是为了提高代码质量，更是为了开发者的个人成长。

如果你要为协会的网站实现一个功能，那么你可能会有两种选择

1. 针对协会网站快速的写出“只能用一次”的代码
2. 花数倍的时间造出一套通用的解决方案

在这里我们提倡开发者选择后者。一个实际的例子是，可能你已经注意到了，本页面中开头的索引标题的由JavaScript动态实现的，这个是一个独立的功能，一个jQuery插件——PeA-index。

当初因为页面迫切的需要自动的索引标题，当时的网站开发者有2个选择，一个是为本网站编写一个只能用于本网站的JavaScript代码来索引，另一个则是编写一个独立的插件将插件应用于本网站，显然他选择了后者，因此有了[PeA-index](https://github.com/pea3nut/PeA-index)开源插件

一方面这个插件可以再下次项目中派上用场，另一方面，这名开发者开发了一款开源插件，这或许可以成为他在将来面试的资本。

## 格式建议

### 左大括号不换行

我们建议左大括号与上一语句不换行来增强可读性

    //JavaScript
    function Nutjs(id){
        this.id=id;
    };
    if(typeof Nutjs == 'function'){
        var nutjs=new Nutjs();
    };

### JavaScript中语句结束后加分号

在JavaScript建议每一条语句都在语句结束后添加分号，善用分号可以大大的增强程序可读性

    //JavaScript
    function draw(tpl){
        var str = tpl
            .replace("#fx#"     ,this.fx)
            .replace("#workid#" ,this.workid)
            .replace("#date#"   ,this.date)
            .replace("#server#" ,this.server)
        ;
        return str;
    };

### 类 / 构造函数

类/构造函数的首字母要大写，这样有助于其他开发者区分。

    //JavaScript
    function Nutjs(id){
        this.id=id;
    };

    //PHP
    class Nutjs{
        protected $id;
    }

特别的，如果要将类/构造函数放在单独的文件中时，文件名要与类名相同，如果是PHP，还要添加.class后缀，如Nutjs.class.php


### 表单 / 数据库字段命名

所有的前后台数据交换均统一采用小写字母+下划线来命名字段名。

数据表和表字段名也要采用小写字母+下划线的方式。

    //HTML
    <label>姓名：<input name="user_name" /></label>
    <label>年龄：<input name="user_age" /></label>

    //SQL
    SELECT * FROM `invite_code`
    DELETE FROM `wa_token` WHERE `wa_token`.`user_id` = 'A000'

### 对象的属性和方法

对象中的属性和方法要采用首字母要小写的骆驼峰命名法，除常量外，请不要使用下划线

正确的命名

    //JavaScript
    document.getElementsByTagName();//js的原生方法

    //PHP
    class Peanut{
        public $fruitSize;
    }
    $peanut=new Peanut();
    $peanut->fruitSize ='2cm';

错误的命名

    //JavaScript
    document.get_element_by_tag_name();//是不是很怪异？

    //PHP
    class Peanut{
        public $fruit_size;
    }
    $peanut=new Peanut();
    $peanut->fruit_size ='2cm';

### 以下划线开头 / 结尾的语义

以单下划线“_”打头的函数/方法/属性

通常以下划线开头的情形多出现在对象的属性或方法中。以下划线“\”开头的函数/方法表示私有方法，一般为对象内部的系统方法，不建议外部调用，同样，以下划线“\”开头的属性为系统属性。
以双下划线“\\”打头的函数/方法

通常表示函数/方法是一个魔法方法，如 \\call 和 \\autoload，通常不建议开发者定义此类方法，除非你明确知道自己在做什么。
以双下划线“\\”打头并以双下划线“\\”结尾的常量

通常表示该常量是一个魔法常量，如 \\FILE\\ 和 \\DIR\\

### 常量的命名规范

一般来说常量要求全部字母大写并以下划线“_”分割，如HAS_ONE 和 MANY_TO_MANY 。但是对于本土语言非英语的人群来说是十分难以分辨的，因此我们建议采用下划线+骆驼峰的方式来命名

    //PHP
    //一般的常量命名
    define('MEMORY_CACHE_TIME'  ,3600);
    //采用下划线+骆驼峰
    define('Memory_Cache_Time'  ,3600 ,true);
    //甚至可以根据可读做出更为自由的调整
    define('RegExp_uid'         ,'/^\w\d{3}$/' ,true);

可以看到第二种的命名方式可读性要高于第一种。我们在第二中常量定义时加入第三个参数“true”，表示该常量读取对大小写不敏感，这样可以兼容传统读取。

这种命名方式虽然对性能有所损耗，但是带来的十分友好的可读性，因此是值得推广的。

### 文件扩展名

在Linux操作系统中是严格区分大小写的，因此我们建议统一采用小写文件扩展名，如`nutjs.jpg`

### JS中函数的形参

在函数定义过程中，我们建议使用以美元符号“$”开头来定义形参以增强可读性。

    //JavaScript
    function hello ($user){
        var msg=null;
        msg="hello "+$user;
        alert(msg);
    };

### 变量的命名建议

我们对于变量的命名不作出明确规范，有开发者自由命名，但是建议遵守以下几个原则:

- 变量名要符合其自身语义
- 变量命名时应避免首字母大写
- 建议采用骆驼峰或下划线+小写字母这2种方式进行命名

### 浏览器调试 / 兼容

开发过程中我们建议会员统一使用Firefox最新版或ESR版作为主开发调试工具，利用Firefox的强大调试插件Firebug可以大大的减轻调试难度

而对于浏览器兼容方面，我们建议开发者兼容如下列表

- Firefox最新版和ESR版
- Chrome最新版
- 主流国产浏览器急速内核
- IE11

建议开发者在HTML的head标签中加入如下meta标签

    <!-- 让IE浏览器以edge引擎渲染 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- 让双核浏览器用webkit引擎渲染 -->
    <meta name="renderer" content="webkit" />

