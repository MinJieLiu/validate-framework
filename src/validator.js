/**
 * 正则表达式
 */
var regexs = {

    // 匹配 max_length(12) => ['max_length', 12]
    rule: /^(.+?)\((.+)\)$/,

    // 数字
    numeric: /^[0-9]+$/,

    // 邮箱
    email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,

    // IP地址 [ip ipv4、ipv6]
    ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,

    // 电话号码
    tel: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,

    // 手机号码
    phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/,

    // 字母数字或下划线
    abc: /^[a-zA-Z0-9_]*$/,

    // URL
    url: /[a-zA-z]+:\/\/[^\s]/,

    // 日期
    date: /^\d{4}-\d{1,2}-\d{1,2}$/
};

var _testHook = {

    // 验证邮箱
    is_email: function(field) {
        return regexs.email.test(getValue(field));
    },

    // 验证 ip 地址
    is_ip: function(field) {
        return regexs.ip.test(getValue(field));
    },

    // 验证座机
    is_tel: function(field) {
        return regexs.tel.test(getValue(field));
    },

    // 验证手机
    is_phone: function(field) {
        return regexs.phone.test(getValue(field));
    },

    // 验证字母数字下划线
    is_abc: function(field) {
        return regexs.abc.test(getValue(field));
    },

    // 验证URL
    is_url: function(field) {
        return regexs.url.test(getValue(field));
    },

    // 验证日期
    is_date: function(field) {
        // 解析日期
        var _date = getValue(field);
        if (regexs.date.test(_date)) {
            _date = _date.split('-');
            var year = parseInt(_date[0], 10);
            var month = parseInt(_date[1], 10);
            var day = parseInt(_date[2], 10);

            if (year < 1 || year > 9999 || month < 1 || month > 12) {
                return false;
            }

            var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            // 闰年2月29号
            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                numDays[1] = 29;
            }

            // 检查日期
            if (day < 1 || day > numDays[month - 1]) {
                return false;
            }
            return true;
        }
        return false;
    },

    // 是否为必填
    required: function(field) {
        var value = getValue(field);
        if ((field.type === 'checkbox') || (field.type === 'radio')) {
            return (field.checked === true);
        }
        return (value !== null && value !== '');
    },

    // 最大长度
    max_length: function(field, length) {
        if (!regexs.numeric.test(length)) return false;
        return (getValue(field).length <= parseInt(length, 10));
    },

    // 最小长度
    min_length: function(field, length) {
        if (!regexs.numeric.test(length)) return false;
        return (getValue(field).length >= parseInt(length, 10));
    }
};

/**
 * Validator 对象
 * @param {Object} form节点
 * @param {Object} 验证对象（参数）
 * @param {Object}
 */
var Validator = function(formEl, fields, callback) {

    // 将验证方法绑到 Validator 对象上
    for (var a in _testHook) this[toCamelCase(a)] = _testHook[a];

    this.callback = callback || function() {};
    this.form = _formElement(formEl) || {};
    this.errors = [];
    this.fields = {};
    this.handles = {};

    // 如果不存在 form 对象
    if (!formEl) return this;

    for (var i = 0, fieldLength = fields.length; i < fieldLength; i++) {

        var field = fields[i];

        // 如果通过不正确，我们需要跳过该领域。
        if ((!field.name && !field.names) || !field.rules) {
            console.warn(field);
            continue;
        }

        // 构建具有所有需要验证的信息的主域数组
        if (field.names) {
            for (var j = 0, fieldNamesLength = field.names.length; j < fieldNamesLength; j++) {
                addField(this, field, field.names[j]);
            }
        } else {
            addField(this, field, field.name);
        }
    }

    // 使用表单值改变拦截
    this.form.onchange = (function(that) {
        return function(evt) {
            try {
                return that.validate(evt);
            } catch (e) {}
        };
    })(this);

    // 使用 submit 按钮拦截
    var _onsubmit = this.form.onsubmit;
    this.form.onsubmit = (function(that) {
        return function(evt) {
            try {
                return that.validate(evt) && (_onsubmit === undefined || _onsubmit());
            } catch (e) {}
        };
    })(this);
};

