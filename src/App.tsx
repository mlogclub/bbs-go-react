import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Switch, Route, Router } from 'react-router-dom';
import Layout from '@/layouts';
import noAuthMenus from '@/router/index';
import routerHistory from '@/utils/history';
import './App.scss';

moment.locale('zh-cn');

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={routerHistory}>
        <Switch>
          {noAuthMenus.map(ele =>
            ele.component ? (
              <Route exact key={ele.key || ele.path} path={ele.path}>
                <ele.component />
              </Route>
            ) : null,
          )}
          <Route path="/" children={<Layout />}></Route>
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default App;
