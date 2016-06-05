#validator.js

[![Build Status](https://travis-ci.org/MinJieLiu/validator.js.svg?branch=master)](https://travis-ci.org/MinJieLiu/validator.js)


validator.js 是一个轻量级 JavaScript 表单、字符串验证库

Demo： [http://minjieliu.github.io/validator.js/example](http://minjieliu.github.io/validator.js/example)

## 特性

 1. 轻量级
 2. 无依赖
 3. 表单验证
 4. 字符串验证


## 快速上手

通过 `bower` 安装

    bower install validate-framework

通过 `npm` 安装

    npm install validate-framework


表单验证：

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
var validator = new Validator('validate_form', {
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
    // 参数：errorEl 错误信息节点，fieldEl 出现错误的表单节点
    errorPlacement: function(errorEl, fieldEl) {
        // 错误位置
    },
    callback: function(event) {
        // 阻止表单提交
        validator.preventSubmit();
        // 回调函数
    }
});
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



## 表单验证说明文档

> new Validator(formName, options)

### 参数（可选，无参为字符串验证）

**`formName`** （必需） 是标签中 `<form>` 中的 `id` 或者 `name` 的值

**`options`** （必需） 是 Validator 的第二个参数

  * `fields` 表单验证域 `rules` 和 `messages` 集合
  * `errorPlacement` （可选） 错误信息位置
  * `callback` （可选） 验证成功后回调函数

### 参数详细

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

注： `email` 、`phone` 为表单 `name` 属性<br />
`rules` ： 一个或多个规则（中间用 ` | ` 分隔）<br />
`messages` ： 相对应的错误提示（中间用 ` | ` 分隔） `{{value}}` 为表单中的 value 值， `{{param}}` 为 `max_length(32)` 的参数 <br />

**`errorPlacement`** ：

```js
errorPlacement: function(errorEl, fieldEl) {
    // 非 label 、radio 元素
    if (fieldEl.parentNode !== undefined) {
        fieldEl.parentNode.appendChild(errorEl);
    }
},
```

注： `errorEl` 为错误信息节点，`fieldEl` 为出现错误的表单节点
验证失败后 validator.js 会在类似文本框表单中添加 `valid-error` ， checkbox、radio 中添加 `valid-label-error` 错误信息中添加 `valid-error-message` class 类

**`callback`** ：

```js
callback: function(event) {
    // 自定义逻辑
}
```

注： `event` 事件


### 方法

例如：
```js
validator.validate();
```

**`.validate()` 手动验证**

注： validator.js 默认使用 submit 按钮提交进行拦截验证，可手动调用 `.validate()` 调用验证 form 所有定义过的元素

**`.validateByName(name)` 手动验证单个表单域**

注： validator.js 默认使用表单改变事件拦截验证，当使用 js 方法改变表单的值时，可手动调用 `.validateByName(name)` 进行验证单个域， `name` 参数为 表单域的 `name` 属性

**`.preventSubmit()` 阻止表单提交**

**`.addMethod(name, method)` 自定义验证方法**

注： 当遇到 validator.js 提供的默认方法无法实现验证的时候，添加`.addMethod(name, method)`方法进行扩展<br />
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

## 字符串验证说明文档

如：
```js
var v = new Validator();
v.isEmail('example@qq.com');
v.isPhone('170111222231');
```

- [x] required(field) 验证必填
- [x] isAbc(field) 验证字母数字下划线
- [x] isDate(field) 验证日期
- [x] isDecimal(field) 验证浮点数
- [x] isEmail(field) 验证邮箱
- [x] isInteger(field) 验证整数
- [x] isIp(field) 验证 ip 地址
- [x] isNumeric(field) 验证自然数
- [x] isPhone(field) 验证手机
- [x] isTel(field) 验证座机
- [x] isUrl(field) 验证URL
- [x] maxLength(field, length) 最大长度
- [x] minLength(field, length) 最小长度
- [x] greaterThan(field, param) 多于某个数
- [x] lessThan(field, param) 少于某个数
- [x] greaterThanDate(field, date) 大于某个日期
- [x] lessThanDate(field, date) 小于某个日期



## 备注

validator.js 只包含验证实现，不包括 UI，因此 UI 部分可以自由发挥。<br />
因注重结构和逻辑分离，validator.js 暂不考虑将验证表达式加入 html 结构中，以保持良好的可维护性。（Demo 中只是为了演示并没有将结构和逻辑分离）<br />
validator.js 支持 chrome、firfox、IE9 以上浏览器，暂不准备为兼容低版本浏览器而牺牲更大体积，但表单提交验证支持 IE6 以上浏览器

## 规范

validator.js 采用 `eslint` 来保持代码的正确性和可读性，详情见 `.eslintrc` 文件

## LICENSE

MIT

## 参考

https://github.com/jaywcjlove/validator.js
