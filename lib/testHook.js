'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regex = require('./regex');

var _regex2 = _interopRequireDefault(_regex);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 验证方法类
 */
var testHook = {

  // 验证自然数
  isNumeric: function isNumeric(field) {
    return _regex2.default.numeric.test((0, _util.getValue)(field));
  },


  // 验证整数
  isInteger: function isInteger(field) {
    return _regex2.default.integer.test((0, _util.getValue)(field));
  },


  // 验证浮点数
  isDecimal: function isDecimal(field) {
    return _regex2.default.decimal.test((0, _util.getValue)(field));
  },


  // 验证邮箱
  isEmail: function isEmail(field) {
    return _regex2.default.email.test((0, _util.getValue)(field));
  },


  // 验证 IP 地址
  isIp: function isIp(field) {
    return _regex2.default.ip.test((0, _util.getValue)(field));
  },


  // 验证座机
  isTel: function isTel(field) {
    return _regex2.default.tel.test((0, _util.getValue)(field));
  },


  // 验证手机
  isPhone: function isPhone(field) {
    return _regex2.default.phone.test((0, _util.getValue)(field));
  },


  // 验证字母数字下划线
  isAbc: function isAbc(field) {
    return _regex2.default.abc.test((0, _util.getValue)(field));
  },


  // 验证URL
  isUrl: function isUrl(field) {
    return _regex2.default.url.test((0, _util.getValue)(field));
  },


  // 验证日期
  isDate: function isDate(field) {
    // 解析日期
    var thatDate = (0, _util.getValue)(field);
    if (_regex2.default.date.test(thatDate)) {
      thatDate = thatDate.split('-');
      var year = parseInt(thatDate[0], 10);
      var month = parseInt(thatDate[1], 10);
      var day = parseInt(thatDate[2], 10);

      if (year < 1 || year > 9999 || month < 1 || month > 12) {
        return false;
      }

      var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      // 闰年2月29号
      if (year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
        numDays[1] = 29;
      }

      // 检查日期
      return !(day < 1 || day > numDays[month - 1]);
    }
    return false;
  },


  // 是否为必填
  required: function required(field) {
    if ((0, _util.isRadioOrCheckbox)(field)) {
      return field.checked === true;
    }
    return (0, _util.getValue)(field) !== null && (0, _util.getValue)(field) !== '';
  },


  // 多于 某个数
  greaterThan: function greaterThan(field, param) {
    var value = (0, _util.getValue)(field);
    if (!_regex2.default.decimal.test(value)) {
      return false;
    }
    return parseFloat(value) > parseFloat(param);
  },


  // 少于 某个数
  lessThan: function lessThan(field, param) {
    var value = (0, _util.getValue)(field);
    if (!_regex2.default.decimal.test(value)) {
      return false;
    }
    return parseFloat(value) < parseFloat(param);
  },


  // 最大长度
  maxLength: function maxLength(field, length) {
    if (!_regex2.default.integer.test(length)) {
      return false;
    }
    return (0, _util.getValue)(field).length <= parseInt(length, 10);
  },


  // 最小长度
  minLength: function minLength(field, length) {
    if (!_regex2.default.integer.test(length)) {
      return false;
    }
    return (0, _util.getValue)(field).length >= parseInt(length, 10);
  },


  // 大于某个日期
  greaterThanDate: function greaterThanDate(field, date) {
    var currentDate = (0, _util.parseToDate)((0, _util.getValue)(field));
    var paramDate = (0, _util.parseToDate)(date);

    if (!paramDate || !currentDate) {
      return false;
    }
    return currentDate > paramDate;
  },


  // 小于某个日期
  lessThanDate: function lessThanDate(field, date) {
    var currentDate = (0, _util.parseToDate)((0, _util.getValue)(field));
    var paramDate = (0, _util.parseToDate)(date);

    if (!paramDate || !currentDate) {
      return false;
    }
    return currentDate < paramDate;
  }
};

exports.default = testHook;
module.exports = exports['default'];