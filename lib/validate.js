'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _testHook = require('./testHook');

var _testHook2 = _interopRequireDefault(_testHook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 验证核心方法，不依赖对象实例
 */
var validate = _extends({}, _testHook2.default);

/**
 * 通过 field 验证
 * @param  {Object} field 验证信息域
 * @return {Object} 包含结果、错误信息
 */
validate.validateByField = function (field) {
  var thatField = field;
  // 成功标识
  var isSuccess = true;
  var error = void 0;

  var isRequired = thatField.rules.indexOf('required') !== -1;
  var isEmpty = thatField.value === undefined || thatField.value === '' || thatField.value === null;

  var rules = thatField.rules.split(/\s*\|\s*/g);

  var _loop = function _loop(i, ruleLength) {
    // 逐条验证，如果已经验证失败，则不需要进入当前条目再次验证
    if (!isSuccess) {
      return 'break';
    }

    // 转换如：maxLength(12) => ['maxLength', 12]
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
      rule: method
    };

    // 解析错误信息
    if (!isSuccess) {
      // 错误提示
      error.message = function message() {
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

  return {
    result: isSuccess,
    error: error
  };
};

/**
 * 通过 fields 验证
 * @param {Object} fields 验证信息域集合
 * @param {Object} body 数据集合
 * @return {Object} results 结果列表
 */
validate.validateByFields = function (fields, body) {
  var results = null;
  for (var name in fields) {
    var field = fields[name];
    field.name = name;
    field.value = body[name];
    results[name] = validate.validateByField(field);
  }
  return results;
};

exports.default = validate;
module.exports = exports['default'];