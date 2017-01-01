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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _Validator = __webpack_require__(2);
	
	var _Validator2 = _interopRequireDefault(_Validator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _Validator2.default; /**
	                                        * export default
	                                        */

	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util = __webpack_require__(3);
	
	var _Core2 = __webpack_require__(5);
	
	var _Core3 = _interopRequireDefault(_Core2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * validator 组件
	 */
	var Validator = function (_Core) {
	  _inherits(Validator, _Core);
	
	  function Validator() {
	    _classCallCheck(this, Validator);
	
	    return _possibleConstructorReturn(this, (Validator.__proto__ || Object.getPrototypeOf(Validator)).apply(this, arguments));
	  }
	
	  _createClass(Validator, [{
	    key: 'afterFieldValidate',
	
	
	    /**
	     * Field 验证之后处理
	     * @param isSuccess
	     * @param error
	     */
	    value: function afterFieldValidate(isSuccess, error) {
	      // 错误信息操作
	      _extends(error, {
	        placeId: 'valid_error_place_' + (error.id || error.name)
	      });
	
	      // 当前条目验证结果展示
	      if (isSuccess) {
	        this.handleSuccessPlace(error);
	      } else {
	        this.handleErrorPlace(error);
	      }
	    }
	
	    /**
	     * 绑定用户输入事件和改变事件
	     */
	
	  }, {
	    key: 'addFormEvent',
	    value: function addFormEvent() {
	      var _this2 = this;
	
	      var handleChange = function handleChange(e) {
	        var evt = (0, _util.getCurrentEvent)(e);
	        var el = evt.target || evt.srcElement;
	        var field = _this2.fields[el.name];
	
	        var elArray = _this2.handleGetArrayByName(field.name);
	        if ((0, _util.isSameNameField)(elArray)) {
	          field.el = [el];
	        } else {
	          // 设置触发事件的表单元素
	          field.el = elArray;
	        }
	        // 验证单个表单
	        return _this2.assembleValidateField(field);
	      };
	
	      this.form.oninput = handleChange;
	      this.form.onchange = handleChange;
	      return this;
	    }
	
	    /**
	     * 验证成功操作
	     * @param {Object} error
	     */
	
	  }, {
	    key: 'handleSuccessPlace',
	    value: function handleSuccessPlace(error) {
	      var elArray = error.el;
	      if (!(elArray && elArray.length)) {
	        return;
	      }
	
	      var classNames = this.opts.classNames;
	
	      // 类操作
	      elArray.forEach(function (theEl) {
	        (0, _util.removeClass)(theEl, classNames.error);
	        (0, _util.addClass)(theEl, classNames.success);
	      });
	
	      // 移除错误信息节点
	      var errorEl = document.getElementById(error.placeId);
	      if (errorEl) {
	        errorEl.parentNode.removeChild(errorEl);
	      }
	    }
	
	    /**
	     * 验证错误操作
	     * @param {Object} error
	     */
	
	  }, {
	    key: 'handleErrorPlace',
	    value: function handleErrorPlace(error) {
	      var elArray = error.el;
	      if (!(elArray && elArray.length)) {
	        return;
	      }
	
	      var classNames = this.opts.classNames;
	
	      elArray.forEach(function (theEl) {
	        (0, _util.removeClass)(theEl, classNames.success);
	        (0, _util.addClass)(theEl, classNames.error);
	      });
	
	      // 错误信息元素
	      var errorEl = document.getElementById(error.placeId);
	      if (!errorEl) {
	        // 创建信息元素
	        errorEl = document.createElement('label');
	        (0, _util.addClass)(errorEl, classNames.error + '-message');
	        errorEl.setAttribute('id', error.placeId);
	      }
	      errorEl.innerText = error.message;
	
	      // 错误信息位置
	      if (typeof this.opts.errorPlacement === 'function') {
	        // 参数：错误信息节点，当前表单节点
	        this.opts.errorPlacement(errorEl, elArray);
	      } else {
	        // 默认错误信息位置
	        // label 、 radio 元素错误位置不固定，默认不设置
	        var fieldEl = elArray[0];
	        if (!(0, _util.isRadioOrCheckbox)(fieldEl)) {
	          fieldEl.parentNode.appendChild(errorEl);
	        }
	      }
	    }
	  }]);
	
	  return Validator;
	}(_Core3.default);
	
	exports.default = Validator;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _util = __webpack_require__(4);
	
	Object.defineProperty(exports, 'getValue', {
	  enumerable: true,
	  get: function get() {
	    return _util.getValue;
	  }
	});
	Object.defineProperty(exports, 'parseToDate', {
	  enumerable: true,
	  get: function get() {
	    return _util.parseToDate;
	  }
	});
	exports.getCurrentEvent = getCurrentEvent;
	exports.isRadioOrCheckbox = isRadioOrCheckbox;
	exports.isSelect = isSelect;
	exports.isSameNameField = isSameNameField;
	exports.attributeValue = attributeValue;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.assembleField = assembleField;
	
	
	/**
	 * 获取当前事件
	 * @param {Event} evt
	 * @return {Event}
	 */
	function getCurrentEvent(evt) {
	  return evt || window.event;
	}
	
	/**
	 * 判断节点是否为 radio 或者 checkbox
	 * @param el
	 * @return {Boolean}
	 */
	function isRadioOrCheckbox(el) {
	  return el.type === 'radio' || el.type === 'checkbox';
	}
	
	/**
	 * 判断节点是否为 select
	 * @param {Element} elArray
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
	 * 获取节点对象的属性
	 * @param {Object} elArray 传入节点
	 * @param {String} attributeName 需要获取的属性
	 * @return {String} 属性值
	 */
	function attributeValue(elArray, attributeName) {
	  if (isRadioOrCheckbox(elArray[0])) {
	    for (var i = 0, elLength = elArray.length; i < elLength; i += 1) {
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
	 * @param {String} className
	 */
	function hasClass(el, className) {
	  return el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	
	/**
	 * 添加 class
	 * @param {Element} el
	 * @param {String} className
	 */
	function addClass(el, className) {
	  if (!hasClass(el, className)) {
	    if (el.classList) {
	      el.classList.add(className);
	    } else {
	      el.className += ' ' + className; // eslint-disable-line no-param-reassign
	    }
	  }
	}
	
	/**
	 * 移除 class
	 * @param {Element} el
	 * @param {String} className
	 */
	function removeClass(el, className) {
	  if (hasClass(el, className)) {
	    if (el.classList) {
	      el.classList.remove(className);
	    } else {
	      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	      el.className = el.className.replace(reg, ' '); // eslint-disable-line no-param-reassign
	    }
	  }
	}
	
	/**
	 * 初始化域的其他属性
	 */
	var fieldOtherInitProps = exports.fieldOtherInitProps = {
	  id: null,
	  el: null,
	  type: null,
	  value: null,
	  checked: null
	};
	
	/**
	 * 组装验证域
	 * field.el 统一为 Array 对象
	 * @param {Object} field
	 */
	function assembleField(field) {
	  // 设置验证信息域属性
	  var el = field.el;
	  if (el) {
	    _extends(field, {
	      id: el[0].id,
	      type: el[0].type,
	      value: attributeValue(el, 'value'),
	      checked: attributeValue(el, 'checked')
	    });
	  } else {
	    // 动态删除表单域之后初始化其他属性
	    _extends(field, fieldOtherInitProps);
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.getValue = getValue;
	exports.parseToDate = parseToDate;
	/**
	 * 获取 value 属性
	 * @param {*} field 域
	 * @return {String}
	 */
	function getValue(field) {
	  return (typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object' ? field.value : field;
	}
	
	/**
	 * 字符串转换为日期
	 * @param {String} param 日期格式：YYYY-MM-DD
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
	//# sourceMappingURL=util.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _validateFrameworkUtils = __webpack_require__(6);
	
	var _validateFrameworkUtils2 = _interopRequireDefault(_validateFrameworkUtils);
	
	var _util = __webpack_require__(3);
	
	var _testHook = __webpack_require__(11);
	
	var _testHook2 = _interopRequireDefault(_testHook);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * 验证组件
	 */
	var Core = function (_BaseValidator) {
	  _inherits(Core, _BaseValidator);
	
	  function Core(options) {
	    var _ret2;
	
	    _classCallCheck(this, Core);
	
	    // 合并验证方法
	    var _this = _possibleConstructorReturn(this, (Core.__proto__ || Object.getPrototypeOf(Core)).call(this));
	
	    _extends(_this, _testHook2.default);
	
	    // 无参数
	    if (!options) {
	      var _ret;
	
	      return _ret = _this, _possibleConstructorReturn(_this, _ret);
	    }
	
	    // params
	    _this.opts = _extends({
	      classNames: {
	        error: 'valid-error',
	        success: 'valid-success'
	      }
	    }, options);
	
	    // init
	    _this.form = {};
	    _this.errors = {};
	    _this.fields = {};
	    _this.handles = {};
	
	    // 构建具有所有需要验证的信息域
	    _this.addFields(_this.opts.fields);
	
	    // 有 form 表单的验证
	    if (_this.opts.formName) {
	      // 获取表单对象
	      _this.form = document.forms[_this.opts.formName];
	      // 添加 novalidate
	      _this.form.setAttribute('novalidate', 'novalidate');
	      // 绑定表单事件
	      _this.addFormEvent();
	      // 绑定提交事件
	      _this.handleOnSubmit();
	    }
	    return _ret2 = _this, _possibleConstructorReturn(_this, _ret2);
	  }
	
	  /**
	   * 验证整体表单域
	   * @param  {Event} evt 当前事件
	   * @return {Boolean} 是否成功
	   */
	
	
	  _createClass(Core, [{
	    key: 'validate',
	    value: function validate(evt) {
	      var _this2 = this;
	
	      this.handles.evt = (0, _util.getCurrentEvent)(evt);
	      var isSuccess = true;
	
	      Object.keys(this.fields).forEach(function (name) {
	        // 通过 name 验证
	        if (!_this2.validateByName(name)) {
	          isSuccess = false;
	        }
	      });
	
	      // 如果有错误，停止 submit 提交
	      if (!isSuccess) {
	        this.preventSubmit();
	      }
	
	      // 执行回调函数
	      if (typeof this.opts.callback === 'function') {
	        this.opts.callback(isSuccess, this.errors);
	      }
	
	      return isSuccess;
	    }
	
	    /**
	     * 验证单个表单域
	     * @param {String} name 属性
	     * @return {Boolean}
	     */
	
	  }, {
	    key: 'validateByName',
	    value: function validateByName(name) {
	      var _this3 = this;
	
	      var field = this.fields[name];
	      var isSuccess = true;
	
	      // 单个验证没找到规则
	      if (!field) {
	        return !isSuccess;
	      }
	
	      // 获取验证的 DOM 节点数组
	      var elArray = this.handleGetArrayByName(field.name);
	
	      // 表单 name 属性相同且不是 radio、checkbox、select 的表单域
	      if ((0, _util.isSameNameField)(elArray)) {
	        elArray.forEach(function (item) {
	          // 当前验证的 field 对象
	          // 默认设置 el 为数组对象
	          field.el = [item];
	          if (!_this3.assembleValidateField(field)) {
	            isSuccess = false;
	          }
	        });
	      } else {
	        // 正常验证
	        field.el = elArray;
	        isSuccess = this.assembleValidateField(field);
	      }
	
	      return isSuccess;
	    }
	
	    /**
	     * 验证及组装错误信息
	     * @param field
	     * @return {Boolean}
	     */
	
	  }, {
	    key: 'assembleValidateField',
	    value: function assembleValidateField(field) {
	      // 初始化
	      (0, _util.assembleField)(field);
	      // 验证
	
	      var _validateByField = this.validateByField(field),
	          result = _validateByField.result,
	          error = _validateByField.error;
	      // 错误信息
	
	
	      error.el = field.el;
	      this.errors[error.name] = result ? null : error;
	      // 验证钩子
	      this.afterFieldValidate(result, error);
	
	      return result;
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
	     * 动态添加 fields 方法
	     * @param {Object} fields
	     */
	
	  }, {
	    key: 'addFields',
	    value: function addFields(fields) {
	      var _this4 = this;
	
	      if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) === 'object') {
	        // 构建具有所有需要验证的信息域
	        Object.keys(fields).forEach(function (name) {
	          // 构建单个需要验证的信息域
	          _this4.fields[name] = _extends({}, fields[name], {
	            name: name
	          }, _util.fieldOtherInitProps);
	        });
	      }
	      return this;
	    }
	
	    /**
	     * 动态移除 fields 方法
	     * @param {string} names 名称
	     */
	
	  }, {
	    key: 'removeFields',
	    value: function removeFields() {
	      var _this5 = this;
	
	      for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
	        names[_key] = arguments[_key];
	      }
	
	      names.forEach(function (name) {
	        // 移除域和错误类
	        delete _this5.fields[name];
	        delete _this5.errors[name];
	      });
	      return this;
	    }
	
	    /**
	     * 绑定 submit 按钮提交事件
	     */
	
	  }, {
	    key: 'handleOnSubmit',
	    value: function handleOnSubmit() {
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
	     * 将 nodeList 转换为 Array 统一验证
	     * @param {String} name 节点
	     * @return {Array}
	     */
	
	  }, {
	    key: 'handleGetArrayByName',
	    value: function handleGetArrayByName(name) {
	      // field element
	      var el = this.form[name];
	      var result = [];
	
	      // 如果节点对象不存在或长度为零
	      if (!el || el.length === 0) {
	        return result;
	      }
	
	      // 将节点转换为数组
	      var elLength = el.length;
	
	      // 排除 select， select 为数组形式
	      if (elLength && !(0, _util.isSelect)(el)) {
	        for (var i = 0; i < elLength; i += 1) {
	          result.push(el[i]);
	        }
	      } else {
	        result.push(el);
	      }
	      return result;
	    }
	  }]);
	
	  return Core;
	}(_validateFrameworkUtils2.default);
	
	exports.default = Core;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _Validator = __webpack_require__(7);
	
	var _Validator2 = _interopRequireDefault(_Validator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _Validator2.default; /**
	                                        * export default component
	                                        */
	//# sourceMappingURL=index.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _testHook = __webpack_require__(8);
	
	var _testHook2 = _interopRequireDefault(_testHook);
	
	var _core = __webpack_require__(10);
	
	var _core2 = _interopRequireDefault(_core);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 验证组件
	 */
	var Validator = function () {
	  function Validator() {
	    _classCallCheck(this, Validator);
	
	    // 绑定验证基本验证方法
	    _extends(this, _extends({}, _testHook2.default));
	    return this;
	  }
	
	  /**
	   * 添加验证方法
	   * @param methods
	   * @return {Validator}
	   */
	
	
	  _createClass(Validator, [{
	    key: 'addMethods',
	    value: function addMethods(methods) {
	      _extends(this, methods);
	      return this;
	    }
	
	    /**
	     * 移除验证方法
	     * @param names
	     * @return {Validator}
	     */
	
	  }, {
	    key: 'removeMethods',
	    value: function removeMethods() {
	      var _this = this;
	
	      for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
	        names[_key] = arguments[_key];
	      }
	
	      names.forEach(function (name) {
	        return delete _this[name];
	      });
	      return this;
	    }
	
	    /**
	     * 通过 field 验证
	     * @param  {Object} field 验证信息域
	     * @return {Object} 包含结果、错误信息
	     */
	
	  }, {
	    key: 'validateByField',
	    value: function validateByField(field) {
	      return _core2.default.call(this, field);
	    }
	  }]);
	
	  return Validator;
	}();
	
	exports.default = Validator;
	//# sourceMappingURL=Validator.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _regex = __webpack_require__(9);
	
	var _regex2 = _interopRequireDefault(_regex);
	
	var _util = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * 验证方法
	 */
	exports.default = {
	
	  // 自然数
	  isNumeric: function isNumeric(field) {
	    return _regex2.default.numeric.test((0, _util.getValue)(field));
	  },
	
	
	  // 整数
	  isInteger: function isInteger(field) {
	    return _regex2.default.integer.test((0, _util.getValue)(field));
	  },
	
	
	  // 浮点数
	  isDecimal: function isDecimal(field) {
	    return _regex2.default.decimal.test((0, _util.getValue)(field));
	  },
	
	
	  // 邮箱
	  isEmail: function isEmail(field) {
	    return _regex2.default.email.test((0, _util.getValue)(field));
	  },
	
	
	  // IP 地址
	  isIp: function isIp(field) {
	    return _regex2.default.ip.test((0, _util.getValue)(field));
	  },
	
	
	  // 座机
	  isTel: function isTel(field) {
	    return _regex2.default.tel.test((0, _util.getValue)(field));
	  },
	
	
	  // 手机
	  isPhone: function isPhone(field) {
	    return _regex2.default.phone.test((0, _util.getValue)(field));
	  },
	
	
	  // 字母数字下划线
	  isAbc: function isAbc(field) {
	    return _regex2.default.abc.test((0, _util.getValue)(field));
	  },
	
	
	  // URL
	  isUrl: function isUrl(field) {
	    return _regex2.default.url.test((0, _util.getValue)(field));
	  },
	
	
	  // 日期
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
	      // 闰年 2 月 29 号
	      if (year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
	        numDays[1] = 29;
	      }
	
	      // 检查日期
	      return !(day < 1 || day > numDays[month - 1]);
	    }
	    return false;
	  },
	
	
	  // 是否为必须
	  required: function required(field) {
	    if (typeof field === 'string') {
	      return field !== '';
	    } else if (Array.isArray(field.value)) {
	      return field.value.length;
	    }
	    return field.value !== null && field.value !== '';
	  },
	
	
	  // 大于某个数
	  greaterThan: function greaterThan(field, param) {
	    var value = (0, _util.getValue)(field);
	    if (!_regex2.default.decimal.test(value)) {
	      return false;
	    }
	    return parseFloat(value) > parseFloat(param);
	  },
	
	
	  // 小于某个数
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
	
	    if (!(paramDate && currentDate)) {
	      return false;
	    }
	    return currentDate > paramDate;
	  },
	
	
	  // 小于某个日期
	  lessThanDate: function lessThanDate(field, date) {
	    var currentDate = (0, _util.parseToDate)((0, _util.getValue)(field));
	    var paramDate = (0, _util.parseToDate)(date);
	
	    if (!(paramDate && currentDate)) {
	      return false;
	    }
	    return currentDate < paramDate;
	  }
	};
	//# sourceMappingURL=testHook.js.map

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 正则表达式
	 */
	exports.default = {
	
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
	//# sourceMappingURL=regex.js.map

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
	                                                                                                                                                                                                                                                                   * 通过 field 验证
	                                                                                                                                                                                                                                                                   * @param  {Object} field 验证信息域
	                                                                                                                                                                                                                                                                   * @return {Object} 包含结果、错误信息
	                                                                                                                                                                                                                                                                   */
	
	
	exports.default = function (field) {
	  var _this = this;
	
	  // 成功标识
	  var result = true;
	  // 错误信息域
	  var error = {
	    id: field.id,
	    name: field.name,
	    value: field.value
	  };
	
	  var rules = field.rules.split(/\s*\|\s*/g);
	
	  var isRequired = rules.some(function (rule) {
	    return rule === 'required';
	  });
	  var isEmpty = field.value === undefined || field.value === null || field.value === '';
	
	  rules.forEach(function (rule, index) {
	    // 标识不通过，则不继续验证该规则
	    if (!result) {
	      return;
	    }
	
	    // 转换：maxLength(12) => ['maxLength', 12]
	    var parts = /^(.+?)\((.+)\)$/.exec(rule);
	    var method = rule;
	    var param = '';
	
	    // 解析带参数的验证如 maxLength(12)
	    if (parts) {
	      method = parts[1];
	      param = parts[2];
	    }
	
	    // 信息域规则中没有包含 required，并且该值为空，则不验证
	    var jumpRule = !isRequired && isEmpty;
	
	    // 匹配验证
	    if (typeof _this[method] === 'function' && !jumpRule) {
	      if (!_this[method].apply(_this, [field, param])) {
	        result = false;
	      }
	    }
	
	    // 验证不通过，解析错误信息
	    if (!result) {
	      _extends(error, {
	        rule: method,
	        message: function () {
	          var seqText = field.messages ? field.messages.split(/\s*\|\s*/g)[index] : '';
	          // 替换 {{value}} 和 {{param}} 中参数
	          return seqText ? seqText.replace(/\{\{\s*value\s*}}/g, field.value).replace(/\{\{\s*param\s*}}/g, param) : seqText;
	        }()
	      });
	    }
	  });
	
	  return {
	    result: result,
	    error: error
	  };
	};
	//# sourceMappingURL=core.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _util = __webpack_require__(3);
	
	// 合并条件
	exports.default = {
	  // 是否为必须
	  required: function required(field) {
	    if (typeof field === 'string') {
	      return field !== '';
	    } else if (Array.isArray(field.value)) {
	      return field.value.length;
	    } else if ((0, _util.isRadioOrCheckbox)(field)) {
	      return field.checked === true;
	    }
	    return field.value !== null && field.value !== '';
	  }
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Validator.js.map