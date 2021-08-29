import { useEffect, useState } from 'react';
import { Form, Button, Input, Select, Row, Col, message, Modal, Avatar, List, Pagination, Tag, Divider } from 'antd';
import { useLocation } from 'react-router-dom';
import cls from 'classnames';
import qs from 'querystring';
import { removeEmpty } from '@/utils/util';
import { formatTime } from '@/utils/form';
import { PageSize, tablePageConfig } from '@/utils/table';
import {
  getTopicList,
  recommendTopic,
  cancleRecommendTopic,
  GetTopicParams,
  TopicItem,
  deleteTopic,
  unDeleteTopic,
} from '@/services/topic';
import DangerTag, { SuccessTag } from '@/components/antd/dangerTag';
import { redirectToPath } from '@/utils/history';
import { ResponseListResult } from '@/utils/request';
import { Link } from 'react-router-dom';
import css from './topic.module.scss';

const Page = () => {
  const [listData, setListData] = useState<TopicItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<GetTopicParams>();
  const [pageSize, setPageSize] = useState<number>(PageSize);
  const [form] = Form.useForm();
  const location = useLocation();

  // 获取列表数据
  const getListData = (params?: GetTopicParams, redirect = true) => {
    if (redirect) {
      redirectToPath(location, params);
    }
    setLoading(true);
    setParams(params);
    getTopicList<ResponseListResult<TopicItem>>(params)
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

  // 禁用、启用
  const handleBan = item => {
    const handleSucc = res => {
      const { success, message: msg } = res.data;
      if (success) {
        message.success({ content: '操作成功' });
        getListData(params);
      } else {
        message.error({ content: msg });
      }
    };
    Modal.confirm({
      content: `确定要${item.status === 1 ? '恢复' : '删除'}？`,
      onOk: () => {
        if (item.status === 1) {
          unDeleteTopic(item.topicId!).then(handleSucc);
        } else {
          deleteTopic(item.topicId!).then(handleSucc);
        }
      },
    });
  };

  // 推荐
  const handleRecommend = (item: TopicItem) => {
    let req;
    if (item.recommend) {
      req = cancleRecommendTopic(item.topicId!);
    } else {
      req = recommendTopic(item.topicId!);
    }
    req.then(res => {
      const { success, message: msg } = res.data;
      if (success) {
        getListData(params);
      } else {
        message.error({ content: msg });
      }
    });
  };

  // 预览图片
  const handlePreview = url => {
    Modal.info({
      icon: null,
      content: <img src={url} alt="" style={{ maxWidth: '100%' }} />,
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
              <Form.Item label="ID" name="id">
                <Input allowClear placeholder="ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="用户ID" name="userId">
                <Input allowClear placeholder="用户ID" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="标题" name="title">
                <Input allowClear placeholder="标题" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="是否推荐" name="recommend">
                <Select placeholder="推荐状态" allowClear>
                  <Select.Option value="1">推荐</Select.Option>
                  <Select.Option value="0">未推荐</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="状态" allowClear>
                  <Select.Option value="0">正常</Select.Option>
                  <Select.Option value="1">已删除</Select.Option>
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
        <List
          itemLayout="vertical"
          loading={loading}
          dataSource={listData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.user?.avatar ? (
                    <Avatar src={item.user?.avatar} />
                  ) : (
                    <Avatar style={{ backgroundColor: '#87d068' }}>{item.user?.nickname.charAt(0)}</Avatar>
                  )
                }
                description={
                  <div>
                    <h3 className={css.topicTitle}>
                      <Link to={`/authmanage/user/detail/${item.user?.id}`}>
                        {item.user?.nickname}
                        <span className={css.topicUserId}>(UserId: {item.user?.id})</span>
                      </Link>
                      {item.status === 1 && <DangerTag>已删除</DangerTag>}
                      {item.recommend ? <SuccessTag>已推荐</SuccessTag> : null}
                    </h3>
                    <p className={css.topicMetaInfo}>
                      <span>ID: {item.topicId}</span>
                      <Divider type="vertical" />
                      <span>发布时间：{formatTime(item.createTime)}</span>
                      <Divider type="vertical" />
                      <span>
                        {item.node?.logo ? <img src={item.node?.logo} width={20} height={20} alt="" /> : null}
                        {item.node?.name}
                      </span>
                      <Divider type="vertical" />
                      <span>
                        {item.tags?.map(ele => (
                          <Tag color="#108ee9" key={ele.tagId}>
                            {ele.tagName}
                          </Tag>
                        ))}
                      </span>
                    </p>
                  </div>
                }
              />
              <div style={{ paddingLeft: 48 }}>
                {item.type === 0 ? (
                  <div>
                    <h3>{item.title}</h3>
                    <div>{item.summary}</div>
                  </div>
                ) : (
                  item.content
                )}
                <section className={css.topicImgs}>
                  {item.imageList?.map(ele => (
                    <img src={ele.url} alt="" onClick={handlePreview.bind(null, ele.url)} />
                  ))}
                </section>
                <section className={cls(css.topicToolBtns, 'pt-15')}>
                  <Button onClick={() => handleRecommend(item)}>{item.recommend ? '取消推荐' : '推荐'}</Button>

                  <Button danger onClick={() => handleBan(item)}>
                    {item.status !== 1 ? '删除' : '取消删除'}
                  </Button>
                </section>
              </div>
            </List.Item>
          )}
        ></List>

        <div style={{ textAlign: 'right' }} className="pt-20">
          <Pagination {...pageConfig} />
        </div>
      </div>
    </div>
  );
};

export default Page;
