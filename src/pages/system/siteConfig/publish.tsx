import { Form, Button, Switch, Row, Col, Card, InputNumber } from 'antd';
import {
  SysConfigArticlePending,
  SysConfigTopicCaptcha,
  SysConfigUserObserveSeconds,
  SysConfigCreateTopicEmailVerified,
  SysConfigCreateArticleEmailVerified,
  SysConfigCreateCommentEmailVerified,
} from '@/utils/constant';
import { useHistory } from 'react-router';
import { UserConfig } from './util';
const Page = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [, save, loading] = UserConfig(form);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const handleSave = data => {
    save(data, () => history.goBack());
  };
  return (
    <Card bordered={false} className="page-card-wrap page-post-from" loading={loading}>
      <Form layout="horizontal" {...formItemLayout} form={form} onFinish={handleSave}>
        <Form.Item name={SysConfigTopicCaptcha} label="发帖验证码">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item name={SysConfigCreateTopicEmailVerified} label="邮箱验证后发帖">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item label="邮箱验证后发表文章" name={SysConfigCreateArticleEmailVerified}>
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item label="邮箱验证后评论" name={SysConfigCreateCommentEmailVerified}>
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item label="发表文章审核" name={SysConfigArticlePending}>
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item label="用户观察期(秒)" name={SysConfigUserObserveSeconds}>
          <InputNumber />
        </Form.Item>
        <Row>
          <Col offset={6} className="post-tools">
            <Button type="primary" loading={loading} htmlType="submit">
              保存
            </Button>
            <Button onClick={() => history.push('/site/config/')}>取消</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Page;
