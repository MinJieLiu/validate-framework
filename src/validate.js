import testHook from './testHook';

/**
 * 验证核心方法，不依赖对象实例
 */
const validate = {
  ...testHook,
};

/**
 * 通过 field 验证
 * @param  {Object} field 验证信息域
 * @return {Object} 包含结果、错误信息
 */
validate.validateByField = (field) => {
  const thatField = field;
  // 成功标识
  let isSuccess = true;
  let error;

  const isRequired = thatField.rules.indexOf('required') !== -1;
  const isEmpty = thatField.value === undefined || thatField.value === '' || thatField.value === null;

  const rules = thatField.rules.split(/\s*\|\s*/g);

  for (let i = 0, ruleLength = rules.length; i < ruleLength; i++) {
    // 逐条验证，如果已经验证失败，则不需要进入当前条目再次验证
    if (!isSuccess) {
      break;
    }

    // 转换如：maxLength(12) => ['maxLength', 12]
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
    if (typeof validate[method] === 'function') {
      if (!validate[method].apply(null, [thatField, param])) {
        isSuccess = false;
      }
    }

    // 错误信息域
    error = {
      id: thatField.id,
      name: thatField.name,
      value: thatField.value,
      rule: method,
    };

    // 解析错误信息
    if (!isSuccess) {
      // 错误提示
      error.message = (function message() {
        const seqText = thatField.messages ? thatField.messages.split(/\s*\|\s*/g)[i] : '';

        // 替换 {{value}} 和 {{param}} 为指定值
        return seqText
          ? seqText.replace(/\{\{\s*value\s*}}/g, thatField.value).replace(/\{\{\s*param\s*}}/g, param)
          : seqText;
      }());
    }
  }

  return {
    result: isSuccess,
    error,
  };
};

/**
 * 通过 fields 验证
 * @param {Object} fields 验证信息域集合
 * @param {Object} body 数据集合
 * @return {Object} results 结果列表
 */
validate.validateByFields = (fields, body) => {
  const results = {};
  for (const name in fields) {
    const field = fields[name];
    field.name = name;
    field.value = body[name];
    results[name] = validate.validateByField(field);
  }
  return results;
};

export default validate;
