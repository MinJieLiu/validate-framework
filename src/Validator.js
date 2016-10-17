import {
  extend,
  initField,
  isBrowser,
  getCurrentEvent,
  isSelect,
  isSameNameField,
  getElementsByName,
  attributeValue,
} from './util';
import testHook from './testHook';

/**
 * 核心验证组件，不包括事件及 dom 操作
 */
export default class Validate {

  constructor(options) {
    // 绑定验证方法
    for (const key in testHook) {
      this[key] = testHook[key];
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
      eventLevel: 'all',
    };

    // 替换默认参数
    this.opts = extend(this._default, options);
    this.form = {};
    this.bodyData = options.bodyData;
    this.errors = {};
    this.fields = {};
    this.handles = {};

    // 构建具有所有需要验证的信息域
    this.addFields(this.opts.fields);

    // 有 form 表单的验证
    if (isBrowser() && this.opts.formName) {
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
  validate(evt) {
    this.handles.evt = getCurrentEvent(evt);
    let isSuccess = true;
    const fields = this.fields;

    for (const name in fields) {
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
  validateByName(name) {
    const field = this.fields[name];
    let isSuccess = false;

    // 单个验证没找到规则
    if (!field) {
      return isSuccess;
    }

    // 获取验证的 DOM 节点数组
    const el = this._getArrayByName(field.name);

    // 表单 name 属性相同且不是 radio、checkbox、select 的表单域
    if (isSameNameField(el)) {
      // 默认通过验证，若有一个错误，则不通过
      let isMultiSuccess = true;
      for (let i = 0, elLength = el.length; i < elLength; i++) {
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
   * 扩展校验方法
   * @param {String} name 校验名称
   * @param {Function} method 校验方法
   */
  addMethod(name, method) {
    if (typeof method === 'function') {
      // 绑定验证方法
      testHook[name] = method;

      // 绑定至对象
      this[name] = method;
    }

    return this;
  }

  /**
   * 动态添加 fields 方法
   * @param {Object} fields 对象
   */
  addFields(fields) {
    if (typeof fields === 'object') {
      // 构建具有所有需要验证的信息域
      for (const name in fields) {
        let field = fields[name];

        // 规则正确，则进行
        if (field.rules) {
          // 初始化 其他属性
          field.name = name;
          field = initField(field);

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
  removeFields(fieldNames) {
    if (fieldNames instanceof Array) {
      for (let i = 0, namesLength = fieldNames.length; i < namesLength; i++) {
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
  _onSubmit() {
    const thatOnSubmit = this.form.onsubmit;
    this.form.onsubmit = (function (that) {
      return function (e) {
        try {
          const evt = getCurrentEvent(e);
          return that.validate(evt) && (thatOnSubmit === undefined || thatOnSubmit());
        } catch (ex) {
          return null;
        }
      };
    }(this));
  }

  /**
   * 验证当前节点
   * @param  {Object} field 验证信息域
   * @return {Boolean} 是否成功
   */
  _validateField(field) {
    let thatField = field;
    // 成功标识
    let isSuccess = true;
    // 错误对象
    this.errors = this.errors || {};

    // 更新验证域
    thatField = this._updateField(thatField);

    const isRequired = thatField.rules.indexOf('required') !== -1;
    const isEmpty = thatField.value === undefined || thatField.value === '' || thatField.value === null;

    const rules = thatField.rules.split(/\s*\|\s*/g);

    for (let i = 0, ruleLength = rules.length; i < ruleLength; i++) {
      // 逐条验证，如果已经验证失败，则暂时不需要进入当前条目再次验证
      if (!isSuccess) {
        break;
      }

      // 转换：max_length(12) => ['max_length', 12]
      let method = rules[i];
      const parts = /^(.+?)\((.+)\)$/.exec(method);
      let param = '';

      // 解析带参数的验证如 max_length(12)
      if (parts) {
        method = parts[1];
        param = parts[2];
      }

      // 如果不是 required 这个字段，该值是空的，则不验证，继续下一个规则。
      if (!isRequired && isEmpty) {
        continue;
      }

      // 匹配验证
      if (typeof testHook[method] === 'function') {
        if (!testHook[method].apply(this, [thatField, param])) {
          isSuccess = false;
        }
      }

      // 错误信息域
      this.errors[thatField.name] = {
        el: thatField.el,
        id: thatField.id,
        name: thatField.name,
        rule: method,
      };

      // 解析错误信息
      if (!isSuccess) {
        // 错误提示
        this.errors[thatField.name].message = (function message() {
          const seqText = thatField.messages ? thatField.messages.split(/\s*\|\s*/g)[i] : '';

          // 替换 {{value}} 和 {{param}} 为指定值
          return seqText ? seqText.replace(/\{\{\s*value\s*}}/g, thatField.value).replace(/\{\{\s*param\s*}}/g, param) : seqText;
        }());
      }
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
  _updateField(field) {
    let thatField = field;
    // 数据验证模式
    if (this.bodyData) {
      thatField.value = this.bodyData[thatField.name];
      return thatField;
    }

    // 设置验证信息域属性
    const el = thatField.el;
    if (el) {
      thatField.id = el[0].id;
      thatField.type = el[0].type;
      thatField.value = attributeValue(el, 'value');
      thatField.checked = attributeValue(el, 'checked');
    } else {
      // 动态删除表单域之后清空对象值
      thatField = initField(field);
    }
    return thatField;
  }

  /**
   * 获取 nodeList 转换为 Array 统一验证，并避免 IE 序列化崩溃 BUG
   * @param {String} name 节点
   */
  _getArrayByName(name) {
    // 仅浏览器环境
    if (isBrowser()) {
      let elObj;

      // 若有 form 存在定位更精确
      if (this.opts.formName) {
        elObj = this.form[name];
      } else {
        elObj = getElementsByName(name);
      }

      // 如果节点对象不存在或长度为零
      if (!elObj || elObj.length === 0) {
        return null;
      }

      // 将节点转换为数组
      const arr = [];
      const elLength = elObj.length;

      // 排除 select， select 为数组形式
      if (elLength && !isSelect(elObj)) {
        for (let i = 0; i < elLength; i++) {
          arr.push(elObj[i]);
        }
      } else {
        arr.push(elObj);
      }
      return arr;
    }
    return null;
  }
}
