'use strict';
/**
 * 正则表达式
 */
var regexs = {

    // 自然数
    numeric: /^\d+$/,

    // 整数
    integer: /^\-?\d+$/,

    // 浮点数
    decimal: /^\-?\d*\.?\d+$/,

    // 邮箱
    email: /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/,

    // IP 地址 [ip ipv4、ipv6]
    ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,

    // 电话号码
    tel: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,

    // 手机号码
    phone: /^1[3-9]\d{9}$/,

    // 字母数字或下划线
    abc: /^\w+$/,

    // URL
    url: /[a-zA-Z]+:\/\/[^\s]*/,

    // 日期
    date: /^\d{4}-\d{1,2}-\d{1,2}$/
};

/**
 * 验证方法
 */
var _testHook = {

    // 验证自然数
    is_numeric: function(field) {
        return regexs.numeric.test(getValue(field));
    },

    // 验证整数
    is_integer: function(field) {
        return regexs.integer.test(getValue(field));
    },

    // 验证浮点数
    is_decimal: function(field) {
        return regexs.decimal.test(getValue(field));
    },

    // 验证邮箱
    is_email: function(field) {
        return regexs.email.test(getValue(field));
    },

    // 验证 IP 地址
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
        if ((field.type === 'checkbox') || (field.type === 'radio')) {
            return (field.checked === true);
        }
        return (getValue(field) !== null && getValue(field) !== '');
    },

    // 多于 某个数
    greater_than: function(field, param) {
        var value = getValue(field);
        if (!regexs.decimal.test(value)) {
            return false;
        }
        return (parseFloat(value) > parseFloat(param));
    },

    // 少于 某个数
    less_than: function(field, param) {
        var value = getValue(field);
        if (!regexs.decimal.test(value)) {
            return false;
        }
        return (parseFloat(value) < parseFloat(param));
    },

    // 最大长度
    max_length: function(field, length) {
        if (!regexs.integer.test(length)) {
            return false;
        }
        return (getValue(field).length <= parseInt(length, 10));
    },

    // 最小长度
    min_length: function(field, length) {
        if (!regexs.integer.test(length)) {
            return false;
        }
        return (getValue(field).length >= parseInt(length, 10));
    },

    // 大于某个日期
    greater_than_date: function(field, date) {
        var currentDate = paseToDate(getValue(field));
        var paramDate = paseToDate(date);

        if (!paramDate || !currentDate) {
            return false;
        }
        return currentDate > paramDate;
    },

    // 小于某个日期
    less_than_date: function(field, date) {
        var currentDate = paseToDate(getValue(field));
        var paramDate = paseToDate(date);

        if (!paramDate || !currentDate) {
            return false;
        }
        return currentDate < paramDate;
    }

};

/**
 * Validator 对象
 * @param {Object} 参数：包括 验证域、错误信息位置、回调函数
 */
var Validator = function(options) {

    // 将验证方法绑到 Validator 对象上
    for (var a in _testHook) this[toCamelCase(a)] = _testHook[a];

    // 无参数
    if (!options) {
        return this;
    }

    this.options = options;
    this.form = {};
    this.body = options.body;
    this.errors = {};
    this.fields = {};
    this.handles = {};

    var fields = options.fields;

    // 构建具有所有需要验证的信息域
    this.addFields(fields);

    // 有 form 表单的验证
    if (options.formName && isBrowser()) {

        // 获取表单对象
        this.form = document.forms[options.formName];

        // HTML5 添加 novalidate
        this.form.setAttribute('novalidate', 'novalidate');

        // 绑定用户输入事件
        this.onInputEvent();

        // 绑定提交事件
        this._onSubmit();
    }

    return this;
};

