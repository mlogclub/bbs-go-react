import { useEffect, useState } from 'react';
import { Table, Avatar, Form, Button, Input, Popover, Row, Col, Modal } from 'antd';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import { Link } from 'react-router-dom';
import { getUsers, GetUsersParams, UserItem } from '@/services/authManage';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { removeEmpty } from '@/utils/util';
import DangerTag from '@/components/antd/dangerTag';
import ForbiddenModal from './forbiddenModal';
import css from './list.module.scss';

type ListResponse = {
  page: {
    page: number;
    limit: number;
    total: number;
  };
  results?: UserItem[];
};

const Page = () => {
  const [listData, setListData] = useState<UserItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<any>();
  const [previewLogo, setPreviewLogo] = useState<boolean>(false);
  const [previewImg, setPreviewImg] = useState<string>();
  const [forbiddenVisible, setForbiddenVisible] = useState<boolean>();
  const [forbiddenId, setForbiddenId] = useState<number | null>(null);
  const [forbiddenRemove, setForbiddenRemove] = useState<boolean>(false);

  const getListData = (params?: GetUsersParams) => {
    setLoading(true);
    setParams(params);
    getUsers<ListResponse>(params)
      .then(res => {
        const {
          data: { success, data },
        } = res;
        if (success && data) {
          setListData(data.results);
          setTotal(data.page.total);
        }
      })
      .finally(() => setLoading(false));
  };

  // 禁言
  const handleForbidden = (item: UserItem) => {
    setForbiddenVisible(true);
    setForbiddenId(item.id);
    if (item.forbidden) {
      setForbiddenRemove(true);
    }
  };
  useEffect(() => {
    getListData();
  }, []);

  // 更多内容
  const renderPopoverContent = (item: UserItem) => {
    return (
      <div className={css.detailContent}>
        <p>
          <strong>积分：</strong>
          <Link className="fake-link" to={`/authmanage/user-score?userId=${item.id}`}>
            {item.score}
          </Link>
        </p>
        <p>
          <strong>话题数：</strong>
          {item.topicCount}
        </p>
        <p>
          <strong>评论数：</strong>
          {item.commentCount}
        </p>
        <p>
          <strong>主页：</strong>
          {item.homePage}
        </p>
        <p>
          <strong>简介：</strong>
          {item.description}
        </p>
      </div>
    );
  };

  const columns: ColumnProps<UserItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (val, item) =>
        val ? (
          <span
            onClick={() => {
              setPreviewImg(val);
              setPreviewLogo(true);
            }}
          >
            <Avatar src={val} />
          </span>
        ) : (
          <Avatar className={css.userTxtAvatar}>{item.username.charAt(0)}</Avatar>
        ),
    },
    {
      title: '账号',
      dataIndex: 'username',
      render: (val, item) => (
        <Popover content={renderPopoverContent(item)}>
          <Link to={`/authmanage/user/detail/${item.id}`} className="fake-link">
            {val}
          </Link>
        </Popover>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: val => val && val.join('|'),
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '邮箱验证',
      dataIndex: 'emailVerified',
      render: val => (val ? '是' : '否'),
    },
    {
      title: '禁言结束时间',
      dataIndex: 'forbiddenEndTime',
      render: val => {
        if (val === -1) {
          return '永久禁言';
        }
        return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => {
        if (val === 1) {
          return <DangerTag>删除</DangerTag>;
        }
        return '正常';
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      align: 'center',
      render: (val, item) => {
        return (
          <span className="action-btn-group" style={{ justifyContent: 'space-between' }}>
            <Button type="link">
              <Link to={`/authmanage/user/post?id=${item.id}`}>修改</Link>
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleForbidden(item);
              }}
            >
              {item.forbidden ? '取消禁言' : '禁言'}
            </Button>
          </span>
        );
      },
    },
  ];

  const [form] = Form.useForm();

  const handleSearch = res => {
    res = removeEmpty(res);
    getListData({ ...res, page: 1 });
  };

  const handleChangePage = page => {
    setPage(page);
    getListData({ ...params, page });
  };

  const handleResetFrom = () => {
    form.resetFields();
  };

  return (
    <div className="pgae-search">
      <div className={cls('search-from page-card-wrap', css.searchWrap)}>
        <Form form={form} onFinish={handleSearch} labelCol={{ span: 6 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="ID" name="id">
                <Input allowClear placeholder="ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="账号" name="username">
                <Input allowClear placeholder="账号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="昵称" name="nickname">
                <Input allowClear placeholder="昵称" />
              </Form.Item>
            </Col>
            <Col span={6} className="search-btn-group">
              <Form.Item
                label=""
                style={{ width: '100%' }}
                wrapperCol={{
                  offset: 6,
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button htmlType="button" onClick={handleResetFrom}>
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="page-card-wrap">
        <div className="mb-20 search-btn-group fl-ac">
          <Link to="/authmanage/user/post">
            <Button type="primary" icon={<PlusOutlined />}>
              创建
            </Button>
          </Link>
        </div>

        <Table<UserItem>
          size="middle"
          columns={columns}
          dataSource={listData}
          rowKey="id"
          pagination={{
            onChange: handleChangePage,
            total,
            current: page,
            pageSize: 10,
            size: 'default',
          }}
          loading={loading}
        ></Table>
      </div>

      {/* 头像 */}
      <Modal
        visible={previewLogo}
        footer={null}
        onCancel={() => {
          setPreviewLogo(false);
          setPreviewImg('');
        }}
      >
        <p>{previewImg}</p>
        <img src={previewImg} alt="logo" className="max-img" />
      </Modal>

      {/* 禁言 */}
      <ForbiddenModal
        id={forbiddenId}
        remove={forbiddenRemove}
        visible={forbiddenVisible}
        onSuccess={() => {
          getListData(params);
          setForbiddenVisible(false);
          setForbiddenId(null);
          setForbiddenRemove(false);
        }}
        onCancel={() => {
          setForbiddenVisible(false);
          setForbiddenId(null);
          setForbiddenRemove(false);
        }}
      ></ForbiddenModal>
    </div>
  );
};

export default Page;
