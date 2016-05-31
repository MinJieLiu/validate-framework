var expect = chai.expect;
var assert = chai.assert;

var v = new Validator();

describe("validators", function() {

    it("required() 必填验证", function() {
        expect(v.required('')).to.be.false;
        expect(v.required(' ')).to.be.true;
        expect(v.required('null')).to.be.true;
        expect(v.required('ss')).to.be.true;
    });

    it("isUrl() URL 验证", function() {
        expect(v.isUrl('://www.ss')).to.be.false;
        expect(v.isUrl('www.baidu.com')).to.be.false;
        expect(v.isUrl('abs.abs.baidu.com')).to.be.false;
        expect(v.isUrl('http://baidu.com')).to.be.true;
        expect(v.isUrl('http:/abs.abs.baidu.com')).to.be.false;
        expect(v.isUrl('http://abs.abs.baidu.com')).to.be.true;
        expect(v.isUrl('hps://www.baidu.com')).to.be.true;
    });

    it("isEmail() 邮箱验证", function() {
        expect(v.isEmail('d.s.s.d@qq.com.cn')).to.be.true;
        expect(v.isEmail('d.s-s.d@qq.com.cn')).to.be.true;
        expect(v.isEmail('d.s.s.d@qq.cosdfaasdfasdfdsaf.cn.sh.sd.dsfsdfsfd')).to.be.true;
        expect(v.isEmail('ds.sd@qq.com')).to.be.true;
        expect(v.isEmail('dss1234.sd@qq.com')).to.be.true;
        expect(v.isEmail('ds.sd@qq.com.cn')).to.be.true;
        expect(v.isEmail('wowohoo@qq.com')).to.be.true;
        expect(v.isEmail('wowo.o@qq.com')).to.be.true;
        expect(v.isEmail('wowo@123.sd')).to.be.true;
        expect(v.isEmail('wowo@123.23')).to.be.true;
        expect(v.isEmail('wowo.oqqcom')).to.be.false;
        expect(v.isEmail('wowo@123')).to.be.false;
        expect(v.isEmail('wowo@asdf.中国')).to.be.false;
        expect(v.isEmail('wowo@中国.com')).to.be.false;
        expect(v.isEmail('中@qq.com')).to.be.false;

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

    // * 13段：130、131、132、133、134、135、136、137、138、139
    // * 14段：145、147
    // * 15段：150、151、152、153、155、156、157、158、159
    // * 17段：170、176、177、178
    // * 18段：180、181、182、183、184、185、186、187、188、189
    // * 国际码 如：中国(+86)
    it("isPhone() 手机号码验证", function() {
        expect(v.isPhone('13688889890')).to.be.true;
        expect(v.isPhone('13012341233')).to.be.true;
        expect(v.isPhone('+8613688889890')).to.be.true;
        expect(v.isPhone('+23613688889890')).to.be.true;
        expect(v.isPhone('19088889890')).to.be.false;
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

});