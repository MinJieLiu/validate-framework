'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _testHook = require('./testHook');

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