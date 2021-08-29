import { ReactNode } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { storeInstance } from '@/store';
import { redirectLoginPath } from '@/utils/history';

type IProps = RouteProps & {
  store?: storeInstance;
  children?: ReactNode;
};

function PrivateRoute(props: IProps) {
  const { children, store, ...rest } = props;
  const hasLogin = !!store?.userStore.token;

  console.log('???hasLogin ', hasLogin);
  return (
    <Route {...rest} render={({ location }) => (hasLogin ? children : <Redirect to={redirectLoginPath(location)} />)} />
  );
}

export default inject('store')(observer(PrivateRoute));
