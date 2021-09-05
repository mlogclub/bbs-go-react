import { useEffect, useState } from 'react';
import { Input, Button, message, Divider, Form, Row, Col } from 'antd';
import { inject, useObserver, observer } from 'mobx-react';
import { useLocation, useHistory } from 'react-router-dom';
import { StoreProps } from '@/store';
import { getCaptcha, githubLoginAuth } from '@/services/user';
import { GithubFilled, UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { query } from '@/utils/util';

import css from './index.module.scss';

type CaptchImg = {
  captchaId: string;
  captchaUrl: string;
};

interface IProps extends StoreProps {}

const Login = (props: IProps) => {
  const {
    store: { userStore },
  } = props;
  const history = useHistory();
  const location = useLocation<{ from: string }>();
  const [captchImg, setCaptchaImg] = useState<CaptchImg>();

  const [form] = Form.useForm();

  // 登录
  const handleLogin = async data => {
    const formData = {
      ...data,
      captchaId: captchImg?.['captchaId']!,
    };
    const res = await userStore.login(formData).catch(() => {});
    if (!res) {
      message.error({ content: '网络异常' });
      return;
    }
    if (!res.success) {
      message.error({ content: res.message });
      getCaptchaImg();
      return;
    }
    // 先从state里面获取，如果没有则去url，默认 /dashboard
    let { from } = location.state || {};
    if (!from) {
      from = query('from', encodeURIComponent(location.search)) || '/dashboard';
    }
    history.replace(from);
  };

  // 获取图片验证码
  const getCaptchaImg = () => {
    getCaptcha()
      .then(res => {
        const { success, data } = res.data;
        if (success) {
          setCaptchaImg(data);
        }
      })
      .catch(err => {
        message.error({ content: err?.statusText || '获取验证码失败' });
      });
  };
  // 获取GitHub授权链接
  const handleGitubAuth = () => {
    githubLoginAuth().then(res => {
      const { success, data, message } = res.data;
      if (success) {
        window.location.href = data.url;
      } else {
        message.error({ content: message });
      }
    });
  };

  useEffect(() => {
    getCaptchaImg();
  }, []);

  const loginLoading = useObserver(() => userStore.loginLoading);

  return (
    <div className={css.pageWrap}>
      <div className={css.pageContent}>
        <div className={css.loginBox}>
          <h3>Admin</h3>
          <Form form={form} onFinish={handleLogin}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined />} placeholder="用户名" size="large"></Input>
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input prefix={<LockOutlined />} placeholder="密码" size="large"></Input>
            </Form.Item>
            <Form.Item name="captchaCode" rules={[{ required: true, message: '请输入图片码' }]}>
              <Row>
                <Col span={12}>
                  <Input prefix={<SafetyOutlined />} placeholder="图片码" size="large"></Input>
                </Col>
                <Col span={12}>
                  <span className={css.cpatchImg} onClick={() => getCaptchaImg()}>
                    <img src={captchImg?.captchaUrl} alt="" />
                  </span>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name="password">
              <Button type="primary" block loading={loginLoading} htmlType="submit" size="large">
                登录
              </Button>
            </Form.Item>
          </Form>
          <Divider className={css.splitLine} plain>
            第三方登录
          </Divider>
          <div className={css.thirdLogin}>
            <a rel="noopener noreferrer" onClick={handleGitubAuth}>
              <GithubFilled />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Login));
