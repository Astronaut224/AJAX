# 概念

AJAX的全称是Asynchronous JavaScript And XML（异步的JavaScript和XML），通俗的讲，就是在网页中通过XMLHttpRequest对象和服务器进行数据交互的方式。

## 接口的概念

使用AJAX请求数据的URL地址就叫做数据接口，每个接口必须有请求方式：

GET：向服务器拿数据

POST：向服务器提交数据

## XMLHttpRequest

XMLHttpRequest（xhr）是浏览器提供的JavaScript函数，通过它可以请求服务器上的数据资源。

### 使用xhr发起GET请求

```html
<script>
    // 1. 创建XHR对象
    var xhr = new XMLHttpRequest()
    // 2. 调用open函数，指定 请求方式 和 URL
    xhr.open('GET','http://www.liulongbin.top:3006/api/getbooks')
    // 3. 调用send函数，发器AJAX请求
    xhr.send()
    // 4. 监听onreadystatechange实践
    xhr.onreadystatechange = function() {
        // 4.1 监听xhr对象的请求状态readyState 与 服务器响应状态status
        if(xhr.readyState === 4 && xhr.status ===200) {
            // 4.2 打印服务器返回的数据
            console.log(xhr.responseText)
        }
    }
</script>
```

发起带参数的GET请求：

```javascript
xhr.open('GET'，'http://www.liulongbin.top:3006/api/getbooks?id=1')
```

#### 查询字符串

查询字符串就是在URL末尾加上用于向服务器发送数据的字符串（变量）

格式：URL?参数=值

### 使用xhr发起POST请求

```html
<script>
    // 1. 创建xhr对象
    var xhr = new XMLHttpRequest()
    // 2. 调用open()
    xhr.open('POST', 'http://www.liulongbin.top:3006/api/addbook')
    // 3. 设置 Content-Type属性 （固定写法）
    xhr.setRequestHeader('Content-Type', 'application/x-www.form-urlencoded')
    // 4. 调用send()，同时将数据以查询字符串的形式提交给服务器
    xhr.send('bookname=水浒传&author=施耐庵&publisher=天津图书出版社')
    // 5. 监听o onreadystatechange 事件
    xhr.onreadystatechange = function() {
        if (xhr.readyState ===4 && xhr.status === 200) {
            console.log(xhr.responseText)
        }
    }
</script>
```

## 数据交换格式

数据交换格式有XML和JSON两种，JSON更小更易解析，主要使用JSON。

### JSON的两种结构

- 对象结构：表示为{key: value, key: value ...}括起来的键值对内容。

注意点：

1. JSON中key和value用的都是双引号""，不允许使用单引号''
2. value的数据类型可以是数字、字符串、布尔值、null、数组和对象6种类型。

### JSON和JS对象的转换

使用 JSON.parse() 方法可以将 JSON 字符串转换成 JS 对象。

```html
<script>
    var JsonStr = '{"a": "Hello", "b": "World"}';
    var JSObj = JSON.parse(JsonStr);
    console.log('JSObj:', JSObj);
    // 结果是 {a: 'Hello', b: 'World'}
</script>
```

应用场景：向接口请求数据获取到的 JSON 字符串，需要转换成 JS 对象方便操作。

 

使用 JSON.stringify() 方法可以将 JS 对象 转换成 JSON 字符串。

```html
<script>
    var JSObj1 = {a: 'Hello', b: 'World'};
    var JsonStr1 = JSON.stringify(JSObj1);
    console.log('JSONStr1:', JSONStr1);
    // 结果是 '{"a":"Hello","b":"World"}'
</sript>
```

## 封装自定义AJAX函数

### 1. 目标效果

最终要实现，导入自己封装好的AJAX函数库后，调用里面的函数发起AJAX请求。

```html
<!-- 1. 导入自定义的ajax函数库 -->
<script src="../js/处理data参数.js"></script>

<script>
    // 2. 调用函数库中的packaging函数，发起AJAX请求
    packaging({
        method: '请求类型',
        url: '请求地址',
        data: {/* 请求参数对象 */}，
        success: function(res) { //成功的回调函数
        console.log(res)	//打印数据
    } 
    })
</script>
```

### 2. options参数选项

packaging函数中的参数有：

- method：请求的类型
- url：请求的URL地址
- data：请求携带的数据
- success：请求成功之后的回调函数

