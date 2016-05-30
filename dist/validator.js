/*!
 * validator.js v1.0.0
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
    var regexs = {
        rule: /^(.+?)\((.+)\)$/,
        numeric: /^[0-9]+$/,
        email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
        tel: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
        phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/,
        abc: /^[a-zA-Z0-9_]*$/,
        url: /[a-zA-z]+:\/\/[^\s]/,
        date: /\d{4}-\d{1,2}-\d{1,2}/
    };
    var _testHook = {
        is_email: function(field) {
            return regexs.email.test(getValue(field));
        },
        is_ip: function(field) {
            return regexs.ip.test(getValue(field));
        },
        is_tel: function(field) {
            return regexs.tel.test(getValue(field));
        },
        is_phone: function(field) {
            return regexs.phone.test(getValue(field));
        },
        is_abc: function(field) {
            return regexs.abc.test(getValue(field));
        },
        is_url: function(field) {
            return regexs.url.test(getValue(field));
        },
        is_date: function(field) {
            return regexs.date.test(getValue(field));
        },
        required: function(field) {
            var value = getValue(field);
            if (field.type === "checkbox" || field.type === "radio") {
                return field.checked === true;
            }
            return value !== null && value !== "";
        },
        max_length: function(field, length) {
            if (!regexs.numeric.test(length)) return false;
            return getValue(field).length <= parseInt(length, 10);
        },
        min_length: function(field, length) {
            if (!regexs.numeric.test(length)) return false;
            return getValue(field).length >= parseInt(length, 10);
        }
    };
    var Validator = function(formEl, fields, callback) {
        for (var a in _testHook) this[toCamelCase(a)] = _testHook[a];
        this.callback = callback || function() {};
        this.form = _formElement(formEl) || {};
        this.errors = [];
        this.fields = {};
        this.handles = {};
        if (!formEl) return this;
        for (var i = 0, fieldLength = fields.length; i < fieldLength; i++) {
            var field = fields[i];
            if (!field.name && !field.names || !field.rules) {
                console.warn(field);
                continue;
            }
            if (field.names) {
                for (var j = 0, fieldNamesLength = field.names.length; j < fieldNamesLength; j++) {
                    addField(this, field, field.names[j]);
                }
            } else {
                addField(this, field, field.name);
            }
        }
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
        validate: function(evt) {
            this.handles["ok"] = true;
            this.handles["evt"] = evt;
            this.errors = [];
            for (var key in this.fields) {
                if (this.fields.hasOwnProperty(key)) {
                    var field = this.fields[key] || {}, el = this.form[field.name];
                    if (el && el !== undefined) {
                        field.id = attributeValue(el, "id");
                        field.el = el;
                        field.type = el.length > 0 ? el[0].type : el.type;
                        field.value = attributeValue(el, "value");
                        field.checked = attributeValue(el, "checked");
                        this._validateField(field);
                    }
                }
            }
            if (typeof this.callback === "function") {
                this.callback(this, evt);
            }
            if (this.errors.length > 0) {
                if (evt && evt.preventDefault) {
                    evt.preventDefault();
                } else if (event) {
                    event.returnValue = false;
                }
            }
            return this;
        },
        _validateField: function(field) {
            var rules = field.rules.split(/\s*\|\s*/g);
            for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
                var method = rules[i];
                var parts = regexs.rule.exec(method);
                var param = null;
                var failed = false;
                if (parts) {
                    method = parts[1], param = parts[2];
                }
                if (typeof _testHook[method] === "function") {
                    if (!_testHook[method].apply(this, [ field, param ])) {
                        failed = true;
                    }
                }
                if (failed) {
                    var message = function() {
                        return field.display.split(/\s*\|\s*/g)[i] && field.display.split(/\s*\|\s*/g)[i].replace("{{" + field.name + "}}", field.value);
                    }();
                    var existingError;
                    for (j = 0; j < this.errors.length; j += 1) {
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
    function toCamelCase(caseName) {
        return caseName.replace(/\_([a-z])/g, function(all, letter) {
            return letter.toUpperCase();
        });
    }
    function attributeValue(el, attributeName) {
        var i;
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
    function _formElement(el) {
        return typeof el === "object" ? el : document.forms[el];
    }
    function getValue(field) {
        return typeof field === "string" ? field : field.value;
    }
    return Validator;
});