Validator.prototype = {

    /**
     * 验证整体表单域
     * @param  {Event} 当前事件
     * @return {Boolean} 是否成功
     */
    validate: function(evt) {

        this.handles['evt'] = getCurrentEvent(evt);
        var successed = true;

        for (var name in this.fields) {
            // 通过 name 验证
            if (!this.validateByName(name)) {
                successed = false;
            }
        }

        // 如果有错误，停止 submit 提交，并停止执行回调函数
        if (!successed) {
            this.preventSubmit();
        } else {
            // 将 null 暴露到 callback 函数中
            this.errors = null;
        }

        // 执行回调函数
        if (typeof this.options === 'object' && typeof this.options.callback === 'function') {
            this.options.callback(this.handles['evt'], this.errors);
        }

        return successed;
    },

    /**
     * 验证单个表单域
     * @param {String} 表单域 name 属性
     * @return {Boolean} 是否成功
     */
    validateByName: function(name) {

        var field = this.fields[name];
        var successed = false;

        // 单个验证没找到规则
        if (!field) {
            return successed;
        }

        // 获取验证的 DOM 节点
        var el;
        if (isBrowser()) {
            el = this.form[field.name] || getElementByName(field.name);
        }

        // 表单 name 属性相同且不是 radio 或 checkbox 的表单域
        if (isSameNameField(el)) {
            // 默认通过验证，若有一个错误，则不通过
            var multiSuccessed = true;
            for (var i = 0, elLength = el.length; i < elLength; i++) {
                // 当前验证的 field 对象
                field.el = el[i];
                // 若有一个错误，则不通过
                if (!this._validateField(field)) {
                    multiSuccessed = false;
                }
            }
            successed = multiSuccessed;
        } else {
            // 正常验证
            field.el = el;
            successed = this._validateField(field);
        }

        return successed;
    },

    /**
     * 阻止表单提交
     * @param {Event}
     */
    preventSubmit: function() {

        var evt = this.handles['evt'];

        if (evt && evt.preventDefault) {
            evt.preventDefault();
        } else if (evt) {
            // IE 使用的全局变量
            evt.returnValue = false;
        }

        return this;
    },

    /**
     * 扩展校验方法
     * @param {String} 校验名称 格式： is_date
     * @param {Function} 校验方法
     */
    addMethod: function(name, method) {
        _testHook[name] = method;

        // 绑定验证方法
        this[toCamelCase(name)] = _testHook[name];

        return this;
    },

    /**
     * 动态添加 fields 方法
     * @param {Object} fields 对象
     */
    addFields: function(fields) {
        if (typeof fields === 'object') {

            // 构建具有所有需要验证的信息域
            for (var name in fields) {

                var field = fields[name];

                // 规则不正确，则跳过
                if (!field.rules) {
                    continue;
                }

                // 构建单个需要验证的信息域
                this.fields[name] = {
                    name: name,
                    messages: field.messages,
                    rules: field.rules,
                    id: null,
                    el: null,
                    type: null,
                    value: null,
                    checked: null
                };
            }
        }
        return this;
    },

    /**
     * 动态移除 fields 方法
     * @param {String} fields 名称
     */
    removeFields: function(fieldNames) {

        if (fieldNames instanceof Array) {
            for (var i, namesLength = fieldNames.length; i < namesLength; i++) {
                // 移除对象
                if (this.fields[fieldNames[i]]) {
                    delete this.fields[fieldNames[i]];
                    this.errors && delete this.errors[fieldNames[i]];
                }
            }
        } else if (fieldNames && this.fields[fieldNames]) {
            delete this.fields[fieldNames];
            this.errors && delete this.errors[fieldNames];
        }
        return this;
    },

    /**
     * 绑定用户输入事件和改变事件
     * @param {String} 表单 name 属性
     * @param {Enumerator} 事件级别 off/change/all
     */
    onInputEvent: function(name, level) {

        var validateFieldFunc = (function(that) {
            return function(evt) {
                try {
                    evt = getCurrentEvent(evt);
                    var el = evt.target || evt.srcElement;
                    var field = that.fields[el.name];

                    // 设置触发事件的表单元素
                    // radio 和 checkbox 应为 nodelist 形式
                    if (isRadioOrCheckbox(el)) {
                        el = getElementByName(el.name);
                    }
                    field.el = el;
                    // 验证单个表单
                    return that._validateField(field);
                } catch (e) {};
            };
        })(this);

        // 绑定表单值改变拦截
        var formEls = name ? document.getElementsByName(name) : this.form.elements;

        for (var i = 0, formElsLength = formEls.length; i < formElsLength; i++) {

            var oninput;
            var onchange;
            var noop = function() {};
            level = level || 'all';
            // 触发事件绑定
            switch (level) {
                case 'off':
                    oninput = noop;
                    break;
                case 'change':
                    oninput = noop;
                    onchange = validateFieldFunc;
                    break;
                case 'all':
                    oninput = validateFieldFunc;
                    onchange = validateFieldFunc;
                    break;
            }
            // 针对 IE 浏览器使用 onkeyup 事件
            var thisEl = formEls[i];
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                thisEl.onkeyup = oninput;
            } else {
                thisEl.oninput = oninput;
            }
            thisEl.onchange = onchange;
        }
        return this;
    },

    /**
     * 绑定 submit 按钮提交事件
     */
    _onSubmit: function() {
        var _onsubmit = this.form.onsubmit;
        this.form.onsubmit = (function(that) {
            return function(evt) {
                try {
                    evt = getCurrentEvent(evt);
                    return that.validate(evt) && (_onsubmit === undefined || _onsubmit());
                } catch (e) {};
            };
        })(this);
    },

    /**
     * 验证当前节点
     * @param  {Object} 验证信息域
     * @return {Boolean} 是否成功
     */
    _validateField: function(field) {

        // 成功标识
        var successed = true;
        // 错误对象
        this.errors = this.errors || {};
        var errorObj = this.errors[field.name];

        // 更新验证域
        this._updateField(field);

        var isRequired = field.rules.indexOf('required') !== -1;
        var isEmpty = (!field.value || field.value === '' || field.value === undefined);

        var rules = field.rules.split(/\s*\|\s*/g);

        for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {

            // 逐条验证，如果已经验证失败，则暂时不需要进入当前条目再次验证
            if (!successed) {
                break;
            }

            // 转换：max_length(12) => ['max_length', 12]
            var method = rules[i];
            var parts = /^(.+?)\((.+)\)$/.exec(method);
            var param = '';

            // 解析带参数的验证如 max_length(12)
            if (parts) {
                method = parts[1];
                param = parts[2];
            }

            // 如果不是 required 这个字段，该值是空的，则不验证，继续下一个规则。
            if (!isRequired && isEmpty) {
                continue;
            }

            // 匹配验证
            if (typeof _testHook[method] === 'function') {
                if (!_testHook[method].apply(this, [field, param])) {
                    successed = false;
                }
            }

            // 错误信息域
            this.errors[field.name] = {
                el: field.el,
                name: field.name,
                rule: method
            };

            // 解析错误信息
            if (!successed) {

                // 错误提示
                this.errors[field.name].message = (function() {
                    var seqText = field.messages ? field.messages.split(/\s*\|\s*/g)[i] : '';

                    // 防止 xss 攻击
                    var fieldValue = field.value && field.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    // 替换 {{value}} 和 {{param}} 为指定值
                    return seqText ? seqText.replace(/\{\{\s*value\s*\}\}/g, fieldValue).replace(/\{\{\s*param\s*\}\}/g, param) : seqText;
                })();

            }
            errorObj = this.errors[field.name];
        }

        // 验证成功后，删除之前验证过的信息
        if (successed) {
            delete this.errors[field.name];
        }

        // 节点不存在，直接返回结果
        if (!field.el) {
            return successed;
        }

        // 错误信息操作
        if (errorObj) {
            // 添加错误类信息
            errorObj.errorClass = isRadioOrCheckboxList(field.el) ? 'valid-label-error' : 'valid-error';
            errorObj.messageId = 'valid_error_' + (field.id || field.name);
        }

        // 当前条目验证结果展示
        if (successed) {
            this._removeErrorMessage(errorObj);
        } else {
            this._addErrorPlacement(errorObj);
        }

        return successed;
    },

    /**
     * 更新单个验证域
     * @param {Object} 验证域
     */
    _updateField: function(field) {
        // 数据验证模式
        if (this.body) {
            field.value = this.body[field.name];
            return;
        }

        // 设置验证信息域属性
        var el = field.el;
        if (el) {
            field.id = el.id;
            field.type = (el.length > 0) ? el[0].type : el.type;
            field.value = attributeValue(el, 'value');
            field.checked = attributeValue(el, 'checked');
        } else {
            // 动态删除表单域之后清空对象值
            field.id = null;
            field.el = null;
            field.type = null;
            field.value = null;
            field.checked = null;
        }
    },

    /**
     * 移除当前条目错误信息
     * @param {Object} 验证信息域
     */
    _removeErrorMessage: function(errorObj) {

        if (!errorObj || !errorObj.el) {
            return;
        }

        // 移除表单域错误类
        if (!errorObj.el.length) {
            removeClass(errorObj.el, errorObj.errorClass);
        } else {
            for (var i = 0, elLength = errorObj.el.length; i < elLength; i++) {
                removeClass(errorObj.el[i], errorObj.errorClass);
            }
        }

        // 移除错误信息节点
        var errorEl = document.getElementById(errorObj.messageId);
        errorEl && errorEl.parentNode.removeChild(errorEl);
    },

    /**
     * 添加当前条目错误信息
     * @param {Object} 验证信息域
     */
    _addErrorPlacement: function(errorObj) {

        // 无错误信息
        if (!errorObj || !errorObj.el) {
            return;
        }

        // 清除之前保留的错误信息
        this._removeErrorMessage(errorObj);

        // 当前表单域添加错误类
        if (!errorObj.el.length) {
            addClass(errorObj.el, errorObj.errorClass);
        } else {
            for (var i = 0, elLength = errorObj.el.length; i < elLength; i++) {
                addClass(errorObj.el[i], errorObj.errorClass);
            }
        }

        // 创建元素
        var errorEl = document.createElement('em');
        addClass(errorEl, errorObj.errorClass + '-message');
        errorEl.setAttribute('id', errorObj.messageId);
        errorEl.innerHTML = errorObj.message;

        // 错误信息位置
        if (typeof this.options === 'object' && typeof this.options.errorPlacement === 'function') {
            // 参数：错误信息节点，当前表单 DOM
            this.options.errorPlacement(errorEl, errorObj.el);
        } else {
            // 默认错误信息位置
            // label 、 radio 元素错误位置不固定，默认暂不设置
            if (!errorObj.el.length) {
                errorObj.el.parentNode.appendChild(errorEl);
            }
        }
    }

};

