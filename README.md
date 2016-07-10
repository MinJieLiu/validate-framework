#validator.js

[![Build Status](https://travis-ci.org/MinJieLiu/validator.js.svg?branch=master)](https://travis-ci.org/MinJieLiu/validator.js)
[![npm version](https://badge.fury.io/js/validate-framework.svg)](https://badge.fury.io/js/validate-framework)

一款轻量、强大、无依赖、前后端通用的 JavaScript 验证组件

Demo： [http://minjieliu.github.io/validator.js/example](http://minjieliu.github.io/validator.js/example)

## 特性

 1. 轻量、无依赖
 2. 自由，可脱离 `<form>` 验证
 3. 前后端通用 （支持 express）
 4. 字符串验证
 5. 易于扩展
 6. 相同 name 的表单验证
 7. 动态验证
 8. 兼容 chrome 、firfox 、IE6 +


## 快速上手

通过 `bower` 安装

    bower install validate-framework

通过 `npm` 安装

    npm install validate-framework


基本用法：

```html
<form id="validate_form">
    <div class="form-group">
        <label for="email">邮箱：</label>
        <input class="form-control" id="email" name="email" type="email" placeholder="请输入邮箱" />
    </div>
    <div class="form-group">
        <label for="phone">手机：</label>
        <input class="form-control" id="phone" name="phone" type="text" placeholder="请输入手机号" />
    </div>
    <input class="btn btn-primary" id="submit" type="submit" value="提交" />
</form>
```

```js
var validator = new Validator({
    formName: 'validate_form',
    fields: {
        email: {
            rules: 'required | is_email | max_length(32)',
            messages: "不能为空 | 请输入合法邮箱 | 不能超过 {{param}} 个字符"
        },
        phone: {
            rules: 'is_phone',
            messages: "手机号： {{value}} 不合法"
        }
    },
    callback: function(errors, event) {
        // 阻止表单提交
        validator.preventSubmit();
        // do something...
    }
});
```

无 `<form>` 用法：

```html
<div class="form-group">
    <label for="email">邮箱：</label>
    <input class="form-control" id="email" name="email" type="email" placeholder="请输入邮箱" />
</div>
```

```js
var validator = new Validator({
    fields: {
        email: {
            rules: 'required | is_email | max_length(32)',
            messages: "不能为空 | 请输入合法邮箱 | 不能超过 {{param}} 个字符"
        }
    },
    callback: function(errors, event) {
        // do something...
    }
});
// 手动触发验证
validator.validate();
```

服务端用法：

```js
var bodyData = {
    email: "example#example.com",
    birthday: "2012-12-12"
};
var validator = new Validator({
    bodyData: bodyData,
    fields: {
        email: {
            rules: 'required | is_email | max_length(32)',
            messages: "不能为空 | 请输入合法邮箱 | 不能超过 {{param}} 个字符"
        },
        birthday: {
            rules: 'required | is_date',
            messages: "不能为空 | 请输入合法日期"
        }
    },
    callback: function(errors, event) {
        // do something...
    }
});
// 手动触发验证
validator.validate();
```


字符串验证：

```js
// 返回布尔值
var v = new Validator();
v.isEmail('example@qq.com');
v.isIp('192.168.1.1');
v.isPhone('170111222231');
v.lessThan('11', '22');
v.greaterThanDate('2010-01-02', '2010-01-01');
```



## 说明文档

> new Validator(options)

### 参数（可选，无参为字符串验证）

**`options`** （可选） 是 Validator 的第二个参数

  * `formName` （可选） 是 `<form>` 中的 `name` 或者 `id` 的值
  * `bodyData` （可选） 此参数用作 express 服务端的数据接收入口。此参数与`formName` 、`errorPlacement` 等 DOM 相关的参数不可同时存在
  * `fields` （可选） 表单验证域 `rules` 和 `messages` 集合，后续可通过 `.addMethod(name, method)` 和 `.removeFields(fieldNames)` 进行变更
  * `errorPlacement` （可选） 错误信息位置，默认位置为表单元素的后一个元素
  * `callback` （可选） 表单提交 或 `.validate()` 调用后触发
  * `errorClass` （可选） 验证错误 css 类，默认 `valid-error`
  * `errorEl` （可选） 验证错误创建的元素，默认 `em`
  * `eventLevel` （可选） 用户编辑表单后 触发事件级别，有三种参数可选： `off` 不监听，`change` 监听改变事件， `all` 监听输入事件和改变事件，默认 `all`。

### 参数示例

**`fields`** ：

```js
fields: {
    email: {
        rules: 'required | is_email | max_length(32)',
        messages: "不能为空 | 请输入合法邮箱 | 不能超过 {{param}} 个字符"
    },
    phone: {
        rules: 'is_phone',
        messages: "手机号： {{value}} 不合法"
    }
}
```

**`bodyData`** ： 遵循为 express 的 body-parser 表单数据格式：`{email: "example#example.com", birthday: "2012-12-12"}`

注： `email` 、`phone` 为表单 `name` 属性<br />
`rules` ：（必选） 一个或多个规则（中间用 ` | ` 分隔）<br />
`messages` ：（可选） 相对应的错误提示（中间用 ` | ` 分隔） `{{value}}` 为表单中的 value 值， `{{param}}` 为 `max_length(32)` 的参数

**`errorPlacement`** ：

```js
errorPlacement: function(errorEl, fieldEl) {
    // 非 label 、radio 元素
    if (fieldEl.parentNode !== undefined) {
        fieldEl.parentNode.appendChild(errorEl);
    }
},
```

注： `errorEl` 为错误信息节点，`fieldEl` 为验证的表单节点
验证失败后，表单中会添加 `valid-error` ， 错误信息中添加 `valid-error-message` 类名

**`callback`** ：

```js
callback: function(errors, event) {
    // 自定义逻辑
    if (errors) {
        // do something...
    }
}
```

注： `event` 当前事件<br />
`errors` 验证失败的错误 json 集合。表单验证成功， `errors` 的值为 `null`


### 方法

 * 方法都支持链式调用

**`.validate()` 手动验证**

注： 默认使用 submit 按钮提交进行拦截验证，可手动调用 `.validate()` 调用验证所有定义过的元素，返回值为 `Boolean`

如：
```js
if (validator.validate()) {
    // do something...
};
```

**`.validateByName(name)` 手动验证单个表单域**

注： 默认使用表单改变事件拦截验证，当使用 js 方法改变表单的值时，可手动调用 `.validateByName(name)` 进行验证单个域<br />
`name` 参数为 表单域的 `name` 属性，返回值为 `Boolean`

**`.preventSubmit()` 阻止表单提交**  无 `<form>` 的表单验证，则参数无效

**`.addMethod(name, method)` 自定义验证方法**

注： 当遇到默认方法无法实现验证的时候（大多数情况），添加`.addMethod(name, method)`方法进行扩展<br />
`name` 为校验名称，格式： is_date<br />
`method` 为自定义方法

如：
```js
// checkbox 至少选择两项 方法
// 扩展内部验证方法 field: 验证域， param: 参数 如 select_limit(2)
validator.addMethod('select_limit', function(field, param) {
    // checkbox 至少选择两项
    var checkedNum = 0;
    for (var i = 0, elLength = field.el.length; i < elLength; i++) {
        if (field.el[i].checked) {
            checkedNum += 1;
        }
    }
    return checkedNum >= param;
});
```

**`.onInputEvent(name, level)` 绑定用户输入事件和改变事件** 

注：`name` name 属性， `level` 事件级别：有三种参数可选： `off` 不监听，`change` 监听改变事件， `all` 监听输入事件和改变事件，默认 `all`<br />
如：ajax 验证不需要很高的触发频率，可设置为 `change` 或 `off` 进行手动验证

**`.addFields(fields)` 动态添加 fields 方法**

注： 满足更多动态验证表单的需求。可通过 `.addFields(fields)` 来动态新增一个或多个表单验证域，参数和上述 `fields` 用法一样

```js
validator.addFields({
    userName: {
        rules: 'required | is_real_name',
        messages: "不能为空 | 请输入真实姓名"
    }
});
```

**`.removeFields(fieldNames)` 动态移除 fields 方法**

注： 满足更多动态验证表单的需求。可通过 `.removeFields(fieldNames)` 来动态移除一个表单验证域，移除之后，验证器不验证该元素<br />
`fieldNames` 类型为 Array

```js
// 移除单个
validator.removeFields(['userName']);
// 移除多个
validator.removeFields(['userName', 'email']);
```

**其他**

 1. [动态验证] 当 `field` 验证条件存在，DOM节点不存在时，如果 `field` 包含 `required` 条件，则最终验证不通过，否则通过验证。
 2. [事件监听] 如果动态验证中，新增节点，默认不会有表单监听，这时需 手动调用 `.onInputEvent(name, level)` 添加监听，无 `<form>` 表单默认无监听
 3. [错误信息] 错误位置提示信息，`checkbox`、`radio` 元素对于 `label` 元素的位置不固定，各个 UI 组件不统一，默认不设置

## 内置验证方法

如：
```js
var v = new Validator();
v.isEmail('example@qq.com');
v.isPhone('170111222231');
```

- [x] required(param)  验证必填
- [x] isAbc(param)  验证字母数字下划线
- [x] isDate(param)  验证日期
- [x] isDecimal(param)  验证浮点数
- [x] isEmail(param)  验证邮箱
- [x] isInteger(param)  验证整数
- [x] isIp(param)  验证 ip 地址
- [x] isNumeric(param)  验证自然数
- [x] isPhone(param)  验证手机
- [x] isTel(param)  验证座机
- [x] isUrl(param)  验证URL
- [x] maxLength(param, length)  最大长度
- [x] minLength(param, length)  最小长度
- [x] greaterThan(param1, param2)  多于某个数
- [x] lessThan(param1, param2)  少于某个数
- [x] greaterThanDate(date1, date2)  大于某个日期
- [x] lessThanDate(date1, date2)  小于某个日期

验证方法不够？ `.addMethod(name, method)` 添加自定义验证方法（与表单验证自定义方法类似）


## 备注

`validate-framework`组件只包含验证实现，不包括 UI，因此 UI 部分可以自由发挥<br />
`validate-framework`不依赖 jQuery 及其他类库，可结合 jQuery 及其他类库使用


##与 1.x.x API 变更

 1. 将 `formName` 位置放入 `options` 中，并可允许不是必选项
 2. 动态添加的表单元素，需添加监听方法 `.onInputEvent(name, level)`
 3. `callback` 参数中，方法 errors, event 顺序改变
 4. `removeFields` 只允许数组参数
 5. 内部变量 `field.el` 的 `el` 为数组形式

## 规范

`validate-framework`采用 `eslint` 来保持代码的正确性和可读性，详情见 `.eslintrc` 文件


## 更新日志

### v2.0.0

1.  [新增] 服务端验证
2.  [新增] 无 <form> 验证
3.  [修改] `formName` 为非必选项
4.  [修改] 多处重构
5.  [修改] 调整 API

### v1.4.1

1.  [修正] 执行 `.removeFields` 方法后，应删除对应的错误域
2.  变更 email 正则
3.  注释修正

### v1.4.0

1.  [新增] `.addFields` 和 `.removeFields` 扩展方法
2.  实现动态验证表单域
3.  微调内部函数结构

### v1.3.0

1.  [新增] 相同 name 属性表单验证
2.  兼容未在 dom 中的元素，可预先定义
3.  微调内部函数名称


## LICENSE

MIT

## 参考

https://github.com/jaywcjlove/validator.js