Validator.prototype = {
    /**
     * 在提交表单时进行验证。或者直接调用validate
     * @param  {Object} 当前事件
     * @return {Object}
     */
    validate: function(evt) {

        this.handles['ok'] = true;
        this.handles['evt'] = evt;
        this.errors = [];

        for (var key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {
                var field = this.fields[key] || {};
                var el = this.form[field.name];

                if (el && el !== undefined) {
                    field.id = attributeValue(el, 'id');
                    field.el = el;
                    field.type = (el.length > 0) ? el[0].type : el.type;
                    field.value = attributeValue(el, 'value');
                    field.checked = attributeValue(el, 'checked');

                    this.validateField(field);
                }
            }
        }

        if (typeof this.callback === 'function') {
            this.callback(this, evt);
        }

        // 如果有错误，停止 submit 提交
        if (this.errors.length > 0) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else if (event) {
                // IE 使用的全局变量
                event.returnValue = false;
            }
        }

        return this;
    },

    validateField: function(field) {

        var rules = field.rules.split(/\s*\|\s*/g);

        for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {

            var method = rules[i];
            var parts = regexs.rule.exec(method);

            var param = null;
            var failed = false;

            // 解析带参数的验证如 max_length(12)
            if (parts) {
                method = parts[1];
                param = parts[2];
            }

            if (typeof _testHook[method] === 'function') {
                if (!_testHook[method].apply(this, [field, param])) {
                    failed = true;
                }
            }

            if (failed) {
                var message = (function() {
                    return field.display.split(/\s*\|\s*/g)[i] && field.display.split(/\s*\|\s*/g)[i].replace('{{' + field.name + '}}', field.value);
                })();

                var existingError;
                for (var j = 0, errorsLength = this.errors.length; j < errorsLength; j += 1) {
                    if (field.el === this.errors[j].el) {
                        existingError = this.errors[j];
                    }
                }

                var errorObject = existingError || {
                    id: field.id,
                    display: field.display,
                    el: field.el,
                    name: field.name,
                    message: message,
                    messages: [],
                    rule: method
                };
                errorObject.messages.push(message);
                if (!existingError) this.errors.push(errorObject);
            }
        }
        return this;
    }
};

/**
 * 将样式属性字符转换成驼峰。
 * @param {String} 字符串
 * @return {String}
 */
function toCamelCase(caseName) {
    // Support: IE9-11+
    return caseName.replace(/\_([a-z])/g, function(all, letter) {
        return letter.toUpperCase();
    });
}

/**
 * 获取节点对象的属性
 * @param {Object} 传入节点
 * @param {String} 需要获取的属性
 * @return {String} 属性值
 */
function attributeValue(el, attributeName) {
    var i, elLength;
    if ((el.length > 0) && (el[0].type === 'radio' || el[0].type === 'checkbox')) {
        for (i = 0, elLength = el.length; i < elLength; i++) {
            if (el[i].checked) {
                return el[i][attributeName];
            }
        }
        return;
    }
    return el[attributeName];
};

/**
 * 构建具有所有需要验证的信息的主域数组
 * @param {Object} 当前对象
 * @param {Object} 当前验证对象
 * @param {String} 提示文字
 */
function addField(self, field, nameValue) {
    self.fields[nameValue] = {
        name: nameValue,
        display: field.display || nameValue,
        rules: field.rules,
        id: null,
        el: null,
        type: null,
        value: null,
        checked: null
    };
}

/**
 * 获取 dom 节点对象
 * @param {Object} 字符串或者节点对象
 * @return {Object} 返回dom节点
 */
function _formElement(el) {
    return (typeof el === 'object') ? el : document.forms[el];
}

/**
 * 判断 field 是否为字符串
 * @param {Object}
 * @return {String} 返回值
 */
function getValue(field) {
    return (typeof field === 'string') ? field : field.value;
}

return Validator;
