import { useEffect } from 'react';
import { githubLogin } from '@/services/user';
import { useLocation } from 'react-router-dom';
import { query } from '@/utils/util';
import { message } from 'antd';
const Page = () => {
  const location = useLocation();
  useEffect(() => {
    const code = query('code', location.search);
    if (!code) {
      message.error({ content: '缺少code' });
      return;
    }
    githubLogin({ code }).then(res => {
      console.log(res);
    });
  }, []);
  return <div>github 登录中....</div>;
};

export default Page;
