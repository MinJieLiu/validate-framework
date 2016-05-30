validator.js
===================================
### 特性
 * 轻量级
 * 无依赖
 * 表单验证
 * 字符串验证

安装使用
-----------------------------------

html:

```html 
<script src="dist/validator.min.js"></script>
```

js:
```js
// 字符串验证
var validator = require('validator.js');
var v = new validator();
v.isEmail('example@example.com');
v.isIp('192.168.1.1');

// 表单验证
var a = new validator('example_form', [{
    // 业务逻辑
}], function(obj, evt) {
    if (obj.errors) {
        // 判断是否错误
    }
});
```


应用在表单中的方法。

```html 
<form id="example_form">
    <div>
        <label for="email">邮箱验证</label>
        <input type="email" name="email" id="email" class="form-control" placeholder="Email">
    </div>
</form>
<script type="text/javascript">
    var validator = new Validator('example_form', [{
        name: 'email',
        display: "你输入的{{email}}不是合法邮箱|不能为空|太长|太短",
        rules: 'valid_email|required|max_length(12)|min_length(2)'
    }, {
        name: 'sex',
        display: "请你选择性别{{sex}}",
        rules: 'required'
    }], function(obj, evt) {
        if (obj.errors) {
            // 判断是否错误
        }
    });
</script>
```


## 说明文档

> new Validator(formName, option, callback)

### formName

`formName` 是标签中`<form>` 中的 `id` 或者 `name` 的值，如上面的`example_form`

### option

- `name` -> input 中 `name` 对应的值
- `display` -> 验证错误要提示的文字 `{{这个中间是name对应的值}}` 
- `rules` -> 一个或多个规则(中间用`|`间隔)

    - `is_email` -> 验证合法邮箱
    - `is_ip` -> 验证合法 ip 地址
    - `is_fax` -> 验证传真
    - `is_tel` -> 验证座机
    - `is_phone` -> 验证手机
    - `is_url` -> 验证URL
    - `required` -> 是否为必填
    - `max_length` -> 最大字符长度
    - `min_length` -> 最小字符长度

```js 
{
    //name 字段
    name: 'email',
    display:"你输入的不{{email}}是合法邮箱|不能为空|太长|太短",
    // 验证条件
    rules: 'is_email|max_length(12)'
    // rules: 'valid_email|required|max_length(12)|min_length(2)'
}
```

### callback

```js 
var validator = new Validator('example_form',[
    {...},{...}
],function(obj,evt){
    //obj = {
    //  callback:(error, evt, handles)
    //  errors:Array[2]
    //  fields:Object
    //  form:form#example_form
    //  handles:Object
    //  isCallback:true
    //  isEmail:(field)
    //  isFax:(field)
    //  isIp:(field)
    //  isPhone:(field)
    //  isTel:(field)
    //  isUrl:(field)
    //  maxLength:(field, length)
    //  minLength:(field, length)
    //  required:(field)
    //} 
    if(obj.errors.length>0){
        // 判断是否错误
    }
})
```

## 例子

### 字符串验证 

```js
var v = new Validator();
v.isEmail('wowohoo@qq.com'); // -> 验证合法邮箱  |=> 返回布尔值
v.isIp('192.168.23.3'); // -> 验证合法 ip 地址  |=> 返回布尔值
v.isFax(''); // -> 验证传真  |=> 返回布尔值
v.isPhone('13622667263'); // -> 验证手机  |=> 返回布尔值
v.isTel('021－324234-234'); // -> 验证座机  |=> 返回布尔值
v.isUrl('http://JSLite.io'); // -> 验证URL  |=> 返回布尔值
v.maxLength('JSLite',12); // -> 最大长度  |=> 返回布尔值
v.minLength('JSLite',3); // -> 最小长度  |=> 返回布尔值
v.required('23'); // -> 是否为必填(是否为空)  |=> 返回布尔值
```

### 表单中验证

**点击按submit按钮验证** 

```js 
var validator = new Validator('example_form',[
    {
        //name 字段
        name: 'email',
        display:"你输入的不{{email}}是合法邮箱|不能为空|太长|太短",
        // 验证条件
        rules: 'is_email|max_length(12)'
        // rules: 'valid_email|required|max_length(12)|min_length(2)'
    },{
        //name 字段
        name: 'sex',
        display:"请你选择性别{{sex}}",
        // 验证条件
        rules: 'required'
    }
],function(obj,evt){
    if(obj.errors){
        // 判断是否错误
    }
})
```

**没有submit验证**

```js 
var validator = new Validator('example_form',[
    {
        //name 字段
        name: 'email',
        display:"你输入的不{{email}}是合法邮箱|不能为空|太长|太短",
        // 验证条件
        rules: 'is_email|max_length(12)'
        // rules: 'valid_email|required|max_length(12)|min_length(2)'
    },{
        //name 字段
        name: 'sex',
        display:"请你选择性别{{sex}}",
        // 验证条件
        rules: 'required'
    }
],function(obj,evt){
    if(obj.errors){
        // 判断是否错误
    }
})
validator.validate()
```


## 参考

借鉴优秀的库

- [jaywcjlove/validator.js](https://github.com/jaywcjlove/validator.js)一个字符串验证器和表单验证的库
- [chriso/validator.js](https://github.com/chriso/validator.js)一个字符串验证器和转换类型的库
