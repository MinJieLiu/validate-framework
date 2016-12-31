import BaseValidator from 'validate-framework-utils';
import {
  getCurrentEvent,
  isSelect,
  isSameNameField,
  fieldOtherInitProps,
  assembleField,
} from './util';
import testHook from './testHook';

/**
 * 验证组件
 */
export default class Core extends BaseValidator {

  constructor(options) {
    super();
    // 合并验证方法
    Object.assign(this, testHook);

    // 无参数
    if (!options) {
      return this;
    }

    // params
    this.opts = Object.assign({
      classNames: {
        error: 'valid-error',
        success: 'valid-success',
      },
    }, options);

    // init
    this.form = {};
    this.errors = {};
    this.fields = {};
    this.handles = {};

    // 构建具有所有需要验证的信息域
    this.addFields(this.opts.fields);

    // 有 form 表单的验证
    if (this.opts.formName) {
      // 获取表单对象
      this.form = document.forms[this.opts.formName];
      // 添加 novalidate
      this.form.setAttribute('novalidate', 'novalidate');
      // 绑定表单事件
      this.addFormEvent();
      // 绑定提交事件
      this.handleOnSubmit();
    }
    return this;
  }

  /**
   * 验证整体表单域
   * @param  {Event} evt 当前事件
   * @return {Boolean} 是否成功
   */
  validate(evt) {
    this.handles.evt = getCurrentEvent(evt);
    let isSuccess = true;

    Object.keys(this.fields).forEach((name) => {
      // 通过 name 验证
      if (!this.validateByName(name)) {
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
  validateByName(name) {
    const field = this.fields[name];
    let isSuccess = true;

    // 单个验证没找到规则
    if (!field) {
      return !isSuccess;
    }

    // 获取验证的 DOM 节点数组
    const elArray = this.handleGetArrayByName(field.name);

    // 表单 name 属性相同且不是 radio、checkbox、select 的表单域
    if (isSameNameField(elArray)) {
      elArray.forEach((item) => {
        // 当前验证的 field 对象
        // 默认设置 el 为数组对象
        field.el = [item];
        if (!this.assembleValidateField(field)) {
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
  assembleValidateField(field) {
    // 初始化
    assembleField(field);
    // 验证
    const { result, error } = this.validateByField(field);
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
  preventSubmit() {
    const evt = this.handles.evt;

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
  addFields(fields) {
    if (typeof fields === 'object') {
      // 构建具有所有需要验证的信息域
      Object.keys(fields).forEach((name) => {
        // 构建单个需要验证的信息域
        this.fields[name] = {
          ...fields[name],
          name,
          ...fieldOtherInitProps,
        };
      });
    }
    return this;
  }

  /**
   * 动态移除 fields 方法
   * @param {string} names 名称
   */
  removeFields(...names) {
    names.forEach((name) => {
      // 移除域和错误类
      delete this.fields[name];
      delete this.errors[name];
    });
    return this;
  }

  /**
   * 绑定 submit 按钮提交事件
   */
  handleOnSubmit() {
    const thatOnSubmit = this.form.onsubmit;
    this.form.onsubmit = (that => (e) => {
      try {
        const evt = getCurrentEvent(e);
        return that.validate(evt) && (thatOnSubmit === undefined || thatOnSubmit());
      } catch (ex) {
        return null;
      }
    })(this);
  }

  /**
   * 将 nodeList 转换为 Array 统一验证
   * @param {String} name 节点
   * @return {Array}
   */
  handleGetArrayByName(name) {
    // field element
    const el = this.form[name];
    const result = [];

    // 如果节点对象不存在或长度为零
    if (!el || el.length === 0) {
      return result;
    }

    // 将节点转换为数组
    const elLength = el.length;

    // 排除 select， select 为数组形式
    if (elLength && !isSelect(el)) {
      for (let i = 0; i < elLength; i += 1) {
        result.push(el[i]);
      }
    } else {
      result.push(el);
    }
    return result;
  }
}
