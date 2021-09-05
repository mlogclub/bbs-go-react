import { get, post } from '@/utils/request';

// 登录
export const login = (data?: any) => post('/api/login/signin', data);

/**
 * 注册
 * @param { Object } data
 * @param { string } data.username - 用户名/账号
 * @param { string } data.email - email
 * @param { string } data.phone - 电话
 * @param { string } data.password - 密码
 * @param { string } data.nickname - 昵称
 * @param { string } data.captchaId - 验证码id
 * @param { string } data.captchaCode - 验证码
 * @param { numver } data.from - 来源
 */
export const register = (data?: any) => post('/api/sign/up', data);

// 退出登录
export const logout = () => get('/api/login/signout');

// 获取当前登录用户
export const getCurrent = () => get('/api/user/current');

// 获取验证码
export const getCaptcha = (data?: any) => get<any>('/api/captcha/request', data);

// github Login
export const githubLoginAuth = (data?: any) => get<any>('/api/github/login/authorize', data);

/**
 * github 登录
 * @param data
 * @param { string }  data.code
 * @param { string }  data.state
 * @returns
 */
export const githubLogin = (data?: any) => get<any>('/api/github/login/callback', { params: data });
