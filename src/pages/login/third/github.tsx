import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { message } from 'antd';
import { query } from '@/utils/util';
import store from '@/store';

const Page = () => {
  const location = useLocation<{ from: string }>();
  const history = useHistory();

  const redirectBack = () => {
    let { from } = location.state || {};
    if (!from) {
      from = query('from', encodeURIComponent(location.search)) || '/dashboard';
    }
    history.replace(from);
  };
  useEffect(() => {
    const code = query('code', location.search);
    if (!code) {
      message.error({ content: '缺少code' });
      return;
    }
    store.userStore.githubLogin({ code, state: query('state') }).then(() => {
      redirectBack();
    });
  }, []);
  return <div>github 登录中....</div>;
};

export default Page;
