import { get, post, del, ResponseData, ResponsePageResult } from '@/utils/request';
import { CommonQueryProps } from './types';

export interface QueryParams extends CommonQueryProps {}

export interface SiteNoticeItem {
  id?: number;
  title: string;
  content?: string;
  createTime?: string;
  updateTime?: string;
}

const baseUrl = '/api/admin/content/notice';
/**
 * 获取列表
 * */
export const getList = (data?: QueryParams) =>
  get<ResponseData<ResponsePageResult<SiteNoticeItem>>>(baseUrl, { params: data });

/**
 * 添加/修改公告
 * @param data
 * @param {string} data.title - 标题
 * @param {string} data.content - 地址
 * @returns
 */

export const create = <T extends any>(data: SiteNoticeItem) => post<ResponseData<T>>(baseUrl, data);
export const update = <T extends any>({ id, ...data }: SiteNoticeItem) =>
  post<ResponseData<T>>(`${baseUrl}/${id}`, data);

// 删除
export const delOne = <T extends any>(id: number) => del<ResponseData<T>>(`${baseUrl}/${id}`);

/**
 * 删除多个
 * @param {Array} id - 多个id
 * @returns
 */
export const delMany = <T extends any>(id: number[]) => del<ResponseData<T>>(`${baseUrl}/list`, { data: { id } });
