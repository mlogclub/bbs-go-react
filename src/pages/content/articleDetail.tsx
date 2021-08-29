import { useEffect, useState } from 'react';
import { Spin, Tooltip, Button, message, Avatar, Tag, Modal, Popover } from 'antd';
import { useParams, useHistory, Link } from 'react-router-dom';
import { getDetail, ArticleItem, delArticle, auditArticle } from '@/services/article';
import { getUserDetail, UserItem } from '@/services/authManage';
import { RollbackOutlined } from '@ant-design/icons';
import { formatTime } from '@/utils/form';
import DangerTag from '@/components/antd/dangerTag';
import cls from 'classnames';
import css from './articleDetail.module.scss';

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<ArticleItem>();
  const [user, setUser] = useState<UserItem>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const getArticle = id => {
    setLoading(true);
    getDetail<ArticleItem>(id)
      .then(res => {
        const { success, data, message: msg } = res.data;
        if (success) {
          setDetail(data);
          getUserInfo(data.userId);
        } else {
          message.error({ content: msg });
        }
      })
      .finally(() => setLoading(false));
  };
  const getUserInfo = id => {
    getUserDetail<UserItem>({ id }).then(res => {
      const { success, data, message: msg } = res.data;
      if (success) {
        setUser(data);
      } else {
        message.error({ content: msg });
      }
    });
  };

  // 删除文章
  const handleDel = () => {
    Modal.confirm({
      content: '确认要删除？',
      onOk: () => {
        delArticle(detail?.id!).then(res => {
          const { success, message: msg } = res.data;
          if (success) {
            message.success({ content: '删除成功' });
            getArticle(detail?.id!);
          } else {
            message.error({ content: msg });
          }
        });
      },
    });
  };

  // 审核
  const handleAudit = () => {
    Modal.confirm({
      content: '确认要审核通过？',
      onOk: () => {
        auditArticle(detail?.id!).then(res => {
          const { success, message: msg } = res.data;
          if (success) {
            message.success({ content: '审核成功' });
            getArticle(detail?.id!);
          } else {
            message.error({ content: msg });
          }
        });
      },
    });
  };

  // 编辑
  const handleEdit = () => {
    message.info({ content: '开发中。。。' });
  };

  useEffect(() => {
    if (id) {
      getArticle(id);
    }
  }, []);

  if (loading) {
    return <Spin></Spin>;
  }
  if (!detail) {
    return null;
  }

  return (
    <div className="page-card-wrap page-post-from">
      <p className="post-header flex-ac">
        <Tooltip title="返回">
          <Button type="text" onClick={() => history.goBack()} icon={<RollbackOutlined />}></Button>
        </Tooltip>

        <span style={{ marginLeft: 'auto' }} className="post-tools">
          {detail.status === 2 && (
            <>
              <Button onClick={handleEdit}>编辑</Button>
              <Button style={{}} className="warn-btn" type="primary" onClick={handleAudit}>
                审核
              </Button>
            </>
          )}
          {detail.status !== 1 && (
            <Button danger type="primary" onClick={handleDel}>
              删除
            </Button>
          )}
        </span>
      </p>
      <h3 className={cls('mb-20', css.title)}>{detail.title}</h3>
      <div className={cls(css.userMeta, 'mb-15', 'flex-ajc ')}>
        <span>
          {user?.avatar ? (
            <Avatar size={2} src={user?.avatar}></Avatar>
          ) : (
            <Avatar size={25}>{user?.nickname.charAt(0)}</Avatar>
          )}
        </span>
        <span className={cls(css.username, 'fake-link')}>
          <Link to={`/authmanage/user/detail/${user?.id}`}>{user?.nickname}</Link>
        </span>
        <span>发布时间: {formatTime(detail.createTime)}</span>
        <span>
          {detail.tags?.map(ele => (
            <Tag>{ele}</Tag>
          ))}
        </span>
        <span>
          <p>浏览量：{detail.viewCount}</p>
        </span>
        <span>{detail.status === 1 && <DangerTag>已删除</DangerTag>}</span>
        {detail.sourceUrl && (
          <span className="fake-link">
            <Popover content={detail.sourceUrl}>源地址</Popover>
          </span>
        )}
      </div>
      <div className={css.summary}>{detail.summary}</div>
      <div>{detail.content}</div>
    </div>
  );
};

export default Page;
