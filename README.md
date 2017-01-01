#validate-framework

[![npm version](https://badge.fury.io/js/validate-framework.svg)](https://badge.fury.io/js/validate-framework)

一款轻量、无依赖的 JavaScript 验证组件

Demo： [http://minjieliu.github.io/validate-framework/example](http://minjieliu.github.io/validate-framework/example)

## 特性

 1. 轻量、无依赖
 1. 相同 name 的表单验证
 1. 动态验证
 1. 兼容 chrome 、firfox 、IE9 +

## 快速上手

通过 `npm` 安装

    npm install validate-framework --save


基本用法：

```html
<form name="basicForm">
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
import validateFramework from 'validate-framework';

const validator = new validateFramework({
  formName: 'basicForm',
  fields: {
    email: {
      rules: 'required | isEmail | maxLength(32)',
      messages: "不能为空 | 请输入合法邮箱 | 不能超过 {{param}} 个字符"
    },
    phone: {
      rules: 'isPhone',
      messages: "手机号： {{value}} 不合法"
    }
  },
  callback: function (result, error) {
    // 阻止表单提交
    validator.preventSubmit();
    // do something...
  }
});

// 验证
validator.validate();
```

## 说明文档

> new validateFramework(options)

### options

**`options`** （必选）

  * `formName` （必选） 是 `<form>` 中的 `name` 或者 `id` 的值
  * `fields` （可选） 表单验证域 `rules` 和 `messages` 集合，后续可通过 `.addMethods(methods)` 和 `.removeMethods(...names)` 进行变更
  * `errorPlacement` （可选） 错误信息位置
  * `callback` （可选） 表单提交 或 `.validate()` 调用后触发
  * `classNames` （可选） 验证正确或错误 class

### 参数示例

**`fields`** ：

```js
fields: {
  email: {
    rules: 'required | isEmail | maxLength(32)',
    messages: "不能为空 | 请输入合法邮箱 | 不能超过 {{param}} 个字符"
  },
  phone: {
    rules: 'isPhone',
    messages: "手机号： {{value}} 不合法"
  }
}
```

注： `email` 、`phone` 为表单 `name` 属性<br />
`rules` ：（必选） 一个或多个规则（中间用 ` | ` 分隔）<br />
`messages` ：（可选） 相对应的错误提示（中间用 ` | ` 分隔） `{{value}}` 为表单中的 value 值， `{{param}}` 为 `maxLength(32)` 的参数

**`errorPlacement`** ：

```js
errorPlacement: function (errorEl, fieldEl) {
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
callback: function (result, error) {
  // 自定义逻辑
  if (errors) {
      // do something...
  }
}
```

注： `result` 验证结果<br />
`error` 验证失败的错误集合


### 方法

 * 除返回值为 Boolean 类型的方法都支持链式调用

**`.validate()` 手动验证**

返回值为 `Boolean`<br />
注： 默认使用 submit 按钮提交进行拦截验证，可手动调用 `.validate()` 调用验证所有定义过的元素

**`.validateByName(name)` 通过 name 验证单个表单域**

返回值为 `Boolean`<br />

**`.preventSubmit()` 阻止表单提交**

**`.addMethods(methods)` 自定义验证方法**

如：
```js
// checkbox 至少选择两项 方法
validator.addMethods({
  selectLimit: function (field, param) {
    // checkbox 至少选择两项
    var checkedNum = 0;
    for (var i = 0, elLength = field.el.length; i < elLength; i++) {
      if (field.el[i].checked) {
        checkedNum += 1;
      }
    }
    return checkedNum >= param;
  },
});
```

**`.addFields(fields)` 动态添加 fields 方法**

注：通过 `.addFields(fields)` 来动态新增一个或多个表单验证域

```js
validator.addFields({
  userName: {
    rules: 'required | isRealName',
    messages: "不能为空 | 请输入真实姓名"
  }
});
```

**`.removeFields(...names)` 移除 fields 方法**

```js
// 移除单个
validator.removeFields('userName');
// 移除多个
validator.removeFields('userName', 'email');
```

## 内置验证方法

如：
```js
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

## LICENSE

MIT
