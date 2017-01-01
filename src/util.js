/**
 * utils
 */

export { getValue, parseToDate } from 'validate-framework-utils/lib/util';

/**
 * 获取当前事件
 * @param {Event} evt
 * @return {Event}
 */
export function getCurrentEvent(evt) {
  return evt || window.event;
}

/**
 * 判断节点是否为 radio 或者 checkbox
 * @param el
 * @return {Boolean}
 */
export function isRadioOrCheckbox(el) {
  return el.type === 'radio' || el.type === 'checkbox';
}

/**
 * 判断节点是否为 select
 * @param {Element} elArray
 * @return {Boolean}
 */
export function isSelect(elArray) {
  return elArray[0].tagName === 'OPTION';
}

/**
 * 表单 name 属性相同且不是 radio 或 checkbox 的表单域
 * @param elArray 传入节点
 * @return {Boolean}
 */
export function isSameNameField(elArray) {
  return elArray
    && elArray.length
    && !isRadioOrCheckbox(elArray[0])
    && !isSelect(elArray);
}

/**
 * 获取节点对象的属性
 * @param {Object} elArray 传入节点
 * @param {String} attributeName 需要获取的属性
 * @return {String} 属性值
 */
export function attributeValue(elArray, attributeName) {
  if (isRadioOrCheckbox(elArray[0])) {
    for (let i = 0, elLength = elArray.length; i < elLength; i += 1) {
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
  return el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
}

/**
 * 添加 class
 * @param {Element} el
 * @param {String} className
 */
export function addClass(el, className) {
  if (!hasClass(el, className)) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ` ${className}`; // eslint-disable-line no-param-reassign
    }
  }
}

/**
 * 移除 class
 * @param {Element} el
 * @param {String} className
 */
export function removeClass(el, className) {
  if (hasClass(el, className)) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
      el.className = el.className.replace(reg, ' '); // eslint-disable-line no-param-reassign
    }
  }
}

/**
 * 初始化域的其他属性
 */
export const fieldOtherInitProps = {
  id: null,
  el: null,
  type: null,
  value: null,
  checked: null,
};

/**
 * 组装验证域
 * field.el 统一为 Array 对象
 * @param {Object} field
 */
export function assembleField(field) {
  // 设置验证信息域属性
  const el = field.el;
  if (el) {
    Object.assign(field, {
      id: el[0].id,
      type: el[0].type,
      value: attributeValue(el, 'value'),
      checked: attributeValue(el, 'checked'),
    });
  } else {
    // 动态删除表单域之后初始化其他属性
    Object.assign(field, fieldOtherInitProps);
  }
}
