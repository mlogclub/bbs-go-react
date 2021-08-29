import { get, ResponseData } from '@/utils/request';

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
export interface GetScoreParams {
  user_id?: number;
  source_type?: string;
  source_id?: number;
  type?: string;
  page?: number;
  limit?: number;
}

export const getUserScore = <T extends any>(params?: GetScoreParams) =>
  get<ResponseData<T>>('/api/admin/user-score-log/list', { params });
