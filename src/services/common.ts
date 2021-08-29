import { post, ResponseData } from '@/utils/request';

// 上传文件
export const uploadFile = <T extends any>(data) => post<ResponseData<T>>('/api/upload', data, {});
