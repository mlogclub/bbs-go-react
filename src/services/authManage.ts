import { get, post, ResponseData } from '@/utils/request';

export interface UserItem {
  avatar: string;
  backgroundImage: string;
  commentCount: number;
  createTime: number;
  description: string;
  email: string;
  emailVerified: boolean;
  forbidden: boolean;
  forbiddenEndTime: number;
  homePage: string;
  id: number;
  nickname: string;
  password: string;
  roles: string[];
  score: number;
  status: number;
  topicCount: number;
  type: number;
  updateTime: number;
  username: string;
}

/**
 * 获取用户列表
 * @param { Object } params
 * @param { string } params.id - ID
 * @param { string } params.username - 账号
 * @param { string } params.nickname - 昵称
 * @param { number } params.page - 页码
 * @param { number } params.limit - 分页大小
 * @returns
 */
export interface GetUsersParams {
  id?: number;
  username?: string;
  nickname?: string;
  page?: number;
  limit?: number;
}

export const getUsers = <T extends any>(params?: GetUsersParams) =>
  get<ResponseData<T>>('/api/admin/user/list', { params });

/**
 * 检测用户名是否存在
 * @param { Object } params
 * @param { string } params.name - 账号
 * @param { number } params.id - 排除的id
 */
export interface GetUserByNameParams {
  name?: string;
  id?: string;
}
export const getUserByName = <T extends any>(params?: GetUserByNameParams) =>
  get<ResponseData<T>>('/api/admin/user/exist', { params });

/**
 * 创建用户
 * @param { Object } data
 * @param { string } data.name - 账号
 */
export interface PostUserData {
  id?: number;
  username: string;
  nickname: string;
  email?: string;
  password?: string;
  roles?: string[];
}
export const createUser = <T extends any>(data: any) => post<ResponseData<T>>('/api/admin/user/create', data);
export const updateUser = <T extends any>(data: any) => post<ResponseData<T>>(`/api/admin/user/update`, data);
//
/**
 *
 * @param param
 * @returns
 */
export interface GetUseDetailParams {
  id?: number | string;
}
export const getUserDetail = <T extends any>({ id }: GetUseDetailParams) =>
  get<ResponseData<T>>(`/api/admin/user/${id}`);

/**
 * 重置密码
 * @param { Object } data
 * @param { Array } data.ids - 账号ID
 * @param { string } data.password - 密码
 * @returns
 */
export const resetPassword = <T extends any>(data) => post<ResponseData<T>>(`/api/admin/user/pass`, data);

/**
 * 禁言
 * @param { Object } data
 * @param { Array } data.userId - 账号ID
 * @param { string } data.days - 时长
 * @param { string } data.reason - 原因
 * @returns
 */
export const forbiddenUser = <T extends any>(data) => post<ResponseData<T>>(`/api/admin/user/forbidden`, data);

// 第三方账号
export const getThirdAccounts = <T extends any>(params?: GetUsersParams) =>
  get<ResponseData<T>>('/api/admin/third-account/list', { params });
