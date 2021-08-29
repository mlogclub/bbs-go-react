import { useEffect, useState } from 'react';
import { Table, Form, Button, Input, Select, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import qs from 'querystring';
import { Link } from 'react-router-dom';
import { removeEmpty } from '@/utils/util';
import { formatTime } from '@/utils/form';
import { PageSize, tablePageConfig } from '@/utils/table';
import { getUserScore, GetScoreParams } from '@/services/userScore';
import { redirectToPath } from '@/utils/history';

export interface NodeItem {
  id: number;
  user: any;
  score: number;
  type: number;
  sourceType: string;
  sourceId: number;
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
  const [params, setParams] = useState<GetScoreParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [form] = Form.useForm();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: GetScoreParams, redirect: boolean = true) => {
    if (redirect) {
      redirectToPath(location, params);
    }
    setLoading(true);
    setParams(params);
    getUserScore<ListResponse>(params)
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
      width: 100,
    },
    {
      title: '用户',
      dataIndex: 'user',
      render: val => <Link to={`/authmanage/user/detail/${val.id}`}>{val.nickname}</Link>,
    },
    {
      title: '得分',
      dataIndex: 'score',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: val => (val === 0 ? '增加' : '减少'),
    },
    {
      title: '来源',
      dataIndex: 'sourceType',
    },
    {
      title: '来源ID',
      dataIndex: 'sourceId',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 220,
      render: val => formatTime(val),
    },
  ];

  // 搜索
  const handleSearch = res => {
    res = removeEmpty(res);
    setParams(res);
    if (res.date) {
      res.date = res.date.format('YYYY-MM-DD');
    }
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
    getListData({ limit: pageSize, ...params }, false);
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
              <Form.Item label="来源" name="sourceType">
                <Input allowClear placeholder="来源" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="来源ID" name="sourceId">
                <Input allowClear placeholder="来源ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="类型" name="type">
                <Select allowClear>
                  <Select.Option value={0}>加分</Select.Option>
                  <Select.Option value={1}>减分</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="search-btn-group">
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button htmlType="button" onClick={handleResetFrom}>
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
