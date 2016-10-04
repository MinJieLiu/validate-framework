/**
 * 判断 field 是否为字符串
 * @param {Object} field 验证域
 * @return {String} 返回值
 */
function getValue(field) {
  return (typeof field === 'string') ? field : field.value;
}

/**
 * 对象继承
 * @param {Object} target
 * @param {Object} source
 * @return {Object} target
 */
function extend(target, source) {
  for (const key in source) {
    target[key] = source[key];
  }
  return target;
}

/**
 * 设置除主属性的验证域为默认值
 * @param field
 */
function initField(field) {
  field.id = null;
  field.el = null;
  field.type = null;
  field.value = null;
  field.checked = null;
}

/**
 * 转换为日期
 * @param {String} param 日期格式：yyyy-MM-dd
 * @return {Date}
 */
function parseToDate(param) {
  const thatDate = new Date();
  const dateArray = param.split('-');

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
  return isBrowser() ? (evt || window.event) : null;
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
    for (let i = 0, elLength = elArray.length; i < elLength; i++) {
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
  return el.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
}

/**
 * 添加 class
 * @param {Element} el
 * @param {String} cls 类名
 */
function addClass(el, cls) {
  if (!hasClass(el, cls)) {
    el.classList ? el.classList.add(cls) : el.className += ` ${cls}`;
  }
}

/**
 * 移除 class
 * @param {Element} el
 * @param {String} cls 类名
 */
function removeClass(el, cls) {
  if (hasClass(el, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
    el.classList ? el.classList.remove(cls) : el.className = el.className.replace(reg, ' ');
  }
}

export {
  getValue,
  extend,
  initField,
  parseToDate,
  isBrowser,
  getCurrentEvent,
  isRadioOrCheckbox,
  isSelect,
  isSameNameField,
  getElementsByName,
  attributeValue,
  addClass,
  removeClass,
};
