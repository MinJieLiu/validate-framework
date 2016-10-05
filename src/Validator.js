import {
  getCurrentEvent,
  isRadioOrCheckbox,
  addClass,
  removeClass,
} from './util';
import Validate from './Validate';

export default class Validator extends Validate {

  /**
   * Field 验证之后处理
   * @param isSuccess
   * @param errors
   */
  afterFieldValidate(isSuccess, errors) {
    // 错误信息操作
    if (errors) {
      // 添加错误类信息
      const clazz = `${this.opts.prefix}-error`;
      errors.clazz = clazz;
      // 设置错误 id
      errors.placeId = (`${clazz}_${errors.id || errors.name}`).replace('-', '_');

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
  onInputEvent(name, level) {
    const validateFieldFunc = (function (that) {
      return function (e) {
        try {
          const evt = getCurrentEvent(e);
          const el = evt.target || evt.srcElement;
          const field = that.fields[el.name];

          // 设置触发事件的表单元素
          field.el = that._getArrayByName(field.name);
          // 验证单个表单
          return that._validateField(field);
        } catch (ex) {
          return null;
        }
      };
    }(this));

    // 绑定表单值改变拦截
    const formEls = name ? this._getArrayByName(name) : this.form.elements;

    for (let i = 0, formElsLength = formEls.length; i < formElsLength; i++) {
      let oninput;
      let onchange;
      const noop = function () {};
      const thatLevel = level || this.opts.eventLevel;
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
      const thisEl = formEls[i];
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
  _removeErrorPlace(errorObj) {
    if (!errorObj.el) {
      return;
    }

    // 移除表单域错误类
    for (let i = 0, elLength = errorObj.el.length; i < elLength; i++) {
      removeClass(errorObj.el[i], errorObj.clazz);
      addClass(errorObj.el[i], `${this.opts.prefix}-success`);
    }

    // 移除错误信息节点
    const errorEl = document.getElementById(errorObj.placeId);
    errorEl && errorEl.parentNode.removeChild(errorEl);
  }

  /**
   * 添加当前条目错误信息
   * @param {Object} errorObj 验证信息域
   */
  _addErrorPlace(errorObj) {
    if (!errorObj.el) {
      return;
    }

    // 清除之前保留的错误信息
    this._removeErrorPlace(errorObj);

    const opts = this.opts;

    // 当前表单域添加错误类
    for (let i = 0, elLength = errorObj.el.length; i < elLength; i++) {
      removeClass(errorObj.el[i], `${opts.prefix}-success`);
      addClass(errorObj.el[i], errorObj.clazz);
    }

    // 创建元素
    const errorEl = document.createElement(opts.errorEl);
    addClass(errorEl, `${errorObj.clazz}-message`);
    errorEl.setAttribute('id', errorObj.placeId);
    errorEl.innerText = errorObj.message;

    // 错误信息位置
    if (typeof opts.errorPlacement === 'function') {
      // 参数：错误信息节点，当前表单节点
      opts.errorPlacement(errorEl, errorObj.el[0]);
    } else {
      // 默认错误信息位置
      // label 、 radio 元素错误位置不固定，默认暂不设置
      const fieldEl = errorObj.el[0];
      if (!isRadioOrCheckbox(fieldEl)) {
        fieldEl.parentNode.appendChild(errorEl);
      }
    }
  }
}
