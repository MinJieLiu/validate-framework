var expect = chai.expect;
var assert = chai.assert;

var v = new Validator();

describe("validators", function() {

    it("required() 必填验证", function() {
        expect(v.required('')).to.be.false;
        expect(v.required(' ')).to.be.true;
        expect(v.required('null')).to.be.true;
        expect(v.required('ss')).to.be.true;
        expect(v.required('\s')).to.be.true;
    });

    it("isNumeric() 自然数 验证", function() {
        expect(v.isNumeric('0000+')).to.be.false;
        expect(v.isNumeric('0000')).to.be.true;
        expect(v.isNumeric('1')).to.be.true;
        expect(v.isNumeric('99999')).to.be.true;
        expect(v.isNumeric('0')).to.be.true;
        expect(v.isNumeric('-0')).to.be.false;
        expect(v.isNumeric('-1')).to.be.false;
        expect(v.isNumeric('1.1')).to.be.false;
        expect(v.isNumeric('1.11')).to.be.false;
        expect(v.isDecimal('NaN')).to.be.false;
    });

    it("isInteger() 整数 验证", function() {
        expect(v.isInteger('0000+')).to.be.false;
        expect(v.isInteger('0000')).to.be.true;
        expect(v.isInteger('1')).to.be.true;
        expect(v.isInteger('99999')).to.be.true;
        expect(v.isInteger('0')).to.be.true;
        expect(v.isInteger('-0')).to.be.true;
        expect(v.isInteger('-1')).to.be.true;
        expect(v.isInteger('-1.1')).to.be.false;
        expect(v.isInteger('1.00001')).to.be.false;
        expect(v.isInteger('1.11111')).to.be.false;
        expect(v.isDecimal('NaN')).to.be.false;
    });

    it("isDecimal() 浮点数 验证", function() {
        expect(v.isDecimal('0000+')).to.be.false;
        expect(v.isDecimal('0000')).to.be.true;
        expect(v.isDecimal('1')).to.be.true;
        expect(v.isDecimal('99999')).to.be.true;
        expect(v.isDecimal('0')).to.be.true;
        expect(v.isDecimal('-0')).to.be.true;
        expect(v.isDecimal('-1')).to.be.true;
        expect(v.isDecimal('1.1')).to.be.true;
        expect(v.isDecimal('-1.11')).to.be.true;
        expect(v.isDecimal('-0.11')).to.be.true;
        expect(v.isDecimal('999.999')).to.be.true;
        expect(v.isDecimal('.11')).to.be.true;
        expect(v.isDecimal('0.11')).to.be.true;
        expect(v.isDecimal('+1.11')).to.be.false;
        expect(v.isDecimal('NaN')).to.be.false;
    });

    it("isUrl() URL 验证", function() {
        expect(v.isUrl('://www.ss')).to.be.false;
        expect(v.isUrl('www.baidu.com')).to.be.false;
        expect(v.isUrl('abs.abs.baidu.com')).to.be.false;
        expect(v.isUrl('http://baidu.com')).to.be.true;
        expect(v.isUrl('http:/abs.abs.baidu.com')).to.be.false;
        expect(v.isUrl('http://abs.abs.baidu.com')).to.be.true;
        expect(v.isUrl('hps://www.baidu.com')).to.be.true;
        expect(v.isUrl('hps://www.QQ.com')).to.be.true;
        expect(v.isUrl('hps://www.Tentent.com')).to.be.true;
        expect(v.isUrl('hps://')).to.be.true;
    });

    it("isAbc() 字母数字下划线验证", function() {
        expect(v.isAbc('086-021')).to.be.false;
        expect(v.isAbc('086_021')).to.be.true;
        expect(v.isAbc('abc23')).to.be.true;
        expect(v.isAbc('abc_23')).to.be.true;
        expect(v.isAbc('AbC_')).to.be.true;
        expect(v.isAbc('A!')).to.be.false;
    });

    // 邮箱验证 ，暂不匹配中文域名
    it("isEmail() 邮箱验证", function() {
        expect(v.isEmail('d.s.s.d@qq.com.cn')).to.be.true;
        expect(v.isEmail('d.s-s.d@qq.com.cn')).to.be.true;
        expect(v.isEmail('d.s.s.d@qq.cosdfaasdfasdfdsaf.cn.sh.sd.dsfsdfsfd')).to.be.true;
        expect(v.isEmail('ds.sd@qq.com')).to.be.true;
        expect(v.isEmail('dss1234.sd@qq.com')).to.be.true;
        expect(v.isEmail('ds.sd@qq.com.cn')).to.be.true;
        expect(v.isEmail('@qq.cn')).to.be.false;
        expect(v.isEmail('saf#qq.cn')).to.be.false;
        expect(v.isEmail('wowohoo@qq.com')).to.be.true;
        expect(v.isEmail('wowo.o@qq.com')).to.be.true;
        expect(v.isEmail('wowo@123.sd')).to.be.true;
        expect(v.isEmail('wowo@123.23')).to.be.true;
        expect(v.isEmail('wowo.oqqcom')).to.be.false;
        expect(v.isEmail('wowo@123')).to.be.true;
        expect(v.isEmail('wowo@asdf.中国')).to.be.false;
        expect(v.isEmail('wowo@中国.com')).to.be.false;
        expect(v.isEmail('中@qq.com')).to.be.false;
        expect(v.isEmail('Asd@qq.com')).to.be.true;
        expect(v.isEmail('Asd@QQ.com')).to.be.true;
    });

    it("isIp() IP验证", function() {
        expect(v.isIp('01.01.01.0')).to.be.true;
        expect(v.isIp('192.168.1.1')).to.be.true;
        expect(v.isIp('192.168.23.3')).to.be.true;
        expect(v.isIp('192.168.23.3.32.1')).to.be.true;
        expect(v.isIp('192.168.23.3.32')).to.be.false;
        expect(v.isIp('192.168.23.3.32.1.2')).to.be.false;
        expect(v.isIp('192.168.23.3.32.1.wq2')).to.be.false;
        expect(v.isIp('192.168.2.wq2')).to.be.false;
        expect(v.isIp('192.168.1')).to.be.false;
        expect(v.isIp('192.168')).to.be.false;
        expect(v.isIp('192')).to.be.false;
        expect(v.isIp('192.168.1.1233')).to.be.false;
        expect(v.isIp('192.168.1324.123')).to.be.false;
    });

    it("isPhone() 手机号码验证", function() {
        expect(v.isPhone('136888898')).to.be.false;
        expect(v.isPhone('13688889890')).to.be.true;
        expect(v.isPhone('13012341233')).to.be.true;
        expect(v.isPhone('13688889890')).to.be.true;
        expect(v.isPhone('613688889890')).to.be.false;
        expect(v.isPhone('19088889890')).to.be.true;
    });

    // 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)
    it("isTel() 座机号码验证", function() {
        expect(v.isTel('086-021-4433432-233')).to.be.true;
        expect(v.isTel('+086-021-4433432-233')).to.be.true;
        expect(v.isTel('+086-021-4433432-23')).to.be.false;
        expect(v.isTel('+086-021-4433432-2333')).to.be.true;
        expect(v.isTel('+086-021-4433432-1')).to.be.false;
        expect(v.isTel('13012341233')).to.be.false;
    });

    // 2010-10-10格式
    it("isDate() 日期格式验证", function() {
        expect(v.isDate('2010-10-10')).to.be.true;
        expect(v.isDate('2010-10-1')).to.be.true;
        expect(v.isDate('2010-10')).to.be.false;
        expect(v.isDate('2010-1-10')).to.be.true;
        expect(v.isDate('2010-01-10')).to.be.true;
        expect(v.isDate('2010-03-31')).to.be.true;
        expect(v.isDate('2010-04-30')).to.be.true;
        expect(v.isDate('2010-04-31')).to.be.false;
        expect(v.isDate('2010--31')).to.be.false;
        expect(v.isDate('2010-05-32')).to.be.false;
        expect(v.isDate('2016-02-29')).to.be.true;
        expect(v.isDate('2009-02-29')).to.be.false;
        expect(v.isDate('2009-00-29')).to.be.false;
        expect(v.isDate('0000-01-29')).to.be.false;
        expect(v.isDate('2009-01-00')).to.be.false;
        expect(v.isDate('2010-01-04-31')).to.be.false;
        expect(v.isDate('2010 - 10 - 10')).to.be.false;
        expect(v.isDate('2010-13-10')).to.be.false;
        expect(v.isDate('2010/10/10')).to.be.false;
        expect(v.isDate('2010/10-10')).to.be.false;
        expect(v.isDate('201010-10')).to.be.false;
        expect(v.isDate('20101010')).to.be.false;
        expect(v.isDate('2010')).to.be.false;
    });

    it("greaterThan() 大于某个数", function() {
        expect(v.greaterThan('23', '54')).to.be.false;
        expect(v.greaterThan('23', '11')).to.be.true;
        expect(v.greaterThan('abc', '11')).to.be.false;
        expect(v.greaterThan('-11', '0')).to.be.false;
        expect(v.greaterThan('11', 'abc')).to.be.false;
        expect(v.greaterThan('11', '11')).to.be.false;
    });

    it("lessThan() 小于某个数", function() {
        expect(v.lessThan('23', '54')).to.be.true;
        expect(v.lessThan('55', '54')).to.be.false;
        expect(v.lessThan('abc', '54')).to.be.false;
        expect(v.lessThan('11', '-1')).to.be.false;
        expect(v.lessThan('0', '54')).to.be.true;
        expect(v.lessThan('23', 'abc')).to.be.false;
    });

    it("maxLength() 最大长度", function() {
        expect(v.maxLength('23', '0')).to.be.false;
        expect(v.maxLength('5555555', '7')).to.be.true;
        expect(v.maxLength('abc', '3')).to.be.true;
        expect(v.maxLength('111111', '999')).to.be.true;
        expect(v.maxLength('0', '0')).to.be.false;
        expect(v.maxLength('2 3', '3')).to.be.true;
        expect(v.maxLength('2 3', '2')).to.be.false;
    });

    it("minLength() 最小长度", function() {
        expect(v.minLength('23', '0')).to.be.true;
        expect(v.minLength('55', '1')).to.be.true;
        expect(v.minLength('55', '2')).to.be.true;
        expect(v.minLength('abc', '4')).to.be.false;
        expect(v.minLength('11', '-1')).to.be.true;
        expect(v.minLength('0 0', '54')).to.be.false;
        expect(v.minLength('   ', '3')).to.be.true;
        expect(v.minLength('   ', '4')).to.be.false;
    });

    it("greaterThanDate() 大于某个日期", function() {
        expect(v.greaterThanDate('23', '54')).to.be.false;
        expect(v.greaterThanDate('2010-10-11', '54')).to.be.false;
        expect(v.greaterThanDate('2010-01-01', '2010-01-01')).to.be.false;
        expect(v.greaterThanDate('2010-01-02', '2010-01-01')).to.be.true;
        expect(v.greaterThanDate('2020-01-02', '2010-01-02')).to.be.true;
        expect(v.greaterThanDate('2020-01-02', '2020-11-02')).to.be.false;
        expect(v.greaterThanDate('2020-01-02', '2020-13-02')).to.be.false;
    });

    it("lessThanDate() 小于某个日期", function() {
        expect(v.lessThanDate('23', '54')).to.be.false;
        expect(v.lessThanDate('2010-10-11', '54')).to.be.false;
        expect(v.lessThanDate('2010-01-01', '2010-01-01')).to.be.false;
        expect(v.lessThanDate('2010-01-02', '2010-01-01')).to.be.false;
        expect(v.lessThanDate('2020-01-02', '2010-01-02')).to.be.false;
        expect(v.lessThanDate('2020-01-02', '2020-11-02')).to.be.true;
        expect(v.lessThanDate('2020-01-02', '2020-13-02')).to.be.false;
        expect(v.lessThanDate('2020-21-02', '2022-1-02')).to.be.false;
    });

});