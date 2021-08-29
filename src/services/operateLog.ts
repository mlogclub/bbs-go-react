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
export interface GetLogsParams {
  id?: number;
  page?: number;
  limit?: number;
}

export const getLogs = <T extends any>(params?: GetLogsParams) =>
  get<ResponseData<T>>('/api/admin/operate-log/list', { params });

export const getLogDetail = <T extends any>({ id }: { id: number }) =>
  get<ResponseData<T>>(`/api/admin/operate-log/${id}`);
