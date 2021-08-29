import GlobalStore, { GlobalData } from './global';
import UserStore, { UserData } from './user';

class RootStore {
  globalStore: GlobalData;
  userStore: UserData;

  constructor() {
    this.userStore = UserStore;
    this.globalStore = GlobalStore;
  }
}

export type storeInstance = {
  globalStore: GlobalData;
  userStore: UserData;
};

export interface StoreProps {
  store: RootStore;
}

export default new RootStore();
