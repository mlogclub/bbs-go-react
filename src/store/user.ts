import { makeAutoObservable, runInAction, action } from 'mobx';
import { login, register, getCurrent, logout, githubLogin } from '@/services/user';
import { setToken, removeToken, getToken } from '@/utils/storage';

interface UserDetail {
  id: number;
  username: string;
  nickname: string;
  status: number;
  avatar?: string;
  thumbAvatar?: string;
  email?: string;
  roles?: string[];
  description?: string;
  phone?: string;
}
class UserData {
  user?: UserDetail = undefined;
  loginLoading = false;
  registerLoading = false;
  pageLoading = true;
  token = '';

  constructor() {
    makeAutoObservable(this);
  }

  // 登录
  @action
  login(payload: any) {
    this.loginLoading = true;
    return login(payload)
      .then(res => {
        const {
          data: { success, data },
        } = res;
        if (success) {
          this.setUserData(data);
        }
        return res.data;
      })
      .finally(() => {
        // TODO: run in action
        this.loginLoading = false;
      });
  }

  // 注册
  @action
  register(payload: any) {
    this.registerLoading = true;
    return register(payload)
      .then(res => {
        return res.data;
      })
      .finally(() => {
        this.registerLoading = false;
      });
  }

  @action
  getCurrent() {
    this.pageLoading = true;
    return getCurrent()
      .then(res => {
        const {
          data: { success, data },
        } = res;
        if (success) {
          runInAction(() => {
            this.user = data;
            this.token = getToken() || '';
          });
        }
        return res.data;
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  githubLogin(data: any) {
    return githubLogin(data).then(res => {
      const {
        data: { success, data },
      } = res;
      if (success) {
        this.setUserData(data);
      }
      return res.data;
    });
  }

  setUserData(data) {
    this.user = data.user;
    this.token = data.token;
    setToken(data.token);
  }

  clearUserData() {
    this.token = '';
    this.user = undefined;
    removeToken();
  }

  logout() {
    return logout().then(res => {
      const { success } = res.data;
      if (success) {
        this.clearUserData();
      }
      return res.data;
    });
  }
}

export { UserData };
export default new UserData();
