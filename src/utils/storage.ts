import storage from 'localforage';

// export const TokenKey = 'Web-Token';
export const TokenKey = 'X-User-Token';

export const setItem = (key: string, data?: any) => {
  return storage.setItem(key, data);
};

export const removeItem = (key: string) => {
  return storage.removeItem(key);
};

// 本地存储token
export const setToken = (token: string) => {
  localStorage.setItem(TokenKey, token);
};

export const removeToken = () => {
  localStorage.removeItem(TokenKey);
};

export const getToken = () => {
  return localStorage.getItem(TokenKey);
};
