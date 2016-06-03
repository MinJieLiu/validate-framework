/*!
 * validator.js v1.0.9
 * 轻量级JavaScript表单验证，字符串验证。
 * 
 * Copyright (c) 2016 LMY
 * https://github.com/MinJieLiu/validator.js
 * 
 * Licensed under the Apache License 2 license.
 */

(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.Validator = f();
    }
})(function() {
    var define, module, exports;
    "use strict";
    /**
 * 正则表达式
 */
    var regexs = {
        // 匹配 max_length(12) => ['max_length', 12]
        rule: /^(.+?)\((.+)\)$/,
        // 自然数
        numeric: /^[0-9]+$/,
        // 整数
        integer: /^\-?[0-9]+$/,
        // 浮点数
        decimal: /^\-?[0-9]*\.?[0-9]+$/,
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
                _date = _date.split("-");
                var year = parseInt(_date[0], 10);
                var month = parseInt(_date[1], 10);
                var day = parseInt(_date[2], 10);
                if (year < 1 || year > 9999 || month < 1 || month > 12) {
                    return false;
                }
                var numDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
                // 闰年2月29号
                if (year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
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
            if (field.type === "checkbox" || field.type === "radio") {
                return field.checked === true;
            }
            return getValue(field) !== null && getValue(field) !== "";
        },
        // 多于 某个数
        greater_than: function(field, param) {
            var value = getValue(field);
            if (!regexs.decimal.test(value)) {
                return false;
            }
            return parseFloat(value) > parseFloat(param);
        },
        // 少于 某个数
        less_than: function(field, param) {
            var value = getValue(field);
            if (!regexs.decimal.test(value)) {
                return false;
            }
            return parseFloat(value) < parseFloat(param);
        },
        // 最大长度
        max_length: function(field, length) {
            if (!regexs.integer.test(length)) {
                return false;
            }
            return getValue(field).length <= parseInt(length, 10);
        },
        // 最小长度
        min_length: function(field, length) {
            if (!regexs.integer.test(length)) {
                return false;
            }
            return getValue(field).length >= parseInt(length, 10);
        },
        // 大于某个日期
        greater_than_date: function(field, date) {
            var currentDate = _paseToDate(getValue(field));
            var paramDate = _paseToDate(date);
            if (!paramDate || !currentDate) {
                return false;
            }
            return currentDate > paramDate;
        },
        // 小于某个日期
        less_than_date: function(field, date) {
            var currentDate = _paseToDate(getValue(field));
            var paramDate = _paseToDate(date);
            if (!paramDate || !currentDate) {
                return false;
            }
            return currentDate < paramDate;
        }
    };
    /**
 * Validator 对象
 * @param {Object} form 名称
 * @param {Object} 参数：包括 验证域、错误信息位置、回调函数
 */
    var Validator = function(formName, options) {
        // 将验证方法绑到 Validator 对象上
        for (var a in _testHook) this[toCamelCase(a)] = _testHook[a];
        this.options = options || {};
        this.form = _formElement(formName) || {};
        this.errors = {};
        this.fields = {};
        this.handles = {};
        // 如果不存在 form 对象
        if (!formName) {
            return this;
        }
        var fields = typeof options.fields === "object" ? options.fields : {};
        for (var name in fields) {
            if (fields.hasOwnProperty(name)) {
                var field = fields[name];
                // 规则不正确，则跳过
                if (!field.rules) {
                    console.warn(field);
                    continue;
                }
                // 构建具有所有需要验证的信息的主域数组
                this._addField(name, field);
            }
        }
        // 使用表单值改变拦截
        this.form.onchange = function(that) {
            return function(evt) {
                try {
                    // 验证单个表单
                    return that._validateField(that.fields[evt.target.name]);
                } catch (e) {}
            };
        }(this);
        // 使用 submit 按钮拦截
        var _onsubmit = this.form.onsubmit;
        this.form.onsubmit = function(that) {
            return function(evt) {
                try {
                    return that.validate(evt) && (_onsubmit === undefined || _onsubmit());
                } catch (e) {}
            };
        }(this);
    };
    Validator.prototype = {
        /**
     * 验证整体表单域
     * @param  {Event} 当前事件
     */
        validate: function(evt) {
            this.handles["ok"] = true;
            this.handles["evt"] = evt;
            this.errors = {};
            for (var name in this.fields) {
                if (this.fields.hasOwnProperty(name)) {
                    var field = this.fields[name];
                    this._validateField(field);
                }
            }
            // 如果有错误，停止 submit 提交
            if (!isEmptyObject(this.errors)) {
                if (evt && evt.preventDefault) {
                    evt.preventDefault();
                } else if (event) {
                    // IE 使用的全局变量
                    event.returnValue = false;
                }
                return false;
            }
            // 执行回调函数
            if (typeof this.options === "object" && typeof this.options.callback === "function") {
                this.options.callback(evt);
            }
            return this;
        },
        /**
     * 验证单个表单域
     * @param 表单域 name 属性
     */
        validateByName: function(name) {
            var field = this.fields[name];
            if (!isEmptyObject(field)) {
                this._validateField(field);
            }
            return this;
        },
        /**
     * 扩展校验方法
     * @param 校验名称 格式： is_date
     * @param 校验方法
     */
        addMethod: function(name, method) {
            _testHook[name] = method;
            // 绑定验证方法
            this[toCamelCase(name)] = _testHook[name];
        },
        /**
     * 验证当前节点
     * @param  {Object} 验证信息域
     */
        _validateField: function(field) {
            // 获得节点
            var el = this.form[field.name];
            // 成功标识
            var failed = false;
            // 设置验证信息域属性
            if (el && el !== undefined) {
                field.id = attributeValue(el, "id");
                field.el = el;
                field.type = el.length > 0 ? el[0].type : el.type;
                field.value = attributeValue(el, "value");
                field.checked = attributeValue(el, "checked");
            }
            var isRequired = field.rules.indexOf("required") !== -1;
            var isEmpty = !field.value || field.value === "" || field.value === undefined;
            var rules = field.rules.split(/\s*\|\s*/g);
            // 删除之前验证过的信息
            delete this.errors[field.name];
            for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
                // 开启逐条验证，如果已经验证失败，则暂时不需要进入当前条目再次验证
                if (failed) {
                    break;
                }
                var method = rules[i];
                var parts = regexs.rule.exec(method);
                var param = null;
                // 解析带参数的验证如 max_length(12)
                if (parts) {
                    method = parts[1];
                    param = parts[2];
                }
                // 如果不是 required 这个字段，并且该值是空的，则不验证，继续下一个规则。
                if (!isRequired && isEmpty) {
                    continue;
                }
                // 匹配验证
                if (typeof _testHook[method] === "function") {
                    if (!_testHook[method].apply(this, [ field, param ])) {
                        failed = true;
                    }
                }
                // 解析错误信息
                if (failed) {
                    var message = function() {
                        return field.messages.split(/\s*\|\s*/g)[i] && field.messages.split(/\s*\|\s*/g)[i].replace("{{" + field.name + "}}", field.value);
                    }();
                    var existingError;
                    for (var j = 0, errorsLength = this.errors.length; j < errorsLength; j += 1) {
                        if (field.el === this.errors[j].el) {
                            existingError = this.errors[j];
                        }
                    }
                    // 错误信息域
                    var errorObject = existingError || {
                        el: field.el,
                        name: field.name,
                        message: message,
                        rule: method
                    };
                    if (!existingError) {
                        this.errors[field.name] = errorObject;
                    }
                }
            }
            // 当前条目所有条件验证结果
            failed ? this._addErrorPlacement(field) : this._removeErrorMessage(field);
            return this;
        },
        /**
     * 构建具有所有需要验证的信息域数组
     * @param {String} 表单域 name 属性名称
     * @param {Object} 当前验证对象
     */
        _addField: function(name, field) {
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
        },
        /**
     * 移除当前条目错误信息
     * @param {Object} 验证信息域
     */
        _removeErrorMessage: function(field) {
            // 移除表单域错误类
            if (isNormalEl(field.el)) {
                field.el.classList.remove("valid-error");
            } else {
                for (var i = 0, elLength = field.el.length; i < elLength; i++) {
                    field.el[i].classList.remove("valid-label-error");
                }
            }
            // 移除错误信息节点
            var errorEl = document.getElementById("valid_error_" + field.name);
            if (errorEl) {
                errorEl.parentNode.removeChild(errorEl);
            }
        },
        /**
     * 添加当前条目错误信息
     * @param {Object} 验证信息域
     */
        _addErrorPlacement: function(field) {
            // 无错误信息
            if (!this.errors[field.name]) {
                return;
            }
            // 清除之前保留的错误信息
            this._removeErrorMessage(field);
            // 当前表单域添加错误类
            if (isNormalEl(field.el)) {
                field.el.classList.add("valid-error");
            } else {
                for (var i = 0, elLength = field.el.length; i < elLength; i++) {
                    field.el[i].classList.add("valid-label-error");
                }
            }
            // 创建元素
            var errorEl = document.createElement("em");
            errorEl.classList.add("valid-error-message");
            errorEl.setAttribute("id", "valid_error_" + field.name);
            errorEl.innerHTML = this.errors[field.name].message;
            // 错误信息位置
            if (typeof this.options === "object" && typeof this.options.errorPlacement === "function") {
                // 参数：错误信息节点，当前表单 DOM
                this.options.errorPlacement(errorEl, field.el);
            } else {
                // 默认错误信息位置
                // label 、 radio 元素错误位置不固定，默认暂不设置
                if (isNormalEl(field.el)) {
                    field.el.parentNode.appendChild(errorEl);
                }
            }
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
        if (el.length > 0 && (el[0].type === "radio" || el[0].type === "checkbox")) {
            for (i = 0, elLength = el.length; i < elLength; i++) {
                if (el[i].checked) {
                    return el[i][attributeName];
                }
            }
            return;
        }
        return el[attributeName];
    }
    /**
 * 获取 dom 节点对象
 * @param {Object} 字符串或者节点对象
 * @return {Object} 返回 DOM 节点
 */
    function _formElement(el) {
        return typeof el === "object" ? el : document.forms[el];
    }
    /**
 * 是否为空对象
 * @param {Object} obj
 */
    function isEmptyObject(obj) {
        for (var name in obj) {
            return !name;
        }
        return true;
    }
    /**
 * 判断是否为非 checkbox 、radio 的表单元素
 * @param {Object} 节点对象
 */
    function isNormalEl(el) {
        if (el.parentNode === undefined) {
            return false;
        }
        return true;
    }
    /**
 * 转换为日期
 * @param {String} 日期格式：yyyy-MM-dd
 * @return {Date}
 */
    function _paseToDate(paramDate) {
        if (!_testHook.is_date(paramDate)) {
            return false;
        }
        var thisDate = new Date();
        var dateArray;
        dateArray = paramDate.split("-");
        thisDate.setFullYear(dateArray[0]);
        thisDate.setMonth(dateArray[1] - 1);
        thisDate.setDate(dateArray[2]);
        return thisDate;
    }
    /**
 * 判断 field 是否为字符串
 * @param {Object}
 * @return {String} 返回值
 */
    function getValue(field) {
        return typeof field === "string" ? field : field.value;
    }
    return Validator;
});

