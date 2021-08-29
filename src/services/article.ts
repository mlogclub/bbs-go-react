import { get, put, post, ResponseData } from '@/utils/request';
import { UserItem } from './authManage';
import { CommonQueryProps } from './types';

const baseUrl = '/api/admin/article';

export type ArticleTag = {
  tagId: number;
  tagName: string;
};

export type ArticleItem = {
  id: number;
  title: string;
  share: boolean;
  sourceUrl: string;
  status: number;
  summary: string;
  content?: string;
  contentType: string;
  updateTime: number;
  user?: UserItem;
  tags?: ArticleTag[];
  userId: number;
  viewCount: number;
  createTime: number;
};

export interface GetArticlesParams extends CommonQueryProps {
  id?: number;
  userId?: number;
  title?: string;
  status?: number;
}
// 获取文章列表
export const getList = <T extends any>(data?: GetArticlesParams) => post<ResponseData<T>>(`${baseUrl}/list`, data);

// 获取文章
export const getDetail = <T extends any>(id: number | string) => get<ResponseData<T>>(`${baseUrl}/${id}`);

// 最新20条文章
export const getLatest = <T extends any>(data?: GetArticlesParams) => get<ResponseData<T>>(`${baseUrl}/recent`);

// 删除
export const delArticle = <T extends any>(id: number) => post<ResponseData<T>>(`${baseUrl}/delete`, { id });

// 审核
export const auditArticle = <T extends any>(id: number) => post<ResponseData<T>>(`${baseUrl}/pending`, { id });

// 修改标签
export interface PutArticleTagParams {
  articleId: number;
  tags?: string[];
}
export const updateArticleTag = <T extends any>(data?: PutArticleTagParams) =>
  put<ResponseData<T>>(`${baseUrl}/tags`, data);
