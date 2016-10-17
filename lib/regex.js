"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 正则表达式
 */
var regex = {

  // 自然数
  numeric: /^\d+$/,

  // 整数
  integer: /^-?\d+$/,

  // 浮点数
  decimal: /^-?\d*\.?\d+$/,

  // 邮箱
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,

  // IP 地址 [ip ipv4、ipv6]
  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,

  // 电话号码
  tel: /^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,

  // 手机号码
  phone: /^1[3-9]\d{9}$/,

  // 字母数字或下划线
  abc: /^\w+$/,

  // URL
  url: /[a-zA-Z]+:\/\/[^\s]*/,

  // 日期
  date: /^\d{4}-\d{1,2}-\d{1,2}$/
};

exports.default = regex;
module.exports = exports["default"];