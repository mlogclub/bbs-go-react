import { get, ResponseData } from '@/utils/request';

/**
 * 获取网站配置
 * */
export interface GetSiteConfigParams {
  page?: number;
  limit?: number;
}

export const getSiteConfig = <T extends any>(params?: GetSiteConfigParams) =>
  get<ResponseData<T>>('/api/admin/config', { params });

/**
 * 初始化配置文件
 * */
export const initSiteConfig = <T extends any>() => get<ResponseData<T>>('/api/admin/config/init');
