'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _Validator = require('./Validator');

var _Validator2 = _interopRequireDefault(_Validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * validator 组件
 */
var Validator = function (_ValidatorCore) {
  _inherits(Validator, _ValidatorCore);

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
}(_Validator2.default);

exports.default = Validator;
module.exports = exports['default'];