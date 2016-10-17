(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Validator", [], factory);
	else if(typeof exports === 'object')
		exports["Validator"] = factory();
	else
		root["Validator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Validator = __webpack_require__(1);
	
	var _Validator2 = _interopRequireDefault(_Validator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Validator2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util = __webpack_require__(2);
	
	var _Validate2 = __webpack_require__(3);
	
	var _Validate3 = _interopRequireDefault(_Validate2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * validator 组件
	 */
	var Validator = function (_Validate) {
	  _inherits(Validator, _Validate);
	
	  function Validator() {
	    _classCallCheck(this, Validator);
	
	    return _possibleConstructorReturn(this, (Validator.__proto__ || Object.getPrototypeOf(Validator)).apply(this, arguments));
	  }
	
	  _createClass(Validator, [{
	    key: 'afterFieldValidate',
	
	
	    /**
	     * Field 验证之后处理
	     * @param isSuccess
	     * @param errors
	     */
	    value: function afterFieldValidate(isSuccess, errors) {
	      // 错误信息操作
	      if (errors) {
	        // 添加错误类信息
	        var clazz = this.opts.prefix + '-error';
	        errors.clazz = clazz;
	        // 设置错误 id
	        errors.placeId = (clazz + '_' + (errors.id || errors.name)).replace('-', '_');
	
	        // 当前条目验证结果展示
	        if (isSuccess) {
	          this._removeErrorPlace(errors);
	        } else {
	          this._addErrorPlace(errors);
	        }
	      }
	    }
	
	    /**
	     * 绑定用户输入事件和改变事件
	     * @param {String} name 属性
	     * @param {String} level 事件级别 off/change/all
	     */
	
	  }, {
	    key: 'onInputEvent',
	    value: function onInputEvent(name, level) {
	      var validateFieldFunc = function (that) {
	        return function (e) {
	          try {
	            var evt = (0, _util.getCurrentEvent)(e);
	            var el = evt.target || evt.srcElement;
	            var field = that.fields[el.name];
	
	            // 设置触发事件的表单元素
	            field.el = that._getArrayByName(field.name);
	            // 验证单个表单
	            return that._validateField(field);
	          } catch (ex) {
	            return null;
	          }
	        };
	      }(this);
	
	      // 绑定表单值改变拦截
	      var formEls = name ? this._getArrayByName(name) : this.form.elements;
	
	      for (var i = 0, formElsLength = formEls.length; i < formElsLength; i++) {
	        var oninput = void 0;
	        var onchange = void 0;
	        var noop = function noop() {};
	        var thatLevel = level || this.opts.eventLevel;
	        // 触发事件绑定
	        switch (thatLevel) {
	          case 'off':
	            oninput = noop;
	            onchange = noop;
	            break;
	          case 'change':
	            oninput = noop;
	            onchange = validateFieldFunc;
	            break;
	          case 'all':
	            oninput = validateFieldFunc;
	            onchange = validateFieldFunc;
	            break;
	          default:
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
	    }
	
	    /**
	     * 移除当前条目错误信息
	     * @param {Object} errorObj 验证信息域
	     */
	
	  }, {
	    key: '_removeErrorPlace',
	    value: function _removeErrorPlace(errorObj) {
	      if (!errorObj.el) {
	        return;
	      }
	
	      // 移除表单域错误类
	      for (var i = 0, elLength = errorObj.el.length; i < elLength; i++) {
	        (0, _util.removeClass)(errorObj.el[i], errorObj.clazz);
	        (0, _util.addClass)(errorObj.el[i], this.opts.prefix + '-success');
	      }
	
	      // 移除错误信息节点
	      var errorEl = document.getElementById(errorObj.placeId);
	      errorEl && errorEl.parentNode.removeChild(errorEl);
	    }
	
	    /**
	     * 添加当前条目错误信息
	     * @param {Object} errorObj 验证信息域
	     */
	
	  }, {
	    key: '_addErrorPlace',
	    value: function _addErrorPlace(errorObj) {
	      if (!errorObj.el) {
	        return;
	      }
	
	      // 清除之前保留的错误信息
	      this._removeErrorPlace(errorObj);
	
	      var opts = this.opts;
	
	      // 当前表单域添加错误类
	      for (var i = 0, elLength = errorObj.el.length; i < elLength; i++) {
	        (0, _util.removeClass)(errorObj.el[i], opts.prefix + '-success');
	        (0, _util.addClass)(errorObj.el[i], errorObj.clazz);
	      }
	
	      // 创建元素
	      var errorEl = document.createElement(opts.errorEl);
	      (0, _util.addClass)(errorEl, errorObj.clazz + '-message');
	      errorEl.setAttribute('id', errorObj.placeId);
	      errorEl.innerText = errorObj.message;
	
	      // 错误信息位置
	      if (typeof opts.errorPlacement === 'function') {
	        // 参数：错误信息节点，当前表单节点
	        opts.errorPlacement(errorEl, errorObj.el[0]);
	      } else {
	        // 默认错误信息位置
	        // label 、 radio 元素错误位置不固定，默认暂不设置
	        var fieldEl = errorObj.el[0];
	        if (!(0, _util.isRadioOrCheckbox)(fieldEl)) {
	          fieldEl.parentNode.appendChild(errorEl);
	        }
	      }
	    }
	  }]);
	
	  return Validator;
	}(_Validate3.default);
	
	exports.default = Validator;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 判断 field 是否为字符串
	 * @param {Object} field 验证域
	 * @return {String} 返回值
	 */
	function getValue(field) {
	  return typeof field === 'string' ? field : field.value;
	}
	
	/**
	 * 对象继承
	 * @param {Object} target
	 * @param {Object} source
	 * @return {Object} target
	 */
	function extend(target, source) {
	  for (var key in source) {
	    target[key] = source[key];
	  }
	  return target;
	}
	
	/**
	 * 设置除主属性的验证域为默认值
	 * @param field
	 * @return field
	 */
	function initField(field) {
	  field.id = null;
	  field.el = null;
	  field.type = null;
	  field.value = null;
	  field.checked = null;
	  return field;
	}
	
	/**
	 * 转换为日期
	 * @param {String} param 日期格式：yyyy-MM-dd
	 * @return {Date}
	 */
	function parseToDate(param) {
	  var thatDate = new Date();
	  var dateArray = param.split('-');
	
	  thatDate.setFullYear(dateArray[0]);
	  thatDate.setMonth(dateArray[1] - 1);
	  thatDate.setDate(dateArray[2]);
	  return thatDate;
	}
	
	/**
	 * 是否为浏览器环境
	 * @return {Boolean}
	 */
	function isBrowser() {
	  return typeof window !== 'undefined';
	}
	
	/**
	 * 获取当前事件，兼容火狐浏览器
	 * @param {Event} evt
	 * @return {Event}
	 */
	function getCurrentEvent(evt) {
	  return isBrowser() ? evt || window.event : null;
	}
	
	/**
	 * 判断节点是否为 radio 或者 checkbox
	 * @param el 传入节点
	 * @return {Boolean}
	 */
	function isRadioOrCheckbox(el) {
	  return el.type === 'radio' || el.type === 'checkbox';
	}
	
	/**
	 * 判断节点是否为 select
	 * @param {Element} elArray 传入节点
	 * @return {Boolean}
	 */
	function isSelect(elArray) {
	  return elArray[0].tagName === 'OPTION';
	}
	
	/**
	 * 表单 name 属性相同且不是 radio 或 checkbox 的表单域
	 * @param elArray 传入节点
	 * @return {Boolean}
	 */
	function isSameNameField(elArray) {
	  return elArray && elArray.length && !isRadioOrCheckbox(elArray[0]) && !isSelect(elArray);
	}
	
	/**
	 * 通过 name 获取节点集合
	 * @param {String} name 属性
	 */
	function getElementsByName(name) {
	  return document.getElementsByName(name);
	}
	
	/**
	 * 获取节点对象的属性
	 * @param {Object} elArray 传入节点
	 * @param {String} attributeName 需要获取的属性
	 * @return {String} 属性值
	 */
	function attributeValue(elArray, attributeName) {
	  if (isRadioOrCheckbox(elArray[0])) {
	    for (var i = 0, elLength = elArray.length; i < elLength; i++) {
	      if (elArray[i].checked) {
	        return elArray[i][attributeName];
	      }
	    }
	  }
	  return elArray[0][attributeName];
	}
	
	/**
	 * 判断是否包含 class
	 * @param {Element} el
	 * @param {String} cls 类名
	 */
	function hasClass(el, cls) {
	  return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	
	/**
	 * 添加 class
	 * @param {Element} el
	 * @param {String} cls 类名
	 */
	function addClass(el, cls) {
	  if (!hasClass(el, cls)) {
	    el.classList ? el.classList.add(cls) : el.className += ' ' + cls;
	  }
	}
	
	/**
	 * 移除 class
	 * @param {Element} el
	 * @param {String} cls 类名
	 */
	function removeClass(el, cls) {
	  if (hasClass(el, cls)) {
	    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	    el.classList ? el.classList.remove(cls) : el.className = el.className.replace(reg, ' ');
	  }
	}
	
	exports.getValue = getValue;
	exports.extend = extend;
	exports.initField = initField;
	exports.parseToDate = parseToDate;
	exports.isBrowser = isBrowser;
	exports.getCurrentEvent = getCurrentEvent;
	exports.isRadioOrCheckbox = isRadioOrCheckbox;
	exports.isSelect = isSelect;
	exports.isSameNameField = isSameNameField;
	exports.getElementsByName = getElementsByName;
	exports.attributeValue = attributeValue;
	exports.addClass = addClass;
	exports.removeClass = removeClass;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util = __webpack_require__(2);
	
	var _testHook = __webpack_require__(4);
	
	var _testHook2 = _interopRequireDefault(_testHook);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 核心验证组件，不包括事件及 dom 操作
	 */
	var Validate = function () {
	  function Validate(options) {
	    _classCallCheck(this, Validate);
	
	    // 绑定验证方法
	    for (var key in _testHook2.default) {
	      this[key] = _testHook2.default[key];
	    }
	
	    // 无参数
	    if (!options) {
	      return this;
	    }
	
	    this._default = {
	      // css 类前缀
	      prefix: 'valid',
	      // 错误信息节点
	      errorEl: 'em',
	      // 表单触发事件级别
	      eventLevel: 'all'
	    };
	
	    // 替换默认参数
	    this.opts = (0, _util.extend)(this._default, options);
	    this.form = {};
	    this.bodyData = options.bodyData;
	    this.errors = {};
	    this.fields = {};
	    this.handles = {};
	
	    // 构建具有所有需要验证的信息域
	    this.addFields(this.opts.fields);
	
	    // 有 form 表单的验证
	    if ((0, _util.isBrowser)() && this.opts.formName) {
	      // 获取表单对象
	      this.form = document.forms[this.opts.formName];
	
	      // HTML5 添加 novalidate
	      this.form.setAttribute('novalidate', 'novalidate');
	
	      // 绑定用户输入事件
	      this.onInputEvent && this.onInputEvent(null, 'all');
	
	      // 绑定提交事件
	      this._onSubmit();
	    }
	    return this;
	  }
	
	  /**
	   * 验证整体表单域
	   * @param  {Event} evt 当前事件
	   * @return {Boolean} 是否成功
	   */
	
	
	  _createClass(Validate, [{
	    key: 'validate',
	    value: function validate(evt) {
	      this.handles.evt = (0, _util.getCurrentEvent)(evt);
	      var isSuccess = true;
	      var fields = this.fields;
	
	      for (var name in fields) {
	        // 通过 name 验证
	        if (!this.validateByName(name)) {
	          isSuccess = false;
	        }
	      }
	
	      // 如果有错误，停止 submit 提交，并停止执行回调函数
	      if (!isSuccess) {
	        this.preventSubmit();
	      } else {
	        // 将 null 暴露到 callback 函数中
	        this.errors = null;
	      }
	
	      // 执行回调函数
	      if (typeof this.opts.callback === 'function') {
	        this.opts.callback(this.errors, this.handles.evt);
	      }
	
	      return isSuccess;
	    }
	
	    /**
	     * 验证单个表单域
	     * @param {String} name 属性
	     * @return {Boolean} 是否成功
	     */
	
	  }, {
	    key: 'validateByName',
	    value: function validateByName(name) {
	      var field = this.fields[name];
	      var isSuccess = false;
	
	      // 单个验证没找到规则
	      if (!field) {
	        return isSuccess;
	      }
	
	      // 获取验证的 DOM 节点数组
	      var el = this._getArrayByName(field.name);
	
	      // 表单 name 属性相同且不是 radio、checkbox、select 的表单域
	      if ((0, _util.isSameNameField)(el)) {
	        // 默认通过验证，若有一个错误，则不通过
	        var isMultiSuccess = true;
	        for (var i = 0, elLength = el.length; i < elLength; i++) {
	          // 当前验证的 field 对象
	          // 默认设置 el 为数组对象
	          field.el = [el[i]];
	          // 若有一个错误，则不通过
	          if (!this._validateField(field)) {
	            isMultiSuccess = false;
	          }
	        }
	        isSuccess = isMultiSuccess;
	      } else {
	        // 正常验证
	        field.el = el;
	        isSuccess = this._validateField(field);
	      }
	
	      return isSuccess;
	    }
	
	    /**
	     * 阻止表单提交
	     */
	
	  }, {
	    key: 'preventSubmit',
	    value: function preventSubmit() {
	      var evt = this.handles.evt;
	
	      if (evt && evt.preventDefault) {
	        evt.preventDefault();
	      } else if (evt) {
	        // IE 使用的全局变量
	        evt.returnValue = false;
	      }
	
	      return this;
	    }
	
	    /**
	     * 扩展校验方法
	     * @param {String} name 校验名称
	     * @param {Function} method 校验方法
	     */
	
	  }, {
	    key: 'addMethod',
	    value: function addMethod(name, method) {
	      if (typeof method === 'function') {
	        // 绑定验证方法
	        _testHook2.default[name] = method;
	
	        // 绑定至对象
	        this[name] = method;
	      }
	
	      return this;
	    }
	
	    /**
	     * 动态添加 fields 方法
	     * @param {Object} fields 对象
	     */
	
	  }, {
	    key: 'addFields',
	    value: function addFields(fields) {
	      if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) === 'object') {
	        // 构建具有所有需要验证的信息域
	        for (var name in fields) {
	          var field = fields[name];
	
	          // 规则正确，则进行
	          if (field.rules) {
	            // 初始化 其他属性
	            field.name = name;
	            field = (0, _util.initField)(field);
	
	            // 构建单个需要验证的信息域
	            this.fields[name] = field;
	          }
	        }
	      }
	      return this;
	    }
	
	    /**
	     * 动态移除 fields 方法
	     * @param {Array} fieldNames 名称
	     */
	
	  }, {
	    key: 'removeFields',
	    value: function removeFields(fieldNames) {
	      if (fieldNames instanceof Array) {
	        for (var i = 0, namesLength = fieldNames.length; i < namesLength; i++) {
	          // 移除对象
	          this.fields && delete this.fields[fieldNames[i]];
	          this.errors && delete this.errors[fieldNames[i]];
	        }
	      }
	      return this;
	    }
	
	    /**
	     * 绑定 submit 按钮提交事件
	     */
	
	  }, {
	    key: '_onSubmit',
	    value: function _onSubmit() {
	      var thatOnSubmit = this.form.onsubmit;
	      this.form.onsubmit = function (that) {
	        return function (e) {
	          try {
	            var evt = (0, _util.getCurrentEvent)(e);
	            return that.validate(evt) && (thatOnSubmit === undefined || thatOnSubmit());
	          } catch (ex) {
	            return null;
	          }
	        };
	      }(this);
	    }
	
	    /**
	     * 验证当前节点
	     * @param  {Object} field 验证信息域
	     * @return {Boolean} 是否成功
	     */
	
	  }, {
	    key: '_validateField',
	    value: function _validateField(field) {
	      var _this = this;
	
	      var thatField = field;
	      // 成功标识
	      var isSuccess = true;
	      // 错误对象
	      this.errors = this.errors || {};
	
	      // 更新验证域
	      thatField = this._updateField(thatField);
	
	      var isRequired = thatField.rules.indexOf('required') !== -1;
	      var isEmpty = thatField.value === undefined || thatField.value === '' || thatField.value === null;
	
	      var rules = thatField.rules.split(/\s*\|\s*/g);
	
	      var _loop = function _loop(i, ruleLength) {
	        // 逐条验证，如果已经验证失败，则暂时不需要进入当前条目再次验证
	        if (!isSuccess) {
	          return 'break';
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
	          return 'continue';
	        }
	
	        // 匹配验证
	        if (typeof _testHook2.default[method] === 'function') {
	          if (!_testHook2.default[method].apply(_this, [thatField, param])) {
	            isSuccess = false;
	          }
	        }
	
	        // 错误信息域
	        _this.errors[thatField.name] = {
	          el: thatField.el,
	          id: thatField.id,
	          name: thatField.name,
	          rule: method
	        };
	
	        // 解析错误信息
	        if (!isSuccess) {
	          // 错误提示
	          _this.errors[thatField.name].message = function message() {
	            var seqText = thatField.messages ? thatField.messages.split(/\s*\|\s*/g)[i] : '';
	
	            // 替换 {{value}} 和 {{param}} 为指定值
	            return seqText ? seqText.replace(/\{\{\s*value\s*}}/g, thatField.value).replace(/\{\{\s*param\s*}}/g, param) : seqText;
	          }();
	        }
	      };
	
	      _loop2: for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
	        var _ret = _loop(i, ruleLength);
	
	        switch (_ret) {
	          case 'break':
	            break _loop2;
	
	          case 'continue':
	            continue;}
	      }
	
	      // 钩子：验证单个之后
	
	
	      this.afterFieldValidate && this.afterFieldValidate(isSuccess, this.errors[thatField.name]);
	
	      // 验证成功后，删除之前验证过的信息
	      if (isSuccess) {
	        delete this.errors[thatField.name];
	      }
	
	      return isSuccess;
	    }
	
	    /**
	     * 更新单个验证域
	     * field.el 统一为 Array 对象
	     * @param {Object} field 验证域
	     * @return {Object} field
	     */
	
	  }, {
	    key: '_updateField',
	    value: function _updateField(field) {
	      var thatField = field;
	      // 数据验证模式
	      if (this.bodyData) {
	        thatField.value = this.bodyData[thatField.name];
	        return thatField;
	      }
	
	      // 设置验证信息域属性
	      var el = thatField.el;
	      if (el) {
	        thatField.id = el[0].id;
	        thatField.type = el[0].type;
	        thatField.value = (0, _util.attributeValue)(el, 'value');
	        thatField.checked = (0, _util.attributeValue)(el, 'checked');
	      } else {
	        // 动态删除表单域之后清空对象值
	        thatField = (0, _util.initField)(field);
	      }
	      return thatField;
	    }
	
	    /**
	     * 获取 nodeList 转换为 Array 统一验证，并避免 IE 序列化崩溃 BUG
	     * @param {String} name 节点
	     */
	
	  }, {
	    key: '_getArrayByName',
	    value: function _getArrayByName(name) {
	      // 仅浏览器环境
	      if ((0, _util.isBrowser)()) {
	        var elObj = void 0;
	
	        // 若有 form 存在定位更精确
	        if (this.opts.formName) {
	          elObj = this.form[name];
	        } else {
	          elObj = (0, _util.getElementsByName)(name);
	        }
	
	        // 如果节点对象不存在或长度为零
	        if (!elObj || elObj.length === 0) {
	          return null;
	        }
	
	        // 将节点转换为数组
	        var arr = [];
	        var elLength = elObj.length;
	
	        // 排除 select， select 为数组形式
	        if (elLength && !(0, _util.isSelect)(elObj)) {
	          for (var i = 0; i < elLength; i++) {
	            arr.push(elObj[i]);
	          }
	        } else {
	          arr.push(elObj);
	        }
	        return arr;
	      }
	      return null;
	    }
	  }]);
	
	  return Validate;
	}();
	
	exports.default = Validate;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _regex = __webpack_require__(5);
	
	var _regex2 = _interopRequireDefault(_regex);
	
	var _util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 验证方法类
	 */
	var testHook = {
	
	  // 验证自然数
	  isNumeric: function isNumeric(field) {
	    return _regex2.default.numeric.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证整数
	  isInteger: function isInteger(field) {
	    return _regex2.default.integer.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证浮点数
	  isDecimal: function isDecimal(field) {
	    return _regex2.default.decimal.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证邮箱
	  isEmail: function isEmail(field) {
	    return _regex2.default.email.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证 IP 地址
	  isIp: function isIp(field) {
	    return _regex2.default.ip.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证座机
	  isTel: function isTel(field) {
	    return _regex2.default.tel.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证手机
	  isPhone: function isPhone(field) {
	    return _regex2.default.phone.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证字母数字下划线
	  isAbc: function isAbc(field) {
	    return _regex2.default.abc.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证URL
	  isUrl: function isUrl(field) {
	    return _regex2.default.url.test((0, _util.getValue)(field));
	  },
	
	
	  // 验证日期
	  isDate: function isDate(field) {
	    // 解析日期
	    var thatDate = (0, _util.getValue)(field);
	    if (_regex2.default.date.test(thatDate)) {
	      thatDate = thatDate.split('-');
	      var year = parseInt(thatDate[0], 10);
	      var month = parseInt(thatDate[1], 10);
	      var day = parseInt(thatDate[2], 10);
	
	      if (year < 1 || year > 9999 || month < 1 || month > 12) {
	        return false;
	      }
	
	      var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	      // 闰年2月29号
	      if (year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
	        numDays[1] = 29;
	      }
	
	      // 检查日期
	      return !(day < 1 || day > numDays[month - 1]);
	    }
	    return false;
	  },
	
	
	  // 是否为必填
	  required: function required(field) {
	    if ((0, _util.isRadioOrCheckbox)(field)) {
	      return field.checked === true;
	    }
	    return (0, _util.getValue)(field) !== null && (0, _util.getValue)(field) !== '';
	  },
	
	
	  // 多于 某个数
	  greaterThan: function greaterThan(field, param) {
	    var value = (0, _util.getValue)(field);
	    if (!_regex2.default.decimal.test(value)) {
	      return false;
	    }
	    return parseFloat(value) > parseFloat(param);
	  },
	
	
	  // 少于 某个数
	  lessThan: function lessThan(field, param) {
	    var value = (0, _util.getValue)(field);
	    if (!_regex2.default.decimal.test(value)) {
	      return false;
	    }
	    return parseFloat(value) < parseFloat(param);
	  },
	
	
	  // 最大长度
	  maxLength: function maxLength(field, length) {
	    if (!_regex2.default.integer.test(length)) {
	      return false;
	    }
	    return (0, _util.getValue)(field).length <= parseInt(length, 10);
	  },
	
	
	  // 最小长度
	  minLength: function minLength(field, length) {
	    if (!_regex2.default.integer.test(length)) {
	      return false;
	    }
	    return (0, _util.getValue)(field).length >= parseInt(length, 10);
	  },
	
	
	  // 大于某个日期
	  greaterThanDate: function greaterThanDate(field, date) {
	    var currentDate = (0, _util.parseToDate)((0, _util.getValue)(field));
	    var paramDate = (0, _util.parseToDate)(date);
	
	    if (!paramDate || !currentDate) {
	      return false;
	    }
	    return currentDate > paramDate;
	  },
	
	
	  // 小于某个日期
	  lessThanDate: function lessThanDate(field, date) {
	    var currentDate = (0, _util.parseToDate)((0, _util.getValue)(field));
	    var paramDate = (0, _util.parseToDate)(date);
	
	    if (!paramDate || !currentDate) {
	      return false;
	    }
	    return currentDate < paramDate;
	  }
	};
	
	exports.default = testHook;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 正则表达式
	 */
	var regex = {
	
	  // 自然数
	  numeric: /^\d+$/,
	
	  // 整数
	  integer: /^-?\d+$/,
	
	  // 浮点数
	  decimal: /^-?\d*\.?\d+$/,
	
	  // 邮箱
	  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	
	  // IP 地址 [ip ipv4、ipv6]
	  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
	
	  // 电话号码
	  tel: /^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
	
	  // 手机号码
	  phone: /^1[3-9]\d{9}$/,
	
	  // 字母数字或下划线
	  abc: /^\w+$/,
	
	  // URL
	  url: /[a-zA-Z]+:\/\/[^\s]*/,
	
	  // 日期
	  date: /^\d{4}-\d{1,2}-\d{1,2}$/
	};
	
	exports.default = regex;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Validator-dom.js.map