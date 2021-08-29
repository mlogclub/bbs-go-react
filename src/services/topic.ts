import { get, post, del, ResponseData } from '@/utils/request';
import { CommonQueryProps } from './types';
import { UserItem } from './authManage';

export interface GetTopicParams extends CommonQueryProps {
  userId?: number;
  status?: number;
  recommend?: number;
}

type TopicNode = {
  description: string;
  logo: string;
  name: string;
  nodeId: number;
};

type TopicTag = {
  id: number;
  tagId: number;
  tagName: string;
};

type TopicImage = {
  url: string;
  preview: string;
};

export interface TopicItem {
  id?: number;
  name: string;
  commentCount?: number;
  content?: string;
  likeCount?: number;
  imageList?: TopicImage[];
  liked?: boolean;
  status?: number;
  createTime: string;
  updateTime: string;
  lastCommentTime?: number;
  recommend?: boolean;
  recommendTime?: number;
  summary: string;
  tags?: TopicTag[];
  title?: string;
  topicId?: number;
  type?: number;
  viewCount?: number;
  node?: TopicNode;
  user?: UserItem;
}

const topicBaseUrl = '/api/admin/topic';
/**
 * 获取节点列表
 * */
export const getTopicList = <T extends any>(data?: GetTopicParams) =>
  get<ResponseData<T>>(`${topicBaseUrl}/list`, { params: data });

/**
 * 获取节点
 * */
export const getTopicDetail = <T extends any>(id: number) => get<ResponseData<T>>(`${topicBaseUrl}/${id}`);

// 创建节点
export const createTopic = <T extends any>(data: TopicItem) => post<ResponseData<T>>(`${topicBaseUrl}/create`, data);

// 创建节点
export const updateTopic = <T extends any>(data: TopicItem) => post<ResponseData<T>>(`${topicBaseUrl}/update`, data);

// 推荐
export const recommendTopic = <T extends any>(id: number) => post<ResponseData<T>>(`${topicBaseUrl}/recommend`, { id });

// 取消推荐
export const cancleRecommendTopic = <T extends any>(id: number) =>
  del<ResponseData<T>>(`${topicBaseUrl}/recommend`, { params: { id } });

// 删除
export const deleteTopic = <T extends any>(id: number) => post<ResponseData<T>>(`${topicBaseUrl}/delete`, { id });

// 删除
export const unDeleteTopic = <T extends any>(id: number) => post<ResponseData<T>>(`${topicBaseUrl}/undelete`, { id });
