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
        data: {/* 请求参数对象 */},
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

### 3. 处理data参数

在发起AJAX请求之前，要把 data 对象处理成查询字符串才能提交给服务器。

```javascript
/**
 * @description: 把data对象，转化成查询字符串的形式，从而提交给服务器 
 * @param {data}  需要发送给服务器的对象
 * @return {string} 返回拼接好的查询字符串 name=zhangsan&age=10
 */
function resolveData(data) {
    var arr = [];
    for (var k in data) {
        arr.push(k + "=" + data[k]);
    }
    return arr.join("&");
}
```

### 4. 定义AJAX函数

```javascript
/**
 * @description: xhr对象请求服务器上的数据
 * @param {*} options 是服务器传过来的对象参数
 * @return {*}
 */
function packaging(options) {
    var xhr = new XMLHttpRequest();

    // 把外界传递过来的对象转换成查询字符串
    var qs = resolveData(options.data);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            options.success(result)
        }
    }
}
```

### 5. 判断请求的类型

不同的请求类型，对应xhr对象不同的操作，需要对请求类型进行 if ... else ... 操作。

```javascript
	if (options.method.toUpperCase() === 'GET') {
        // 发起GET请求
        xhr.open(options.method, options.url + '?' + qs);
        xhr.send();
    }else if (options.method.toUpperCase() === 'POST') {
        // 发情POST请求
        xhr.open(options.method, options.url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(qs);
    }
```

### 6. 完成封装

处理data参数的 js 函数：

```javascript
/**
 * @description: 把data对象，转化成查询字符串的形式，从而提交给服务器 
 * @param {data}  需要发送给服务器的对象
 * @return {string} 返回拼接好的查询字符串 name=zhangsan&age=10
 */
function resolveData(data) {
    var arr = [];
    for (var k in data) {
        arr.push(k + "=" + data[k]);
    }
    return arr.join("&");
}

// var res = resolveData({name: 'zhangsan', age: 10})
// console.log(res);

/**
 * @description: xhr对象请求服务器上的数据
 * @param {*} options 是服务器传过来的对象参数
 * @return {*}
 */
function packaging(options) {
    var xhr = new XMLHttpRequest();

    // 把外界传递过来的对象转换成查询字符串
    var qs = resolveData(options.data);

    // 判断请求类型
    if (options.method.toUpperCase() === 'GET') {
        // 发起GET请求
        xhr.open(options.method, options.url + '?' + qs);
        xhr.send();
    }else if (options.method.toUpperCase() === 'POST') {
        // 发情POST请求
        xhr.open(options.method, options.url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(qs);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            options.success(result)
        }
    }
}
```

使用封装函数的 html：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- 1. 导入自定义的ajax函数库 -->
    <script src="../js/处理data参数.js"></script>
</head>
<body>
    <script>
        packaging({
                method: 'GET',
                url: 'http://www.liulongbin.top:3006/api/getbooks',
                data: {
                    id: 1
                },
                success: function (res) { //成功的回调函数
                    console.log(res)	//打印数据
                }
            })

        // packaging({
        //         method: 'POST',
        //         url: 'http://www.liulongbin.top:3006/api/addbook',
        //         data: {
        //             bookname: 'JS百炼成仙',
        //             author: '杨逸飞',
        //             publisher: '人民出版社'
        //         },
        //         success: function (res) { //成功的回调函数
        //             console.log(res)	//打印数据
        //         }
        //     })
    </script>
</body>
</html>
```

## XMLHttpRequest Level 2新特性

### 1. timeout

AJAX有时操作很耗时，新版本增加了 timeout 属性设置超时限制，过了这个时限自动停止HTTP请求。

与之配套的 timeout 事件可以用来指定回调函数。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        var xhr = new XMLHttpRequest();

        // 设置超时时限 30毫秒
        xhr.timeout = 30;
        // 设置超时处理函数
        xhr.ontimeout = function() {
            console.log('请求超时了');
        }

        xhr.open('GET', 'http://www.liulongbin.top:3006/api/getooks');
        xhr.send();
        
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
            }
        }
    </script>
</body>
</html>
```

### 2. FormData对象管理表单数据

