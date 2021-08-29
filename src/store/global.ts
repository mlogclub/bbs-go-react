import { makeAutoObservable } from 'mobx';

class GlobalData {
  // TODO: 国际化
  lang = 'zh-cn';

  constructor() {
    makeAutoObservable(this);
  }
}
export { GlobalData };
export default new GlobalData();
