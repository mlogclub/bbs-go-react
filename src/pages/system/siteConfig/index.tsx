import { Card, Button, Row, Col, Tooltip, Tag, Modal, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import cls from 'classnames';
import { EditOutlined } from '@ant-design/icons';
import {
  SysConfigSiteTitle,
  SysConfigSiteDescription,
  SysConfigSiteKeywords,
  SysConfigSiteNavs,
  SysConfigRecommendTags,
  SysConfigUrlRedirect,
  SysConfigScoreConfig,
  SysConfigDefaultNodeId,
  SysConfigArticlePending,
  SysConfigTopicCaptcha,
  SysConfigUserObserveSeconds,
  SysConfigTokenExpireDays,
  SysConfigLoginMode,
  SysConfigSiteNotice,
  SysConfigCreateTopicEmailVerified,
  SysConfigCreateArticleEmailVerified,
  SysConfigCreateCommentEmailVerified,
} from '@/utils/constant';

import css from './index.module.scss';
import { UserConfig, UseNodes } from './util';
import { useEffect, useState } from 'react';

const BlueTag = props => <Tag color="#1890ff">{props.children}</Tag>;

const renderLoginModels = obj => {
  return obj ? (
    <>
      {obj.password ? <BlueTag>账号密码</BlueTag> : <Tag>账号密码</Tag>}
      {obj.qq ? <BlueTag>QQ</BlueTag> : <Tag>QQ</Tag>}
      {obj.github ? <BlueTag>Github</BlueTag> : <Tag>Github</Tag>}
      {obj.osc ? <BlueTag>OSC</BlueTag> : <Tag>OSC</Tag>}
    </>
  ) : null;
};

const Page = () => {
  const [noticeForm] = Form.useForm();
  const [noticeVisble, setVisible] = useState<boolean>(false);
  const [data, save, loading] = UserConfig();
  const [nodeList] = UseNodes();
  const layoutSize = {
    xl: 8,
    lg: 12,
    sm: 24,
  };

  const { config: configData, tags } = data;

  const getDefaultNode = id => {
    if (!nodeList) {
      return '';
    }
    return nodeList.find(ele => ele.id === id);
  };

  const defaultNode = getDefaultNode(configData?.[SysConfigDefaultNodeId]);

  const getTag = id => {
    return tags?.filter(ele => ele.tagId === parseInt(id))[0]?.tagName;
  };

  useEffect(() => {
    if (noticeVisble) {
      noticeForm.setFieldsValue(configData);
    }
  }, [noticeVisble]);

  if (!configData) {
    return null;
  }

  return (
    <div className="page-post-from">
      <div className="ant-alert ant-alert-warning ant-alert-with-description ant-alert-no-icon mb-20">
        <div className="ant-alert-content">
          <div className="ant-alert-message">网站公告</div>
          <div
            className={cls('ant-alert-description', css.notice)}
            dangerouslySetInnerHTML={{ __html: configData[SysConfigSiteNotice] }}
          ></div>
        </div>
        <div className="ant-alert-action">
          <Button size="small" type="primary" onClick={() => setVisible(true)}>
            修改
          </Button>
        </div>
      </div>
      <Row gutter={24}>
        <Col {...layoutSize}>
          <Card
            title="通用配置"
            size="small"
            hoverable
            bordered={false}
            extra={
              <Tooltip title="编辑">
                <Link to="/site/config/common">
                  <Button size="small" type="text" icon={<EditOutlined />} />
                </Link>
              </Tooltip>
            }
            className={css.configCard}
            loading={loading}
          >
            <section className={cls('hidden-one', css.configItem)}>
              网站标题：<span>{configData[SysConfigSiteTitle]}</span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              网站描述：<span>{configData[SysConfigSiteDescription]}</span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              网站关键字：<span>{configData[SysConfigSiteKeywords]}</span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              推荐标签：
              <span>
                {configData[SysConfigRecommendTags].map(ele => (
                  <Tag key={ele}>{getTag(ele) || ele}</Tag>
                ))}
              </span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              默认节点：<span>{defaultNode && <Tag>{defaultNode.name}</Tag>}</span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              直链跳转：
              <span>{configData[SysConfigUrlRedirect] ? '是' : '否'}</span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              登录方式：
              <span>{renderLoginModels(configData[SysConfigLoginMode])}</span>
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              登录有效期：
              <span>{configData[SysConfigTokenExpireDays]}天</span>
            </section>
          </Card>
        </Col>
        <Col {...layoutSize}>
          <Card
            title="积分设置"
            size="small"
            hoverable
            bordered={false}
            extra={
              <Tooltip title="编辑">
                <Link to="/site/config/score">
                  <Button size="small" type="text" icon={<EditOutlined />} />
                </Link>
              </Tooltip>
            }
            className={css.configCard}
            loading={loading}
          >
            <section className={cls('hidden-one', css.configItem)}>
              发帖得积分：{configData[SysConfigScoreConfig]?.postTopicScore}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              跟帖得积分: {configData[SysConfigScoreConfig]?.postCommentScore}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              签到得积分：{configData[SysConfigScoreConfig]?.checkInScore}
            </section>
          </Card>
        </Col>

        <Col {...layoutSize}>
          <Card
            title="反作弊配置"
            size="small"
            hoverable
            bordered={false}
            extra={
              <Tooltip title="编辑">
                <Link to="/site/config/publish">
                  <Button size="small" type="text" icon={<EditOutlined />} />
                </Link>
              </Tooltip>
            }
            className={css.configCard}
            loading={loading}
          >
            {/* SysConfigTopicCaptcha */}
            <section className={cls('hidden-one', css.configItem)}>
              发帖验证码：{configData[SysConfigTopicCaptcha] ? '是' : '否'}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              邮箱验证后发帖：{configData[SysConfigCreateTopicEmailVerified] ? '是' : '否'}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              邮箱验证后发表文章：{configData[SysConfigCreateArticleEmailVerified] ? '是' : '否'}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              邮箱验证后评论：{configData[SysConfigCreateCommentEmailVerified] ? '是' : '否'}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              发表文章审核：{configData[SysConfigArticlePending] ? '是' : '否'}
            </section>
            <section className={cls('hidden-one', css.configItem)}>
              用户观察期(秒)：{configData[SysConfigUserObserveSeconds]}
            </section>
          </Card>
        </Col>
        {/* 导航菜单*/}
        <Col {...layoutSize}>
          <Card
            title="导航菜单"
            size="small"
            hoverable
            bordered={false}
            extra={
              <Tooltip title="编辑">
                <Link to="/site/config/nav">
                  <Button size="small" type="text" icon={<EditOutlined />} />
                </Link>
              </Tooltip>
            }
            className={css.configCard}
            loading={loading}
          >
            {configData[SysConfigSiteNavs]?.map(ele => (
              <p key={ele.url}>
                <a href={ele.url}>
                  {ele.title}({ele.url})
                </a>
              </p>
            ))}
          </Card>
        </Col>
      </Row>
      {/* 修改公告 */}
      <Modal
        visible={noticeVisble}
        width={600}
        onOk={() => {
          noticeForm.validateFields().then(data => {
            save(data, () => {
              setVisible(false);
            });
          });
        }}
        title="网站公告"
        onCancel={() => setVisible(false)}
      >
        <Form form={noticeForm}>
          <Form.Item name={SysConfigSiteNotice}>
            <Input.TextArea placeholder="支持HTML" rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;
