import { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Button,
  Input,
  Row,
  Col,
  message,
  Popconfirm,
  Select,
  Popover,
  Tag,
  Avatar,
  Dropdown,
  Menu,
  Modal,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { DownOutlined } from '@ant-design/icons';
import cls from 'classnames';
import { useLocation, Link } from 'react-router-dom';
import { getList, getLatest, delArticle, auditArticle, ArticleItem, GetArticlesParams } from '@/services/article';
import { PageSize, formatTime, initSearchQuery } from '@/utils/form';
import GreenButton from '@/components/antd/GreenButton';
import DangerTag, { WarnTag } from '@/components/antd/dangerTag';
import { ResponseListResult } from '@/utils/request';
import { redirectToPath } from '@/utils/history';
import { tablePageConfig } from '@/utils/table';
import ArticleModal from '@/components/content/articleAddTagModal';
import { removeEmpty } from '@/utils/util';

const Page = () => {
  const [listData, setListData] = useState<ArticleItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<GetArticlesParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [visible, setModalVisible] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<ArticleItem>();

  const [form] = Form.useForm();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: GetArticlesParams, redirect: boolean = true) => {
    setLoading(true);
    params = removeEmpty(params);
    if (redirect) {
      redirectToPath(location, params);
    }
    setParams(params);
    getList<ResponseListResult<ArticleItem>>(params)
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

  // 获取最近发布的二十条
  const getRecentList = () => {
    form.resetFields();
    redirectToPath(location, {});
    getLatest<ArticleItem[]>().then(res => {
      const { success, data } = res.data;
      if (success) {
        setListData(data);
        setPageSize(20);
      }
    });
  };

  // 修改标签
  const handleEditTag = item => {
    setEditItem(item);
    setModalVisible(true);
  };

  // 禁用、启用
  const handleBanNode = (item: ArticleItem) => {
    delArticle(item.id).then(res => {
      const { success, message: msg } = res.data;
      if (success) {
        getListData({ ...params });
        setListData(
          listData?.map(ele => {
            if (ele.id === item.id) {
              ele.status = 1;
            }
            return ele;
          }),
        );
      } else {
        message.error({ content: msg });
      }
    });
  };

  // 修改文章
  const handleEdit = () => {
    Modal.info({
      content: '开发中...',
    });
  };

  // 审核
  const handleAudit = item => {
    Modal.confirm({
      content: '审核文章，确定通过？',
      onOk: () => {
        auditArticle(item.id).then(res => {
          const { success, message: msg } = res.data;
          if (success) {
            message.success({ content: '审核成功' });
            // TODO:查询文章
            setListData(
              listData?.map(ele => {
                if (ele.id === item.id) {
                  ele.status = 0;
                }
                return ele;
              }),
            );
          } else {
            message.error({ content: msg });
          }
        });
      },
    });
  };

  const columns: ColumnProps<ArticleItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '作者',
      dataIndex: 'user',
      width: 160,
      render: val =>
        val ? (
          <Popover
            content={
              <div>
                <Avatar src={val.avatar}></Avatar> (用户ID:{val.id})
              </div>
            }
          >
            <Link to={`/authmanage/user/detail/${val.id}`} className="fake-link">
              {val.nickname}
            </Link>
          </Popover>
        ) : null,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 260,
      render: (val, item) => (
        <Popover
          content={
            <div style={{ maxWidth: 400 }}>
              {val}
              <p>浏览量：{item.viewCount}</p>
            </div>
          }
        >
          <div style={{ width: 260 }} className="hidden-one">
            <Link
              to={{
                pathname: `/content/article/${item.id}`,
              }}
              className="fake-link"
            >
              {val}
            </Link>
          </div>
        </Popover>
      ),
    },
    {
      title: '描述',
      dataIndex: 'summary',
      width: 300,
      render: val => (
        <div style={{ width: 300 }} className="hidden-one">
          {val}
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: val => (val ? val.map(ele => <Tag key={ele.tagId}>{ele.tagName}</Tag>) : ''),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      render: val => formatTime(val),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: val => {
        if (val === 0) {
          return '正常';
        }
        if (val === 1) {
          return <DangerTag>已删除</DangerTag>;
        }
        if (val === 2) {
          return <WarnTag>待审核</WarnTag>;
        }
        return '';
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 120,
      render: (val, item) => {
        if (item.status === 1) {
          return (
            <Button type="link" onClick={handleEdit}>
              恢复
            </Button>
          );
        }
        return (
          <span className="table-action-btns">
            <Popconfirm title={`确定要${item.status === 0 ? '禁用' : '启用'}`} onConfirm={() => handleBanNode(item)}>
              {item.status === 1 ? (
                <GreenButton size="small" type="link">
                  启用
                </GreenButton>
              ) : (
                <Button size="small" danger type="link">
                  删除
                </Button>
              )}
            </Popconfirm>
            <Dropdown
              overlay={
                <Menu onClick={() => {}}>
                  <Menu.Item key="1" onClick={handleEditTag.bind(null, item)}>
                    修改标签
                  </Menu.Item>
                  {item.status === 2 && (
                    <>
                      <Menu.Item key="2" onClick={handleEdit}>
                        修改文章
                      </Menu.Item>
                      <Menu.Item key="3" onClick={handleAudit.bind(null, item)}>
                        审核
                      </Menu.Item>
                    </>
                  )}
                </Menu>
              }
            >
              <a className="fake-link">
                更多
                <DownOutlined />
              </a>
            </Dropdown>
          </span>
        );
      },
    },
  ];

  const handleSearch = res => {
    getListData({ ...res, page: 1 });
  };

  const handleChangePage = (page, size) => {
    // 切换分页大小
    if (size !== pageSize) {
      getListData({ ...params, page: 1, limit: size });
    } else {
      getListData({ ...params, page });
    }
  };

  useEffect(() => {
    const params = initSearchQuery();
    if (!params.id && !params.userId) {
      getRecentList();
      return;
    }
    form.setFieldsValue(params);
    getListData(params, false);
  }, []);

  return (
    <div className="pgae-search">
      <div className={cls('search-from page-card-wrap')}>
        <Form form={form} onFinish={handleSearch} labelCol={{ span: 6 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="ID" name="id" required>
                <Input allowClear placeholder="文章ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="用户ID" name="userId" required>
                <Input allowClear placeholder="用户ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="标题" name="title">
                <Input allowClear placeholder="标题" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select allowClear>
                  <Select.Option value={0}>正常</Select.Option>
                  <Select.Option value={1}>删除</Select.Option>
                  <Select.Option value={2}>待审核</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="search-btn-group">
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button type="primary" onClick={getRecentList}>
                最近发布的20篇文章
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="page-card-wrap">
        <Table<ArticleItem>
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

      {/* 弹框 */}
      <ArticleModal
        title="修改标签"
        visible={visible}
        editItem={editItem}
        onSuccess={tags => {
          listData?.map(item => {
            if (item.id === editItem?.id!) {
              item.tags = tags;
            }
            return item;
          });
          setListData(listData?.slice(0));
          setModalVisible(false);
          setEditItem(undefined);
        }}
        onCancel={() => {
          setModalVisible(false);
          setEditItem(undefined);
        }}
      ></ArticleModal>
    </div>
  );
};

export default Page;
