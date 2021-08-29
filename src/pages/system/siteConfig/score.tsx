import { Form, Button, Row, Col, InputNumber, Card } from 'antd';
import { useHistory } from 'react-router';
import { SysConfigScoreConfig } from '@/utils/constant';
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
    save(data, () => {});
  };

  return (
    <Card bordered={false} className="page-card-wrap page-post-from" loading={loading}>
      <Form layout="horizontal" {...formItemLayout} form={form} onFinish={handleSave}>
        <Form.Item name={[SysConfigScoreConfig, 'postTopicScore']} label="发帖" initialValue={0}>
          <InputNumber />
        </Form.Item>
        <Form.Item name={[SysConfigScoreConfig, 'postCommentScore']} label="评论" initialValue={0}>
          <InputNumber />
        </Form.Item>
        <Form.Item name={[SysConfigScoreConfig, 'checkInScore']} label="签到" initialValue={0}>
          <InputNumber />
        </Form.Item>
        <Row>
          <Col offset={6} className="post-tools">
            <Button type="primary" htmlType="submit" loading={loading}>
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
