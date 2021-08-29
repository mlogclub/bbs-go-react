import React, { useState } from 'react';
import cls from 'classnames';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { authRoutes, RouteItem } from '@/router/index';
import UserMenu from './userMenu';
import styles from './header.module.scss';
import logo from '@/assets/img/logo-color.png';

const { SubMenu } = Menu;

type NavMenuProps = {
  menuData?: RouteItem;
};

const hanSubMenu = menu => !!(menu.routes && menu.routes.length);

const NavMenu = React.forwardRef<any, NavMenuProps>((props, ref) => {
  const [current] = useState('');

  const renderSubMenu = (item: RouteItem) => {
    const parentPath = item.redirect || item.path;
    return (
      <SubMenu
        key={item.key || item.path}
        title={parentPath ? <Link to={parentPath}>{item.name}</Link> : item.name}
        popupClassName={styles.subNavMenu}
        popupOffset={[0, 5]}
      >
        {item.routes?.map(ele => {
          if (hanSubMenu(ele)) {
            return renderSubMenu(ele);
          }
          if (ele.hideInMenu === true) {
            return null;
          }
          return (
            <Menu.Item key={ele.key || ele.path}>
              {ele.path ? <Link to={ele.path}>{ele.name}</Link> : <a>{ele.name}</a>}
            </Menu.Item>
          );
        })}
      </SubMenu>
    );
  };

  const handleClick = () => {};

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className={styles.navMenu}>
      {authRoutes.map(ele => {
        if (ele.hideInMenu) {
          return null;
        }
        if (hanSubMenu(ele)) {
          return renderSubMenu(ele as RouteItem);
        }
        return (
          <Menu.Item key={ele.key || ele.path}>
            {ele.path ? <Link to={ele.path}>{ele.name}</Link> : <a>{ele.name}</a>}
          </Menu.Item>
        );
      })}
    </Menu>
  );
});

const Header = () => {
  return (
    <>
      <div className={cls(styles.header, styles.headerPlacehold)}></div>
      <header className={cls(styles.header, styles.light, styles.fixHeader)}>
        <div className={cls(styles.headerContent, 'flex-ac')}>
          <a className={styles.logo}>
            <img src={logo} alt="logo" />
          </a>
          <div className={styles.nav}>
            <NavMenu />
          </div>
          <div className={styles.leftNav}>
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
