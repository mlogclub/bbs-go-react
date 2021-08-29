import { get, ResponseData } from '@/utils/request';

// 获取系统信息
export const getSystemInfo = <T extends any>() => get<ResponseData<T>>('/api/admin/common/systeminfo');
