import { useEffect, useState } from 'react';
import { getSystemInfo } from '@/services/dashboard';
import { Card, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { StoreProps } from '@/store';
import css from './index.module.scss';

type SystenInfo = {
  arch: string;
  goroot: string;
  goversion: string;
  hostname: string;
  numCpu: number;
  os: string;
};
interface IProps extends StoreProps {}
const Page = (props: IProps) => {
  const {
    store: { userStore },
  } = props;
  const [sysInfo, setSysInfo] = useState<SystenInfo>();

  useEffect(() => {
    getSystemInfo<SystenInfo>().then(res => {
      if (res.data?.success) {
        setSysInfo(res.data.data);
      }
    });
  }, []);

  return (
    <div>
      <Row gutter={24}>
        <Col span={6}>
          <Card size="small" title="首页" bordered={false} hoverable>
            亲！欢迎登录, {userStore.user?.nickname}
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="系统信息" bordered={false} hoverable>
            <p className={css.systemItem}>
              <strong>系统架构</strong>
              <span>{sysInfo?.arch}</span>
            </p>

            <p className={css.systemItem}>
              <strong>GoRoot</strong>
              <span>{sysInfo?.goroot}</span>
            </p>
            <p className={css.systemItem}>
              <strong>Go版本</strong>
              <span>{sysInfo?.goversion}</span>
            </p>
            <p className={css.systemItem}>
              <strong>Hostname</strong>
              <span>{sysInfo?.hostname}</span>
            </p>
            <p className={css.systemItem}>
              <strong>操作系统</strong>
              <span>{sysInfo?.os}</span>
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default inject('store')(observer(Page));
