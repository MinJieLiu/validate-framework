import {
  getCurrentEvent,
  isRadioOrCheckbox,
} from './util';
import Core from './Core';

/**
 * validator 组件
 */
export default class Validator extends Core {

  /**
   * Field 验证之后处理
   * @param isSuccess
   * @param error
   */
  afterFieldValidate(isSuccess, error) {
    // 错误信息操作
    Object.assign(error, {
      placeId: (`place_${error.id || error.name}`),
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
   * @param {String} name 属性
   * @param {String} level 事件级别 off/change/all
   */
  onInputEvent(name, level) {
    const validateFieldFunc = (that => (e) => {
      try {
        const evt = getCurrentEvent(e);
        const el = evt.target || evt.srcElement;
        const field = that.fields[el.name];

        // 设置触发事件的表单元素
        field.el = that.handleGetArrayByName(field.name);
        // 验证单个表单
        return that.assembleValidateField(field);
      } catch (ex) {
        return null;
      }
    })(this);

    // 绑定表单值改变拦截
    const formEls = name ? this.handleGetArrayByName(name) : this.form.elements;

    for (let i = 0, formElsLength = formEls.length; i < formElsLength; i += 1) {
      let oninput;
      let onchange;
      const noop = function () {
      };
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
   * 验证成功操作
   * @param {Object} error
   */
  handleSuccessPlace(error) {
    const elArray = error.el;
    if (!elArray.length) {
      return;
    }

    const classNames = this.opts.classNames;

    // 类操作
    elArray.forEach((name) => {
      elArray[name].classList
        .remove(classNames.error)
        .add(classNames.success);
    });

    // 移除错误信息节点
    const errorEl = document.getElementById(error.placeId);
    if (errorEl) {
      errorEl.parentNode.removeChild(errorEl);
    }
  }

  /**
   * 验证错误操作
   * @param {Object} error
   */
  handleErrorPlace(error) {
    const elArray = error.el;
    if (!elArray.length) {
      return;
    }

    const classNames = this.opts.classNames;

    elArray.forEach((name) => {
      elArray[name].classList
        .remove(classNames.success)
        .add(classNames.error);
    });

    // 创建信息元素
    const errorEl = document.createElement('label');
    errorEl.classList.add(`${classNames.error}-message`);
    errorEl.setAttribute('id', error.placeId);
    errorEl.innerText = error.message;

    // 错误信息位置
    if (typeof this.opts.errorPlacement === 'function') {
      // 参数：错误信息节点，当前表单节点
      this.opts.errorPlacement(errorEl, elArray);
    } else {
      // 默认错误信息位置
      // label 、 radio 元素错误位置不固定，默认不设置
      const fieldEl = elArray[0];
      if (!isRadioOrCheckbox(fieldEl)) {
        fieldEl.parentNode.appendChild(errorEl);
      }
    }
  }
}
