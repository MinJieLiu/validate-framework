import testHook from 'validate-framework-utils/lib/testHook';
import { isRadioOrCheckbox } from './util';

// 合并条件
Object.assign(testHook, {
  // 是否为必须
  required(field) {
    if (typeof field === 'string') {
      return field !== '';
    } else if (Array.isArray(field.value)) {
      return field.value.length;
    } else if (isRadioOrCheckbox(field)) {
      return (field.checked === true);
    }
    return field.value !== null && field.value !== '';
  },
});

export default testHook;
