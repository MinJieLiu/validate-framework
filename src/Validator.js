import {
  getCurrentEvent,
  isRadioOrCheckbox,
  isSameNameField,
  addClass,
  removeClass,
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
      placeId: (`valid_error_place_${error.id || error.name}`),
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
  addFormEvent() {
    const handleChange = (e) => {
      const evt = getCurrentEvent(e);
      const el = evt.target || evt.srcElement;
      const field = this.fields[el.name];

      const elArray = this.handleGetArrayByName(field.name);
      if (isSameNameField(elArray)) {
        field.el = [el];
      } else {
        // 设置触发事件的表单元素
        field.el = elArray;
      }
      // 验证单个表单
      return this.assembleValidateField(field);
    };

    this.form.oninput = handleChange;
    this.form.onchange = handleChange;
    return this;
  }

  /**
   * 验证成功操作
   * @param {Object} error
   */
  handleSuccessPlace(error) {
    const elArray = error.el;
    if (!(elArray && elArray.length)) {
      return;
    }

    const classNames = this.opts.classNames;

    // 类操作
    elArray.forEach((theEl) => {
      removeClass(theEl, classNames.error);
      addClass(theEl, classNames.success);
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
    if (!(elArray && elArray.length)) {
      return;
    }

    const classNames = this.opts.classNames;

    elArray.forEach((theEl) => {
      removeClass(theEl, classNames.success);
      addClass(theEl, classNames.error);
    });

    // 错误信息元素
    let errorEl = document.getElementById(error.placeId);
    if (!errorEl) {
      // 创建信息元素
      errorEl = document.createElement('label');
      addClass(errorEl, `${classNames.error}-message`);
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
      const fieldEl = elArray[0];
      if (!isRadioOrCheckbox(fieldEl)) {
        fieldEl.parentNode.appendChild(errorEl);
      }
    }
  }
}
