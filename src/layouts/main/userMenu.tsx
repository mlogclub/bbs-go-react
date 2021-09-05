import { observer } from 'mobx-react';
import { useState } from 'react';
import { Spin, Avatar, Menu, Popover, Divider, Tag, Modal, message } from 'antd';
import rootStore from '@/store';
import { UserOutlined, LogoutOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import css from './header.module.scss';

const UserMenu = () => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const { userStore } = rootStore;
  const { loginLoading, pageLoading, user } = userStore;
  const history = useHistory();
  const handleLogout = () => {
    setMenuVisible(false);
    Modal.confirm({
      content: '确定要退出？',
      onOk: () => {
        userStore
          .logout()
          .then(res => {
            history.replace('/login');
          })
          .catch(err => {
            message.error({ content: err });
          });
      },
    });
  };

  const menuHandlers = {
    onMouseEnter: e => {
      setMenuVisible(true);
    },
    onMouseLeave: () => {
      setMenuVisible(false);
    },
  };
  if (loginLoading || pageLoading) {
    return <Spin />;
  }

  const menu = (
    <div className={css.userMenuPopup} {...menuHandlers}>
      <div className={css.absplace}></div>
      <section className={css.userProfileBadge}>
        <h3>{user?.nickname}</h3>
        <div className={css.loginName}>{user?.username}</div>
        <p className={css.userBio}>
          <span>{user?.description}</span>
        </p>
        <p className={css.userRoles}>
          {user?.roles?.map(ele => (
            <Tag key={ele}>{ele}</Tag>
          ))}
        </p>
      </section>
      <Menu mode="vertical">
        <Divider></Divider>
        <Menu.Item
          key="profile"
          onClick={() => {
            setMenuVisible(false);
            // history.push(`/authmanage/user/detail/${user?.id}`);
          }}
        >
          <UserOutlined />
          <span>
            <Link to={`/authmanage/user/detail/${user?.id}`}>个人信息</Link>
          </span>
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout}>
          <LogoutOutlined />
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <Popover visible={menuVisible} content={menu} placement="bottomRight" overlayClassName={css.userMenu}>
      <div className="flex-ac" {...menuHandlers}>
        <Avatar src={user?.avatar}>{!user?.avatar ? user?.nickname.charAt(0) : ''}</Avatar>
        <CaretDownOutlined className={css.avatarExpend} />
      </div>
    </Popover>
  );
};

export default observer(UserMenu);