（1）通过FormData提交表单中的数据

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form id="form1">
        <input type="text" name="uname" autocomplete="off">
        <input type="password" name="upwd">
        <button type="submit">提交</button>
    </form>
    
    <script>
        // 1. 创建FormData实例
        // var fd = new FormData();
        // 2. 调用append函数向FormData表单中添加数据
        // fd.append('uname', 'zs');
        // fd.append('upwd', '111');

        // 1. 通过DOM操作获取表单
        var form = document.querySelector('#form1');
        // 2. 监听提交事件
        form.addEventListener('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            // 创建FormData实例
            var fd = new FormData(form);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://www.liulongbin.top:3006/api/formdata');
            xhr.send(fd);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            }
        }) 
    </script>
</body>
</html>
```

（2）上传文件

```html
<body>
    <!-- 文件选择器 -->
    <input type="file" id="file1">
    <!-- 上传按钮 -->
    <button id="btnUpload">上传</button>
    <!-- 显示上传成功以后的图片 -->
    <img src="" alt="" id="img" width="300">

    <!-- bootstrap进入条，需要引入bootstrap -->
    <div class="progress" style="width: 500px; margin: 15px">
        <div class="progress-bar progress-bar-striped active" id="percent"> 
        </div>
    </div>

    <script>
        //1. 获取文件上传按钮
        var btnUpload = document.querySelector('#btnUpload');
        //2. 为按钮绑定单机事件处理函数
        btnUpload.addEventListener('click', function() {
            //3. 获取用户选择的文件列表
            var files = document.querySelector('#file1').files;
            if(files.length <= 0) {
                return alert('请选择需要上传的文件');
            }
            var fd = new FormData();
            // 将用户选择的文件添加到FormData
            fd.append('avatar', files[0]);

            var xhr = new XMLHttpRequest();

            // 计算文件上传进度
            // 1.监听xhr.upload的onprogress事件
            xhr.upload.onprogress = function(e) {
                // e.lengthComputeable 是一个布尔值，判断上传文件是否有可计算的长度
                if(e.lengthComputable) {
                    //e.loaded是已传输字节
                    //e.total是总字节
                    var percentComplete = Math.ceil((e.loaded/e.total)*100);
                }
                var percent = document.querySelector('#percent');
                percent.innerHTML = percentComplete + '%';
                percent.style.width = percentComplete + '%'
            }
            // 2.监听是否上传完成
            xhr.upload.onload = function() {
                document.querySelector('#percent').className = 'progress-bar progress-bar-success';
            }

            xhr.open('POST', 'http://www.liulongbin.top:3006/api/upload/avatar');
            xhr.send(fd);

            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    if(data.status === 200){
                        // 上传成功
                        document.querySelector('#img').src = 'http://www.liulongbin.top:3006' + data.url;
                    }else {
                        // 上传失败，打印错误信息
                        console.log('上传失败') + data.message;
                    }
                }
            }
        })
    </script>

</body>
```

## 基于axios发起AJAX请求

axios是只专注于**网络数据请求**的库，相对于 XMLHttpRequest 和 JQuery 的库更加轻量化。

###  axios发起GET请求

发起GET请求的语法：`axios.get('url', {params: {/* 参数 */}}).then(callback)`

案例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
    <button id="btnGet">发起GET请求</button>
    
    <script>
        var btnGet = document.querySelector('#btnGet');
        btnGet.addEventListener('click', function() {
            var url = "http://www.liulongbin.top:3006/api/get";
            var paramsObj = {name: 'zs', age: 20}
            axios.get(url, {params: paramsObj}).then(function(res) {
                console.log(res);
            })
        })
    </script>
</body>
</html>
```

### axios发起POST请求

发起POST请求语法：`axios.post('url', {/* 参数 */}).then(callback)`

案例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
    <button id="btnPost">发起POST请求</button>
    
    <script>
        var btnPost = document.querySelector('#btnPost');
        btnPost.addEventListener('click', function() {
            var url = "http://www.liulongbin.top:3006/api/post";
            var data = {address: '南京', loacation: '鼓楼区'};
            axios.post(url, data).then(function(res) {
                var result = res.data;
                console.log(result);
            })
        })
    </script>
</body>
</html>
```

### 直接使用axios发起请求

用法如下：

```javascript
axios({
    method: '',
    url: '',
    data: {/* POST参数 */}
    params: {/* GET参数 */}
}).then(callback)
```

注意，POST请求只能用 **data** 传递数据，GET请求只能用 **params** 传递参数。

