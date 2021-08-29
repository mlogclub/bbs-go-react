// /content/friendlink
import { get, post, ResponseData } from '@/utils/request';
import { CommonQueryProps } from './types';

export interface GetListParams extends CommonQueryProps {
  title?: string;
}
export interface FriendLinkItem {
  id?: number;
  title: string;
  status?: number;
  url?: string;
  logo?: string;
  createTime?: string;
  updateTime?: string;
}

const baseUrl = '/api/admin/link';
/**
 * 获取列表
 * */
export const getList = <T extends any>(data?: GetListParams) => post<ResponseData<T>>(`${baseUrl}/list`, data);

/**
 * 添加友链/修改友链
 * @param data
 * @param {string} data.id - ID
 * @param {string} data.title - 标题
 * @param {string} data.url - 地址
 * @param {string} data.logo - logo
 * @param {string} data.summary - 描述
 * @returns
 */

export const create = <T extends any>(data: FriendLinkItem) => post<ResponseData<T>>(`${baseUrl}/create`, data);
export const update = <T extends any>(data: FriendLinkItem) => post<ResponseData<T>>(`${baseUrl}/update`, data);

// 抓取 Detect
export const detect = <T extends any>(url: string) => get<ResponseData<T>>(`${baseUrl}/detect`, { params: { url } });

// // 删除
// export const delOne = <T extends any>(id: number) => del<ResponseData<T>>(`${baseUrl}/${id}`);

// /**
//  * 删除多个
//  * @param {Array} id - 多个id
//  * @returns
//  */
// export const delMany = <T extends any>(id: number[]) => del<ResponseData<T>>(`${baseUrl}/list`, { data: { id } });
