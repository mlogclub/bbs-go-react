import { useEffect, useState } from 'react';
import { Spin, Descriptions, Avatar, Button, Modal, Tooltip, message, Tag } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { getUserDetail } from '@/services/authManage';
import { RollbackOutlined } from '@ant-design/icons';
import ResetPassModal from './resetPassModal';

const Page = () => {
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [resetPassVisible, setResetPassVisible] = useState<boolean>(false);
  const [img, setImg] = useState<string>();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getUserDetail({ id })
      .then(res => {
        const { success, data } = res.data;
        if (success) {
          setUserData(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spin></Spin>;
  }
  return (
    <div className="page-card-wrap">
      <Descriptions
        title={
          <Tooltip title="返回">
            <Button type="text" icon={<RollbackOutlined />} onClick={() => history.goBack()}></Button>
          </Tooltip>
        }
        layout="horizontal"
        column={1}
        labelStyle={{
          fontWeight: 700,
          width: 200,
          textAlign: 'right',
          flex: 'none',
          display: 'block',
        }}
        extra={
          <div>
            <Button type="primary" style={{ marginRight: 20 }}>
              <Link to={{ pathname: '/authmanage/user/post', search: `?id=${id}` }}>编辑</Link>
            </Button>
          </div>
        }
      >
        <Descriptions.Item label="账号">{userData?.username}</Descriptions.Item>
        <Descriptions.Item label="昵称">{userData?.nickname}</Descriptions.Item>
        <Descriptions.Item label="Email">{userData?.email}</Descriptions.Item>
        <Descriptions.Item label="简介">{userData?.description}</Descriptions.Item>
        <Descriptions.Item label="角色">
          {userData?.roles?.map(ele => (
            <Tag key={ele}>{ele}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="头像">
          {userData?.avatar ? (
            <span
              onClick={() => {
                setVisible(true);
                setImg(userData.avatar);
              }}
            >
              <Avatar src={userData.avatar} />
            </span>
          ) : (
            <Avatar>{userData?.username?.charAt(0)}</Avatar>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="主页">
          <a className="link" href={userData?.homePage} target="_blank" rel="noreferrer nofollow">
            {userData?.homePage}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="背景图">
          {userData?.backgroundImage ? (
            <img
              onClick={() => {
                setVisible(true);
                setImg(userData?.backgroundImage);
              }}
              src={userData?.backgroundImage}
              style={{ maxWidth: 300 }}
              alt=""
            />
          ) : null}
        </Descriptions.Item>
        <Descriptions.Item label="状态">{userData?.status === 0 ? '正常' : '删除'}</Descriptions.Item>
        <Descriptions.Item label="注册时间">
          {userData?.createTime ? moment(userData.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
        </Descriptions.Item>
      </Descriptions>

      <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
        <img src={img} style={{ maxWidth: '100%' }} alt="" />
      </Modal>

      <ResetPassModal
        visible={resetPassVisible}
        ids={[parseInt(id)]}
        onSuccess={() => {
          message.success({ content: '重置成功' });
          setResetPassVisible(false);
        }}
        onCancel={() => {
          setResetPassVisible(false);
        }}
      ></ResetPassModal>
    </div>
  );
};

export default Page;
