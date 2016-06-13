/*!
 * validate-framework v1.3.0
 * 轻量级JavaScript表单验证，字符串验证。
 * 
 * Copyright (c) 2016 LMY
 * https://github.com/MinJieLiu/validator.js
 * 
 * Licensed under the MIT license.
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
        phone: /^1[3-9]\d{9}$/,
        // 字母数字或下划线
        abc: /^[a-zA-Z0-9_]*$/,
        // URL
        url: /[a-zA-z]+:\/\/[^\s]/,
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
 * @param {String} form 名称
 * @param {Object} 参数：包括 验证域、错误信息位置、回调函数
 */
    var Validator = function(formName, options) {
        // 将验证方法绑到 Validator 对象上
        for (var a in _testHook) this[toCamelCase(a)] = _testHook[a];
        this.options = options || {};
        this.form = formName && getFormEl(formName);
        this.errors = {};
        this.fields = {};
        this.handles = {};
        // 不存在 form 对象
        if (!this.form) {
            return this;
        }
        // fields 不合法
        if (typeof options.fields !== "object") {
            return this;
        }
        var fields = options.fields;
        // HTML5 添加 novalidate
        this.form.setAttribute("novalidate", "novalidate");
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
        // 验证单个表单方法
        var validateFieldFunc = function(that) {
            return function(evt) {
                try {
                    // 验证单个表单
                    // 兼容低版本浏览器
                    evt = evt || event;
                    var targetEl = evt.target || evt.srcElement;
                    return that._validateField(that.fields[targetEl.name], targetEl);
                } catch (e) {}
            };
        }(this);
        // 使用表单值改变拦截
        // 非 IE 浏览器使用标准 oninput 事件
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            var formEls = this.form.elements;
            for (var i = 0, formElsLength = this.form.length; i < formElsLength; i++) {
                this.form[i].onkeyup = validateFieldFunc;
                formEls[i].onchange = validateFieldFunc;
            }
        } else {
            this.form.oninput = validateFieldFunc;
            this.form.onchange = validateFieldFunc;
        }
        // 使用 submit 按钮拦截
        var _onsubmit = this.form.onsubmit;
        this.form.onsubmit = function(that) {
            return function(evt) {
                try {
                    evt = evt || event;
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
            this.handles["evt"] = evt || event;
            for (var name in this.fields) {
                if (this.fields.hasOwnProperty(name)) {
                    var field = this.fields[name];
                    var el = this.form[field.name];
                    // 表单 name 属性相同且不是 radio 或 checkbox 的表单域
                    if (isSameNameField(el)) {
                        // 默认通过验证，若有一个错误，则不通过
                        field._multiFailed = false;
                        for (var i = 0, elLength = el.length; i < elLength; i++) {
                            // 当前验证的 field 对象
                            field._multiIndex = i;
                            this._validateField(field);
                        }
                    } else {
                        // 正常验证
                        this._validateField(field);
                    }
                }
            }
            // 如果有错误，停止 submit 提交，并停止执行回调函数
            if (!isEmptyObject(this.errors)) {
                this.preventSubmit();
            } else {
                // 将 null 暴露到 callback 函数中
                this.errors = null;
            }
            // 执行回调函数
            if (typeof this.options === "object" && typeof this.options.callback === "function") {
                this.options.callback(this.handles["evt"], this.errors);
            }
            return this;
        },
        /**
     * 验证单个表单域
     * @param {String} 表单域 name 属性
     */
        validateByName: function(name) {
            var field = this.fields[name];
            if (!isEmptyObject(field)) {
                this._validateField(field);
            }
            return this;
        },
        /**
     * 阻止表单提交
     * @param {Event}
     */
        preventSubmit: function() {
            var evt = this.handles["evt"];
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
     * 验证当前节点
     * @param  {Object} 验证信息域
     * @param {Element} 当前验证的单个表单域
     */
        _validateField: function(field, targetEl) {
            // 获得节点
            var el = this.form[field.name];
            // 成功标识
            var failed = false;
            // 错误对象
            this.errors = this.errors || {};
            var errorObj = this.errors[field.name];
            // 验证 name 属性相同，当前验证的表单域处于表单数组的所在位置
            var elIndex;
            // 设置验证信息域属性
            if (el && el !== undefined) {
                field.id = attributeValue(el, "id");
                field.el = el;
                field.type = el.length > 0 ? el[0].type : el.type;
                field.value = attributeValue(el, "value");
                field.checked = attributeValue(el, "checked");
            } else {
                // 动态删除表单域之后清空对象值
                field.el = null;
                field.type = null;
                field.value = null;
                field.checked = null;
            }
            var isRequired = field.rules.indexOf("required") !== -1;
            var isEmpty = !field.value || field.value === "" || field.value === undefined;
            var rules = field.rules.split(/\s*\|\s*/g);
            for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
                // 逐条验证，如果已经验证失败，则暂时不需要进入当前条目再次验证
                if (failed) {
                    break;
                }
                var method = rules[i];
                var parts = regexs.rule.exec(method);
                var param = "";
                // 解析带参数的验证如 max_length(12)
                if (parts) {
                    method = parts[1];
                    param = parts[2];
                }
                // 如果不是 required 这个字段，该值是空的，并且这个节点存在，则不验证，继续下一个规则。
                if (el && !isRequired && isEmpty) {
                    continue;
                }
                // 表单 name 属性相同且不是 radio 或 checkbox 的表单域
                if (isSameNameField(el)) {
                    // 获取验证的表单域处于表单数组的所在位置
                    for (var j = 0, elLength = el.length; j < elLength; j++) {
                        if (targetEl && targetEl === el[j]) {
                            elIndex = j;
                        }
                    }
                    // 设置当前验证的表单域
                    if (elIndex === undefined) {
                        elIndex = field._multiIndex;
                    }
                    field.el = el[elIndex];
                    field.value = attributeValue(el[elIndex], "value");
                }
                // 匹配验证
                if (typeof _testHook[method] === "function") {
                    if (!_testHook[method].apply(this, [ field, param ])) {
                        failed = true;
                    }
                }
                // 错误消息类和 id
                var errorClass;
                var messageId;
                if (field.el) {
                    errorClass = isRadioOrCheckbox(el) ? "valid-label-error" : "valid-error";
                    messageId = "valid_error_" + field.name + "_" + (elIndex !== undefined ? elIndex : "0");
                }
                // 错误信息域
                this.errors[field.name] = {
                    el: field.el,
                    name: field.name,
                    rule: method,
                    errorClass: errorClass,
                    messageId: messageId
                };
                // 解析错误信息
                if (failed) {
                    // 错误提示
                    this.errors[field.name].message = function() {
                        var seqText = field.messages ? field.messages.split(/\s*\|\s*/g)[i] : "";
                        // 防止 xss 攻击
                        var fieldValue = field.value && field.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        // 替换 {{value}} 和 {{param}} 为指定值
                        return seqText ? seqText.replace(/\{\{\s*value\s*\}\}/g, fieldValue).replace(/\{\{\s*param\s*\}\}/g, param) : seqText;
                    }();
                    // 表单 name 属性相同且不是 radio 或 checkbox 的表单域
                    if (isSameNameField(el)) {
                        field._multiFailed = true;
                    }
                }
                errorObj = this.errors[field.name];
            }
            // 节点不存在，则返回自定义处理
            if (!field.el) {
                return this;
            }
            // 当前条目验证结果
            if (failed) {
                this._addErrorPlacement(errorObj);
            } else {
                this._removeErrorMessage(errorObj);
                // 删除之前验证过的信息
                // 表单 name 属性相同且不是 radio 或 checkbox 的表单域
                if (isSameNameField(el)) {
                    if (!field._multiFailed) {
                        delete this.errors[field.name];
                    }
                } else {
                    delete this.errors[field.name];
                }
            }
            return this;
        },
        /**
     * 构建具有所有需要验证的信息域数组
     * @param {String} 表单域 name 属性名称
     * @param {Object} 验证信息域
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
            var errorEl = document.createElement("em");
            addClass(errorEl, errorObj.errorClass + "-message");
            errorEl.setAttribute("id", errorObj.messageId);
            errorEl.innerHTML = errorObj.message;
            // 错误信息位置
            if (typeof this.options === "object" && typeof this.options.errorPlacement === "function") {
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
 * 判断是否包含 class
 * @param {Element} el
 * @param {String} class 名称
 */
    function hasClass(el, cls) {
        return el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }
    /**
 * 添加 class
 * @param {Element} el
 * @param {String} class 名称
 */
    function addClass(el, cls) {
        if (!hasClass(el, cls)) {
            el.classList ? el.classList.add(cls) : el.className += " " + cls;
        }
    }
    /**
 * 移除 class
 * @param {Element} el
 * @param {String} class 名称
 */
    function removeClass(el, cls) {
        if (hasClass(el, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            el.classList ? el.classList.remove(cls) : el.className = el.className.replace(reg, " ");
        }
    }
    /**
 * 表单 name 属性相同且不是 radio 或 checkbox 的表单域
 * @param {Object} 传入节点
 */
    function isSameNameField(el) {
        return el && el.length && el[0].type !== "radio" && el[0].type !== "checkbox" && el[0].tagName !== "OPTION";
    }
    /**
 * 判断表单域为 radio 或者 checkbox
 * @param {Object} 传入节点
 */
    function isRadioOrCheckbox(el) {
        return el && el.length && (el[0].type === "radio" || el[0].type === "checkbox");
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
 * 获取 dom 节点对象
 * @param {Object} 字符串或者节点对象
 * @return {Element} 返回 DOM 节点
 */
    function getFormEl(el) {
        return typeof el === "object" ? el : document.forms[el];
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

