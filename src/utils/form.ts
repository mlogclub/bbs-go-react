import moment from 'moment';
import qs, { ParsedUrlQuery } from 'querystring';
import { removeEmpty } from './util';
export interface PostModalProps {
  onSuccess?: () => void;
  onFail?: (err?: unknown) => void;
}

// 默认每页数量
export const PageSize = 10;

//
export const formatDateStr = 'YYYY-MM-DD';
export const formatDateTimeStr = 'YYYY-MM-DD HH:mm:ss';

// 格式化日期
export const formatDate = (val?: any, format?: string) => {
  const mobj = moment(val);
  return mobj.isValid() ? mobj.format(format || formatDateStr) : '';
};

export const formatTime = (val?: any) => formatDate(val, formatDateTimeStr);

// 初始化url参数
export const initSearchQuery = (fields?: string[], needPage = true): ParsedUrlQuery => {
  const search = window.location.search.slice(1);
  const params: any = qs.parse(search);

  if (needPage) {
    params.page = parseInt(params.page) || 1;
    params.limit = parseInt(params.limit) || PageSize;
  }

  if (fields?.length) {
    return fields.reduce((prev: ParsedUrlQuery, cur: string) => {
      prev[cur] = params[cur];
      return prev;
    }, {});
  }
  return removeEmpty(params) as ParsedUrlQuery;
};
