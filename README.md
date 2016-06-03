#validator.js

validator.js 是一个轻量级 JavaScript 表单、字符串验证库

## 特性

 1. 轻量级
 2. 无依赖
 3. 表单验证
 4. 字符串验证

## 快速上手

表单验证：

```html
<form id="validate_form" novalidate="">
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
            messages: "不能为空 | 请输入合法邮箱 | 输入的文字太长"
        },
        phone: {
            rules: 'is_phone',
            messages: "手机号： {{phone}} 不合法"
        }
    }
});
```

字符串验证：

```js
// 返回布尔值
var v = new Validator();
v.isEmail('example@qq.com');
v.isIp('192.168.1.1');
v.isPhone('17011122223');
v.lessThan('11', '22');
v.greaterThanDate('2010-01-02', '2010-01-01');
```


## 说明文档

> new Validator(formName, options)

### 参数（可选，无参为字符串验证）

`formName` （必需） 是标签中 `<form>` 中的 `id` 或者 `name` 的值

`options` （必需） 是 Validator 的第二个参数

  * `fields` 表单验证域 `rules` 和 `messages` 集合
  * `errorPlacement` （可选） 错误信息位置
  * `callback` （可选） 验证成功后回调函数

### 参数详细

`fields` ：

```js
fields: {
    email: {
        rules: 'required | is_email | max_length(32)',
        messages: "不能为空 | 请输入合法邮箱 | 输入的文字太长"
    }
}
```

注：'email' 为表单 'name' 属性<br />
`rules` ： 一个或多个规则（中间用` | `间隔）<br />
`messages` ： 验证错误要提示的文字（多条中间用` | `间隔） `{{这个中间是name对应的值}}` <br />

`errorPlacement`：

```js
errorPlacement: function(errorEl, fieldEl) {
    // 非 label 、radio 元素
    if (fieldEl.parentNode !== undefined) {
        fieldEl.parentNode.appendChild(errorEl);
    } else {
        fieldEl[0].parentNode.parentNode.parentNode.appendChild(errorEl);
    }
},
```

注： 'errorEl' 为错误信息节点，'fieldEl' 为出现错误的表单节点

`callback`：

```js
callback: function(event) {
    // 阻止提交
    event.preventDefault();
    // 自定义逻辑
}
```

注： 'event' 事件



### 方法

`.validate()`

注： validator.js 默认使用 submit 按钮提交进行拦截验证，可手动调用 `.validate()` 调用验证 form 所有定义过的元素

`.validateByName(name)`

注： validator.js 默认使用表单改变事件拦截验证，当使用 js 方法改变表单的值时，可手动调用 `.validateByName(name)` 进行验证单个域， 'name' 参数为 表单域的 'name' 属性

`.addMethod(name, method)`

注： 当遇到 validator.js 提供的默认方法无法实现验证的时候，添加`.addMethod(name, method)`方法进行扩展<br />
'name' 为校验名称，格式： is_date<br />
'method' 为自定义方法

如：
```js
// checkbox 至少选择两项 方法
// 扩展内部验证方法 field: 验证域， param: 参数 如 select_limit(2)
validator.addMethod('select_limit', function(field, param) {
    // 选择的条目数
    var checkedNum = 0;
    for (var i = 0, elLength = field.el.length; i < elLength; i++) {
        if (field.el[i].checked) {
            checkedNum += 1;
        }
    }
    return checkedNum >= param;
});
```


## 参考

- [jaywcjlove/validator.js](https://github.com/jaywcjlove/validator.js)一个字符串验证器和表单验证的库
- [chriso/validator.js](https://github.com/chriso/validator.js)一个字符串验证器和转换类型的库
