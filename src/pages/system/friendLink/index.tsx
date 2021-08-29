import { useEffect, useState } from 'react';
import { Table, Form, Button, Input, Row, Col, message, Modal, Popconfirm } from 'antd';
import { useLocation } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import qs from 'querystring';
import { PlusOutlined } from '@ant-design/icons';
import { removeEmpty } from '@/utils/util';
import { formatTime } from '@/utils/form';
import { PageSize } from '@/utils/table';
import { tablePageConfig } from '@/utils/table';
import { getList, FriendLinkItem, GetListParams, update } from '@/services/friendlink';
import PostModal from '@/components/content/friendLinkModal';
import { ResponseListResult } from '@/utils/request';
import { redirectToPath } from '@/utils/history';

const Page = () => {
  const [listData, setListData] = useState<FriendLinkItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<GetListParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [visible, setModalVisible] = useState<boolean>(false);
  const [tmpItem, setTmpItem] = useState<FriendLinkItem | null>();
  const [form] = Form.useForm();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: GetListParams, redirect = true) => {
    if (redirect) {
      redirectToPath(location, params);
    }
    setLoading(true);
    setParams(params);
    getList<ResponseListResult<FriendLinkItem>>(params)
      .then(res => {
        const { success, data } = res.data;
        if (success && data) {
          setListData(data?.results);
          setTotal(data?.page.total);
          setPage(data?.page.limit);
          setPageSize(data?.page.limit || PageSize);
        }
      })
      .finally(() => setLoading(false));
  };

  // 编辑
  const handleEdit = (item: FriendLinkItem) => {
    setTmpItem(item);
    setModalVisible(true);
  };

  // 删除
  const handleDelItem = (item: FriendLinkItem) => {
    const data = { ...item };
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    update(data).then(res => {
      const { success, message: msg } = res.data;
      if (!success) {
        message.error({ content: msg });
      } else {
        getListData(params);
      }
    });
  };

  const handleViewLogo = val => {
    Modal.info({
      icon: null,
      width: 600,
      content: <img src={val} style={{ maxWidth: '100%' }} alt=""></img>,
    });
  };
  const columns: ColumnProps<FriendLinkItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '网址',
      dataIndex: 'url',
    },
    {
      title: '描述',
      dataIndex: 'summary',
      width: 300,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      render: val =>
        val ? (
          <img src={val} alt="" style={{ maxWidth: 100, maxHeight: 30 }} onClick={handleViewLogo.bind(null, val)}></img>
        ) : (
          ''
        ),
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
      render: val => (val === 0 ? '正常' : '删除'),
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
            <Popconfirm title={`确定要${item.status === 0 ? '删除' : '恢复'}`} onConfirm={() => handleDelItem(item)}>
              {item.status === 0 ? (
                <Button type="link" danger size="small">
                  删除
                </Button>
              ) : (
                <Button size="small" type="link">
                  恢复
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
    getListData({ ...res, page: 1 });
  };

  const handleChangePage = (page, size) => {
    getListData({ ...params, page, limit: size });
  };

  const handleSaveSuccess = () => {
    setModalVisible(false);
    setTmpItem(null);
    getListData({ ...params }, false);
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
              <Form.Item label="名称" name="title">
                <Input allowClear placeholder="网站名称" />
              </Form.Item>
            </Col>
            <Col span={6} className="search-btn-group">
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
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

        <Table<FriendLinkItem>
          size="middle"
          columns={columns}
          dataSource={listData}
          rowKey="id"
          pagination={pageConfig}
          loading={loading}
        ></Table>
      </div>
      <PostModal
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
