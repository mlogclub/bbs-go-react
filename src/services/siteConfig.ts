import { get, post, ResponseData, ResponseListResult } from '@/utils/request';
import { CommonQueryProps } from './types';
const baseUrl = '/api/admin/sys-config';

export type ConfigItem = {
  [key: string]: any;
};

/**
 * 获取网站配置
 * */
export interface GetSiteConfigParams extends CommonQueryProps {}
export const getConfig = <T extends any>(params?: GetSiteConfigParams) =>
  post<ResponseListResult<T>>(`${baseUrl}/list`, { params });

/**
 * 获取所有配置
 * @param params
 * @returns
 */
export const getAllConfig = <T extends any>() => get<ResponseData<T>>(`${baseUrl}/all`);

export const initConfig = <T extends any>() => get<ResponseData<T>>(`${baseUrl}/all`);

// 保存配置
export interface SaveConfig {
  config?: string;
}
export const saveConfig = <T extends any>(data: SaveConfig) => post<ResponseData<T>>(`${baseUrl}/save`, data);
