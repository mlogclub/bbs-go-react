import { get, post, ResponseData } from '@/utils/request';
import { CommonQueryProps } from './types';

const baseUrl = '/api/admin/topic-node';

export interface NodeItem {
  id?: number;
  name: string;
  description?: string;
  logo?: string;
  sortNo?: number;
  status?: number;
}

/**
 * 获取节点列表
 * */
export interface GetNodeListParams extends CommonQueryProps {}

export const getNodeList = <T extends any>(data?: GetNodeListParams) => post<ResponseData<T>>(`${baseUrl}/list`, data);

// 创建节点
export const createNode = <T extends any>(data: NodeItem) => post<ResponseData<T>>(`${baseUrl}/create`, data);

// 更新节点
export const updateNode = <T extends any>(data: NodeItem) => post<ResponseData<T>>(`${baseUrl}/update`, data);

// 获取所有状态正常节点
export const getOkNodes = () => get<ResponseData<NodeItem[]>>(`${baseUrl}/nodes`);

// api/admin/topic-node/nodes
