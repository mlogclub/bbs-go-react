import { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { authRoutes } from '@/router';
import css from './index.module.scss';

/**
 * 以递归的方式展平react router数组
 */
const flattenRoutes = (arr, parent) =>
  arr.reduce(function (prev, item) {
    if (parent) {
      item.__parent = parent;
    }
    prev = prev.concat(item);
    return Array.isArray(item.routes)
      ? prev.concat(flattenRoutes(item.routes, item.key || item.path))
      : prev.concat([]);
  }, []);

const getParent = ({ routes, component, icon, ...rest }) => ({ ...rest });
/**
 * 获取面包屑，
 **/
const getBreadCrumb = (allRoutes, location) => {
  let matchs: any[] = [];
  const currentRoute = allRoutes.filter(ele => ele.path === location.pathname)[0];

  if (currentRoute) {
    let parent = getParent(currentRoute);
    // TODO: 优化面包屑
    while (parent) {
      matchs.unshift(parent);
      parent = allRoutes.filter(ele => parent.__parent === (ele.key || ele.path))[0];
      parent = parent && getParent(parent as any);
    }
  }
  return matchs;
};

const BreadcrumbComponent = () => {
  const allRoutes = useMemo(() => flattenRoutes(authRoutes, ''), []);
  const location = useLocation();
  const matchRoutes = getBreadCrumb(allRoutes, location);
  const isHome = matchRoutes?.length === 1 && matchRoutes[0].path === '/';

  // 首页不显示面包屑
  if (isHome) {
    return null;
  }
  return (
    <div className={css.breadcrumb}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">首页</Link>
        </Breadcrumb.Item>
        {matchRoutes.map((ele, i) => (
          <Breadcrumb.Item key={ele.key || ele.path}>
            {i === matchRoutes.length - 1 ? ele.name : ele.path ? <Link to={ele.path}>{ele.name}</Link> : ele.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
