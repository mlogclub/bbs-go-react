import React, { useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import PageLoading from '@/components/pageLoading';
import SideBar from './sideBar';
import store from '@/store';
import Header from './header';
import Content from './content';
import css from './index.module.scss';
// import { redirectLogin } from '@/utils/history';

interface IProps {
  className?: string;
  children?: React.ReactNode;
  fixHead?: boolean;
}

const Layout: React.FC<IProps> = props => {
  const userStore = store.userStore;
  useLayoutEffect(() => {
    userStore.getCurrent();
    // .catch(redirectLogin);
  }, []);

  // 无Token， 而且在loading中
  if (!userStore.token && userStore.pageLoading) {
    return <PageLoading />;
  }

  return (
    <div className={css.page}>
      <Header />
      <SideBar />
      <Content />
    </div>
  );
};

// export default inject('store')(observer(Layout));
export default observer(Layout);
