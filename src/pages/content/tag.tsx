import { useEffect, useState } from 'react';
import { Table, Form, Button, Input, Select, Row, Col, message, Popconfirm } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import qs from 'querystring';
import { PlusOutlined } from '@ant-design/icons';
import { removeEmpty } from '@/utils/util';
import { formatTime } from '@/utils/form';
import { PageSize, tablePageConfig } from '@/utils/table';
import { getTagList, GetTagsParams, updateTag } from '@/services/tag';
import TagModal from '@/components/content/tagModal';
import GreenButton from '@/components/antd/GreenButton';
import DangerTag from '@/components/antd/dangerTag';

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
  const [params, setParams] = useState<GetTagsParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [visible, setModalVisible] = useState<boolean>(false);
  const [tmpItem, setTmpItem] = useState<NodeItem | null>();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: GetTagsParams, push: boolean = true) => {
    if (push) {
      history.push({
        pathname: '/content/tag',
        search: '?' + qs.stringify(params as qs.ParsedUrlQuery),
      });
    }
    setLoading(true);
    setParams(params);
    getTagList<ListResponse>(params)
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

  // 编辑
  const handleEdit = item => {
    setTmpItem(item);
    setModalVisible(true);
  };

  // 禁用、启用
  const handleBanItem = item => {
    updateTag({ ...item, status: item.status === 0 ? 1 : 0 }).then(res => {
      const { success, message: msg } = res.data;
      if (success) {
        message.success({ content: '操作成功' });
        getListData(params);
      } else {
        message.error({ content: msg });
      }
    });
  };

  const columns: ColumnProps<NodeItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
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
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: val => (val === 0 ? '正常' : <DangerTag>禁用</DangerTag>),
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 200,
      render: (val, item) => {
        return (
          <span className="table-action-btns">
            <Button type="link" size="small" onClick={() => handleEdit(item)}>
              修改
            </Button>
            <Popconfirm title={`确定要${item.status === 0 ? '禁用' : '启用'}`} onConfirm={() => handleBanItem(item)}>
              {item.status === 1 ? (
                <GreenButton size="small" type="link">
                  启用
                </GreenButton>
              ) : (
                <Button size="small" danger type="link">
                  禁用
                </Button>
              )}
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const handleCreateNode = () => setModalVisible(true);

  // 搜索
  const handleSearch = res => {
    res = removeEmpty(res);
    setParams(res);
    if (res.date) {
      res.date = res.date.format('YYYY-MM-DD');
    }
    getListData({ ...res, page: 1 });
  };

  // 选择列
  const handleSelectRow = ids => {
    // setSelectIds(ids);
  };

  const handleChangePage = (page, size) => {
    getListData({ ...params, page, limit: size });
  };

  const handleSaveSuccess = () => {
    setModalVisible(false);
    setTmpItem(null);
    getListData({ ...params });
  };

  const handleResetFrom = () => {
    form.resetFields();
  };

  const initSearchFrom = () => {
    const search = location.search.slice(1);
    const params: any = qs.parse(search);

    setPageSize(parseInt(params.limit) || PageSize);
    setPageSize(parseInt(params.page) || 1);
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
              <Form.Item label="ID" name="id">
                <Input allowClear placeholder="ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="名称" name="name">
                <Input allowClear placeholder="名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="状态" allowClear>
                  <Select.Option value="0">正常</Select.Option>
                  <Select.Option value="1">禁用</Select.Option>
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
        <div className="mb-20 search-btn-group">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNode}>
            创建
          </Button>
        </div>

        <Table<NodeItem>
          size="middle"
          columns={columns}
          dataSource={listData}
          rowKey="id"
          rowSelection={{
            columnWidth: 60,
            fixed: true,
            onChange: handleSelectRow,
            onSelectAll: () => {},
          }}
          pagination={pageConfig}
          loading={loading}
        ></Table>
      </div>
      <TagModal
        visible={visible}
        onSuccess={handleSaveSuccess}
        onCancel={() => {
          setModalVisible(false);
          setTmpItem(null);
        }}
        editData={tmpItem}
      />
    </div>
  );
};

export default Page;
