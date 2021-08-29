import { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import { inject, useObserver, observer } from 'mobx-react';
import { useLocation, useHistory } from 'react-router-dom';
import { StoreProps } from '@/store';
import { getCaptcha } from '@/services/user';
import { randomString } from '@/utils/util';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import css from './index.module.scss';

type FormData = {
  username?: string;
  password?: string;
  password2?: string;
  captchaCode?: string;
  captchaId?: string;
};

type CaptchImg = {
  id: string;
  url: string;
};

interface IProps extends StoreProps {}

const Register = (props: IProps) => {
  const {
    store: { userStore },
  } = props;

  const history = useHistory();
  const { state } = useLocation<{ from: string }>();
  const [captchImg, setCaptchaImg] = useState<CaptchImg>();
  const [formData, setFormData] = useState<FormData>({});
  const [stateStr, setStateStr] = useState<string>('');

  const validForm = () => {
    if (!formData.username) {
      message.error({ content: '请输入账号' });
      return;
    }

    if (!formData.password) {
      message.error({ content: '请输入密码' });
      return;
    }
    return true;
  };

  const login = async () => {
    const res = await userStore.login({ ...formData, captchaId: captchImg?.id });
    if (res.code !== 1) {
      message.error({ content: res.msg });
      getCaptchaImg();
      return;
    }
    history.replace({ pathname: (state && state.from) || '/dashboard' });
  };

  const handleLogin = () => {
    const res = validForm();
    if (!res) {
      return;
    }
    login();
  };

  const getCaptchaImg = () => {
    getCaptcha().then(res => {
      const { code, data } = res.data;
      if (code == 1) {
        setCaptchaImg(data);
      }
    });
  };

  useEffect(() => {
    getCaptchaImg();
    setStateStr(randomString());
  }, []);

  const loginLoading = useObserver(() => userStore.loginLoading);

  return (
    <div className={css.pageWrap}>
      <div className={css.pageContent}>
        <div className={css.loginBox}>
          <h3>Admin</h3>
          <form action="">
            <section className={css.formControl}>
              <Input
                prefix={<UserOutlined />}
                placeholder="账号"
                className={css.formInput}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </section>
            <section className={css.formControl}>
              <Input
                prefix={<LockOutlined />}
                placeholder="密码"
                type="password"
                className={css.formInput}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </section>
            <section className={css.formControl}>
              <Input
                prefix={<LockOutlined />}
                placeholder="密码"
                type="password"
                className={css.formInput}
                onChange={e => setFormData({ ...formData, password2: e.target.value })}
              />
            </section>
            <section className={css.formControl}>
              <Input
                prefix={<SafetyOutlined />}
                placeholder="验证码"
                className={css.formInput}
                onChange={e => setFormData({ ...formData, captchaCode: e.target.value })}
              />
              <span className={css.cpatchImg} onClick={() => getCaptchaImg()}>
                <img src={captchImg?.url} alt="" />
              </span>
            </section>
            <section className={css.formButton}>
              <Button type="primary" block onClick={handleLogin} loading={loginLoading}>
                注册
              </Button>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Register));
