import { Form, Button, Input, Select, Row, Col, List, Avatar, Pagination, Modal, message, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import cls from 'classnames';
import { getList, delComment, CommentItem, CommentsListParams } from '@/services/comment';
import DangerTag, { WarnTag } from '@/components/antd/dangerTag';
import { removeEmpty } from '@/utils/util';
import { formatTime, initSearchQuery } from '@/utils/form';
import { PageSize, tablePageConfig } from '@/utils/table';
import { ResponseListResult } from '@/utils/request';
import { redirectToPath } from '@/utils/history';

const Page = () => {
  const [listData, setListData] = useState<CommentItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<CommentsListParams>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [form] = Form.useForm();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: CommentsListParams, redirec: boolean = true) => {
    if (redirec) {
      redirectToPath(location, params);
    }
    setLoading(true);
    setParams(params);
    getList<ResponseListResult<CommentItem>>(params)
      .then(res => {
        const { success, data } = res.data;
        if (success) {
          setListData(data?.results);
          setTotal(data?.page.total);
          setPage(data?.page.page || 1);
          setPageSize(data?.page.limit || PageSize);
        }
      })
      .finally(() => setLoading(false));
  };

  // 删除
  const handleDel = item => {
    Modal.confirm({
      content: '确定要删除评论?',
      onOk: () => {
        delComment(item.id).then(res => {
          const { success, message: msg } = res.data;
          if (success) {
            getListData(params, false);
          } else {
            message.error({ content: msg });
          }
        });
      },
    });
  };

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

  const pageConfig = Object.assign({}, tablePageConfig, {
    onChange: handleChangePage,
    total,
    current: page,
    pageSize,
    showTotal: total => `总共${total}条记录`,
  });

  useEffect(() => {
    const params = initSearchQuery();
    form.setFieldsValue(params);
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
              <Form.Item label="用户ID" name="userID">
                <Input allowClear placeholder="用户ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="评论对象" name="entityType">
                <Select placeholder="评论对象" allowClear>
                  <Select.Option value="topic">话题</Select.Option>
                  <Select.Option value="article">文章</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="评论对象ID" name="entityId">
                <Input allowClear placeholder="评论对象ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="状态" allowClear>
                  <Select.Option value="0">正常</Select.Option>
                  <Select.Option value="1">删除</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} className="search-btn-group">
              <Form.Item label=" " style={{ width: '100%' }} colon={false}>
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
        <List itemLayout="vertical" loading={loading}>
          {listData?.map(ele => (
            <List.Item key={ele.id}>
              <List.Item.Meta
                avatar={<Avatar src={ele.user.avatar} />}
                title={
                  <div className="flex-ac">
                    <Link to={`/authmanage/user/detail/${ele.user.id}`}>{ele.user.nickname}</Link>
                    <Divider type="vertical" />
                    {ele.user.status === 1 && <DangerTag>已删除</DangerTag>}
                    {ele.user.forbidden && <WarnTag>被禁言</WarnTag>}
                    {ele.status === 1 ? (
                      <DangerTag style={{ marginLeft: 'auto' }}>已删除</DangerTag>
                    ) : (
                      <Button danger size="small" style={{ marginLeft: 'auto' }} onClick={handleDel.bind(null, ele)}>
                        删除
                      </Button>
                    )}
                  </div>
                }
                description={
                  <span>
                    <span style={{ fontWeight: 'bold' }}>{ele.id}</span>
                    <Divider type="vertical" />
                    {formatTime(ele.createTime)}
                    <Divider type="vertical" />
                    {ele.entityType === 'article' && (
                      <Link className="fake-link" to={`/content/article/${ele.entityId}`}>
                        文章:{ele.entityId}
                      </Link>
                    )}
                    <span>{ele.entityType === 'topic' && `话题,ID:${ele.entityId}`}</span>
                  </span>
                }
              />
              <div style={{ paddingLeft: 48 }}>{ele.content}</div>
            </List.Item>
          ))}
        </List>
        {total > 0 && (
          <div className="mt-20" style={{ textAlign: 'right' }}>
            <Pagination {...pageConfig}></Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
