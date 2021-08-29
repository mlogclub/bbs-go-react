import md5 from 'md5';
import { PassSalt } from './constant';

// 获取url的参数
export const query = (key: string, url?: string): string | undefined => {
  var searchParams = new URLSearchParams(url || window.location.search);
  return searchParams.get(key) || void 0;
};

// 移除空属性
export const removeEmpty = (obj: any, deep?: boolean) => {
  let result = Object.entries(obj).filter(([_, v]) => v != null && v !== '');
  if (deep) {
    result = result.map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v]);
  }
  return Object.fromEntries(result);
};

// 随机字符串
export const randomString = () => Math.random().toString(36).substring(2);

// 密码md5
export const encrypPass = (pass: string): string => md5(pass + PassSalt);

// 复制对象，删除指定字段
export function omit(obj: any, fields?: string[]) {
  // eslint-disable-next-line prefer-object-spread
  const shallowCopy = Object.assign({}, obj);
  if (!fields) {
    return shallowCopy;
  }
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

// file tobase64
export const fileToBase64 = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = error => reject(error);
  });
};

//
export const jsonToForm = data => {
  let formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return formData;
};
