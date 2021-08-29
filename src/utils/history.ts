import H, { createBrowserHistory } from 'history';
import qs from 'querystring';
const history = createBrowserHistory();

export default history;

export const getCurrentPath = () => window.location.href.replace(window.location.origin, '');

export const redirectLoginPath = (loc?: H.Location): H.LocationDescriptor => ({
  pathname: '/login',
  search: '?from=' + encodeURIComponent(getCurrentPath()),
  state: {
    from: loc,
  },
});

// 跳转登录页面
export const redirectLogin = () => {
  history.replace(redirectLoginPath());
};

// 跳转页面，添加参数
export const redirectToPath = (loc: H.Location, params?: any) => {
  history.push({
    ...loc,
    search: params ? qs.stringify(params) : '',
  });
};
