import { get, post, ResponseData } from '@/utils/request';
import { CommonQueryProps } from './types';
import { UserItem } from './authManage';

export interface CommentsListParams extends CommonQueryProps {
  id?: number;
  userId?: number;
  entityType?: string;
  entityId?: number;
  status?: number;
}

export interface CommentItem {
  id: number;
  content: string;
  contentType: string;
  createTime: number;
  entityId: number;
  entityType: string;
  imageList: string[];
  quoteId: number;
  status: number;
  user: UserItem;
}

const baseUrl = '/api/admin/comment';
/**
 * 获取节点列表
 * */
export const getList = <T extends any>(data?: CommentsListParams) =>
  get<ResponseData<T>>(`${baseUrl}/list`, { params: data });

/**
 * 删除单个
 * @param { number } id - ID
 * */
export const delComment = <T extends any>(id: number) => post<ResponseData<T>>(`${baseUrl}/delete/${id}`);
