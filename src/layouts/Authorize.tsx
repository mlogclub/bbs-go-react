import { useLayoutEffect, FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import { inject } from 'mobx-react';
import { storeInstance } from '@/store';

type IProps = {
  store?: storeInstance;
  children?: ReactNode;
};

const Authorize: FC<IProps> = props => {
  const { store, children } = props;
  // const route = useRouteMatch();
  // 监听路由变化呢？？
  useLayoutEffect(() => {}, []);
  // console.log(route);
  if (!store?.userStore.token) {
    return <>{children}</>;
  }
  // return null;
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: window.location.href },
      }}
    ></Redirect>
  );
};

export default inject('store')(Authorize);
