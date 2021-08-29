import { useEffect, useState } from 'react';
import { Table, Form, Button, Input, Row, Col, message, Popconfirm, Modal } from 'antd';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import { useLocation } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { GetUsersParams } from '@/services/authManage';
import { removeEmpty } from '@/utils/util';
import { getNodeList, updateNode, NodeItem } from '@/services/topicNode';
import TopicNodeModal from '@/components/content/topicNodeModal';
import { PageSize, formatTime } from '@/utils/form';
import GreenButton from '@/components/antd/GreenButton';
import DangerTag from '@/components/antd/dangerTag';
import { ResponseListResult } from '@/utils/request';
import { redirectToPath } from '@/utils/history';
import { initSearchQuery } from '@/utils/form';
import { tablePageConfig } from '@/utils/table';

const Page = () => {
  const [listData, setListData] = useState<NodeItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<GetUsersParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [visible, setModalVisible] = useState<boolean>(false);
  const [tmpNode, setTmpNode] = useState<NodeItem | null>();
  const [form] = Form.useForm();

  const location = useLocation();
  // 获取列表数据
  const getListData = (params?: GetUsersParams, redirect: boolean = true) => {
    setLoading(true);
    if (redirect) {
      redirectToPath(location, params);
    }
    setParams(params);
    getNodeList<ResponseListResult<NodeItem>>(params)
      .then(res => {
        const { success, data, message: msg } = res.data;
        if (success) {
          setListData(data?.results);
          setTotal(data?.page.total);
          setPage(data?.page.page || 1);
          setPageSize(data?.page.limit || PageSize);
        } else {
          message.error({ content: msg });
        }
      })
      .finally(() => setLoading(false));
  };

  // 编辑
  const handleEdit = item => {
    setTmpNode(item);
    setModalVisible(true);
  };

  // 禁用、启用
  const handleBanNode = (item: NodeItem) => {
    if (item.status === 1) {
      item.status = 0;
    } else {
      item.status = 1;
    }
    updateNode(item).then(res => {
      const { success, message: msg } = res.data;
      if (success) {
        message.success({ content: '操作成功' });
        getListData(params);
      } else {
        message.error({ content: msg });
      }
    });
  };

  const handleViewLogo = url => {
    Modal.info({
      icon: null,
      content: <img src={url} style={{ maxWidth: '100%' }} alt="" />,
    });
  };
  useEffect(() => {
    const params = initSearchQuery();
    setParams(params);
    getListData(params, false);
  }, []);

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
      title: '图标',
      dataIndex: 'logo',
      render: val =>
        val ? <img src={val} width="30" height="30" alt="logo" onClick={() => handleViewLogo(val)}></img> : null,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
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
            <Popconfirm title={`确定要${item.status === 0 ? '禁用' : '启用'}`} onConfirm={() => handleBanNode(item)}>
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

  const handleSearch = res => {
    res = removeEmpty(res);
    setParams(res);
    if (res.date) {
      res.date = res.date.format('YYYY-MM-DD');
    }
    getListData({ ...res, page: 1 });
  };

  const handleChangePage = (page, size) => {
    setPage(page);
    if (size !== pageSize) {
      getListData({ ...params, page: 1, limit: size });
    } else {
      getListData({ ...params, page });
    }
  };

  const handleSaveSuccess = () => {
    setModalVisible(false);
    getListData({ ...params });
  };

  return (
    <div className="pgae-search">
      <div className={cls('search-from page-card-wrap')} style={{ paddingBottom: 0 }}>
        <Form form={form} onFinish={handleSearch} labelCol={{ span: 6 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="名称" name="name">
                <Input allowClear placeholder="名称" />
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

        <Table<NodeItem>
          size="middle"
          columns={columns}
          dataSource={listData}
          rowKey="id"
          pagination={{
            ...tablePageConfig,
            onChange: handleChangePage,
            total,
            current: page,
            pageSize,
          }}
          loading={loading}
        ></Table>
      </div>
      <TopicNodeModal
        visible={visible}
        onSuccess={handleSaveSuccess}
        onCancel={() => {
          setModalVisible(false);
          setTmpNode(null);
        }}
        editData={tmpNode}
      />
    </div>
  );
};

export default Page;
