import { get, post, del, ResponseData } from '@/utils/request';
import { CommonQueryProps } from './types';
// /api/admin/node

export interface GetTagsParams extends CommonQueryProps {
  id?: number;
  status?: number;
}
export interface TagItem {
  id?: number;
  name: string;
  description?: string;
  status?: number;
  createTime: string;
  updateTime: string;
}

export interface TagLiteItem {
  tagId?: number;
  tagName?: string;
}

const tagBaseUrl = '/api/admin/tag';
/**
 * 获取节点列表
 * */
export const getTagList = <T extends any>(data?: GetTagsParams) =>
  get<ResponseData<T>>(`${tagBaseUrl}/list`, { params: data });

//  创建节点
export const createTag = <T extends any>(data: TagItem) => post<ResponseData<T>>(`${tagBaseUrl}/create`, data);

//  创建节点
export const updateTag = <T extends any>(data: TagItem) => post<ResponseData<T>>(`${tagBaseUrl}/update`, data);

//  自动完成
export interface AutoParams {
  keyword?: string;
}
export const autocompleteTag = <T extends any>(params: AutoParams) =>
  get<ResponseData<T>>(`${tagBaseUrl}/autocomplete`, { params });

//  批量获取
// export interface PatchParams {
//   tagIds?: number[] | string;
// }
export const getTagsByIds = (params: string) => get<ResponseData<TagLiteItem[]>>(`${tagBaseUrl}/tags?${params}`);

/**
 * 禁用、启用
 * @param { number } id - ID
 * */
export const banTag = <T extends any>(id: number) => post<ResponseData<T>>(`${tagBaseUrl}/ban/${id}`);

/**
 * 删除单个
 * @param { number } id - ID
 * */
export const delTag = <T extends any>(id: number) => del<ResponseData<T>>(`${tagBaseUrl}/${id}`);

/**
 * 删除多个
 * @param { number } ids - ID
 * */
export const delTagList = <T extends any>(ids: number[]) =>
  del<ResponseData<T>>(`${tagBaseUrl}/del?id=${ids.join('&id=')}`);
