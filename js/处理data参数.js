/*
 * @Author: wangyuhang 1398838410@qq.com
 * @Date: 2022-09-23 11:14:15
 * @LastEditors: wangyuhang 1398838410@qq.com
 * @LastEditTime: 2022-09-26 15:11:50
 * @FilePath: \AJAX\js\处理data参数.js
 * @Description: 
 * 
 * Copyright (c) 2022 by wangyuhang 1398838410@qq.com, All Rights Reserved. 
 */
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
