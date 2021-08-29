// 页面内容区域
import { Switch, Route } from 'react-router-dom';
import { authRoutes, RouteItem } from 'src/router/index';
import PrivateRoute from '../route/privateRoute';
import Breadcrumb from './breadcrumb';
import css from './index.module.scss';

// const flatten = (arr: any[]) =>
// arr.reduce((item, next) => item.concat(Array.isArray(next.routes) ? flatten(next.routes) : next, []));

const PageContent = () => {
  // 渲染权限路由
  const renderAuthRoutes = (routes: RouteItem[], parentPath?: string) => {
    return routes.map(item => {
      const { routes, key, component: Component, redirect, exact, path, ...rest } = item;
      const absolutePath = path?.indexOf('/') !== 0 ? (parentPath || '/') + path : path;

      if (routes && routes.length) {
        return renderAuthRoutes(routes, absolutePath);
      }

      let child: any = null;
      if (Component) {
        child = <Component />;
      }

      return (
        <PrivateRoute
          {...rest}
          path={absolutePath}
          exact={exact === false ? false : true}
          key={key || item.path}
          children={child}
        ></PrivateRoute>
      );
    });
  };

  return (
    <>
      <Breadcrumb />
      <main className={css.pageContent}>
        <div className={css.pageContentInner}>
          <Switch>
            {renderAuthRoutes(authRoutes as RouteItem[])}
            <Route path="*">404</Route>
          </Switch>
        </div>
      </main>
    </>
  );
};

export default PageContent;