/**
 * 判断 field 是否为字符串
 * @param {Object}
 * @return {String} 返回值
 */
function getValue(field) {
    return (typeof field === 'string') ? field : field.value;
}

/**
 * 转换为日期
 * @param {String} 日期格式：yyyy-MM-dd
 * @return {Date}
 */
function paseToDate(paramDate) {
    if (!_testHook.is_date(paramDate)) {
        return false;
    }

    var thisDate = new Date();
    var dateArray;

    dateArray = paramDate.split('-');
    thisDate.setFullYear(dateArray[0]);
    thisDate.setMonth(dateArray[1] - 1);
    thisDate.setDate(dateArray[2]);
    return thisDate;
}

/**
 * 是否为浏览器环境
 */
function isBrowser() {
    return typeof window !== 'undefined';
}

/**
 * 获取当前事件
 * firfox 浏览器 为 window.event
 */
function getCurrentEvent(evt) {
    return isBrowser() ? (evt || window.event) : null;
}

/**
 * 将样式属性字符转换成驼峰。
 * @param {String} 字符串
 * @return {String}
 */
function toCamelCase(caseName) {
    return caseName.replace(/\_([a-z])/g, function(all, letter) {
        return letter.toUpperCase();
    });
}

/**
 * 表单 name 属性相同且不是 radio 或 checkbox 的表单域
 * @param {Object} 传入节点
 */
