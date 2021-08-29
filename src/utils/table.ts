import { TablePaginationConfig } from 'antd/es/table';

// 每页条数
export const PageSize = 10;

// 默认通用配置项
export const tablePageConfig: TablePaginationConfig = {
  showTotal: total => `总共${total}条记录`,
  size: 'default',
  showSizeChanger: true,
  pageSize: PageSize,
  pageSizeOptions: ['10', '20', '50', '100'],
};
