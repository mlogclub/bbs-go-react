import { useEffect, useState } from 'react';
import { Table, Form, Button, Input, Select, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import qs from 'querystring';
import { removeEmpty } from '@/utils/util';
import { formatTime } from '@/utils/form';
import { PageSize, tablePageConfig } from '@/utils/table';
import { redirectToPath } from '@/utils/history';
import { getLogs, GetLogsParams } from '@/services/operateLog';
import { OpTypeList, OpTypeMaps } from '@/utils/constant';
export interface NodeItem {
  id: number;
  name: string;
  status: number;
  userId: number;
  username: string;
}

type ListResponse = {
  page: {
    page: number;
    limit: number;
    total: number;
  };
  results?: NodeItem[];
};

const Page = () => {
  const [listData, setListData] = useState<NodeItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<GetLogsParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [form] = Form.useForm();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: GetLogsParams) => {
    setLoading(true);
    setParams(params);
    redirectToPath(location, params);
    getLogs<ListResponse>(params)
      .then(res => {
        const { success, data } = res.data;
        if (success && data) {
          setListData(data?.results);
          setTotal(data?.page.total);
          setPage(data?.page.page || 1);
          setPageSize(data?.page.limit || PageSize);
        }
      })
      .finally(() => setLoading(false));
  };

  const columns: ColumnProps<NodeItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '数据ID',
      dataIndex: 'dataId',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
    },
    {
      title: '操作',
      dataIndex: 'opType',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: 'referer',
      dataIndex: 'referer',
    },
    {
      title: 'userAgent',
      dataIndex: 'userAgent',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 220,
      render: val => formatTime(val),
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 80,
      render: (val, item) => {
        return <Button type="link">详情</Button>;
      },
    },
  ];

  // 搜索
  const handleSearch = res => {
    res = removeEmpty(res);
    setParams(res);
    getListData({ ...res, page: 1 });
  };

  const handleChangePage = (page, size) => {
    getListData({ ...params, page, limit: size });
  };

  const handleResetFrom = () => {
    form.resetFields();
  };

  const initSearchFrom = () => {
    const search = location.search.slice(1);
    const params: any = qs.parse(search);
    setPageSize(parseInt(params.limit) || PageSize);
    setPage(parseInt(params.page) || 1);
    form.setFieldsValue(params);
    return params;
  };

  const pageConfig = Object.assign({}, tablePageConfig, {
    onChange: handleChangePage,
    total,
    current: page,
    pageSize,
    showTotal: total => `总共${total}条记录`,
  });

  useEffect(() => {
    const params = initSearchFrom();
    getListData({ limit: pageSize, ...params });
  }, []);

  return (
    <div className="pgae-search">
      <div className={cls('search-from page-card-wrap')}>
        <Form form={form} onFinish={handleSearch} labelCol={{ span: 6 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="用户ID" name="userId">
                <Input allowClear placeholder="用户ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="数据类型" name="dataType">
                <Input allowClear placeholder="数据类型" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="数据ID" name="dataId">
                <Input allowClear placeholder="数据ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="操作类型" name="opType">
                <Select placeholder="状态" allowClear>
                  {OpTypeList.map(ele => (
                    <Select.Option key={ele} value={ele}>
                      {OpTypeMaps[ele]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="search-btn-group">
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button htmlType="button" loading={loading} onClick={handleResetFrom}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="page-card-wrap">
        <Table<NodeItem>
          size="middle"
          columns={columns}
          dataSource={listData}
          rowKey="id"
          pagination={pageConfig}
          loading={loading}
        ></Table>
      </div>
    </div>
  );
};

export default Page;