function isSameNameField(el) {
    return el && el.length && el[0].type !== 'radio' && el[0].type !== 'checkbox' && el[0].tagName !== 'OPTION';
}

/**
 * 判断 nodeList 是否为 radio 或者 checkbox
 * @param {Object} 传入节点 nodeList
 */
function isRadioOrCheckboxList(el) {
    return el && el.length && isRadioOrCheckbox(el[0]);
}

/**
 * 判断节点是否为 radio 或者 checkbox
 * @param {Element} 传入节点
 */
function isRadioOrCheckbox(el) {
    return el.type === 'radio' || el.type === 'checkbox';
}

/**
 * 通过 name 获取 非 form 表单元素
 * @param {Object} name 属性
 */
function getElementByName(name) {
    var el = document.getElementsByName(name);
    if (!el) {
        return null;
    }
    if (isRadioOrCheckboxList(el) || isSameNameField(el)) {
        return el;
    } else {
        return el[0];
    }
}

/**
 * 获取节点对象的属性
 * @param {Object} 传入节点
 * @param {String} 需要获取的属性
 * @return {String} 属性值
 */
function attributeValue(el, attributeName) {
    var i, elLength;
    for (i = 0, elLength = el.length; i < elLength; i++) {
        if (el[i].checked) {
            return el[i][attributeName];
        }
    }
    return el[attributeName];
}

/**
 * 判断是否包含 class
 * @param {Element} el
 * @param {String} class 名称
 */
function hasClass(el, cls) {
    return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * 添加 class
 * @param {Element} el
 * @param {String} class 名称
 */
function addClass(el, cls) {
    if (!hasClass(el, cls)) {
        el.classList ? el.classList.add(cls) : el.className += ' ' + cls;
    }
}

/**
 * 移除 class
 * @param {Element} el
 * @param {String} class 名称
 */
function removeClass(el, cls) {
    if (hasClass(el, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        el.classList ? el.classList.remove(cls) : el.className = el.className.replace(reg, ' ');
    }
}

return Validator;
