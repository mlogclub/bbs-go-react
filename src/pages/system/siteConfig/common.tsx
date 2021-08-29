import { Form, Button, Input, Switch, Checkbox, Row, Col, InputNumber, Card, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  SysConfigSiteTitle,
  SysConfigSiteKeywords,
  SysConfigSiteDescription,
  SysConfigUrlRedirect,
  SysConfigLoginMode,
  SysConfigTokenExpireDays,
  SysConfigDefaultNodeId,
} from '@/utils/constant';
import { UserConfig, UseNodes } from './util';

const Page = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [, save, loading] = UserConfig(form);
  const [nodeList] = UseNodes();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  console.log(nodeList);

  return (
    <Card className="page-card-wrap page-post-from" bordered={false} loading={loading}>
      <Form layout="horizontal" {...formItemLayout} form={form} onFinish={save}>
        <Form.Item
          name={SysConfigSiteTitle}
          label="网站标题"
          rules={[
            {
              required: true,
              message: '请填写网站标题',
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={SysConfigSiteKeywords}
          label="网站关键字"
          rules={[
            {
              required: true,
              message: '请填写网站关键字',
            },
          ]}
        >
          <Select mode="tags"></Select>
        </Form.Item>
        <Form.Item
          label="登录方式"
          rules={[
            {
              required: true,
              message: '请至少选择一项',
            },
          ]}
        >
          <Form.Item noStyle name={[SysConfigLoginMode, 'password']} valuePropName="checked" initialValue={false}>
            <Checkbox>密码</Checkbox>
          </Form.Item>
          <Form.Item noStyle name={[SysConfigLoginMode, 'qq']} valuePropName="checked" initialValue={false}>
            <Checkbox>QQ</Checkbox>
          </Form.Item>
          <Form.Item noStyle name={[SysConfigLoginMode, 'github']} valuePropName="checked" initialValue={false}>
            <Checkbox>Github</Checkbox>
          </Form.Item>
          <Form.Item noStyle name={[SysConfigLoginMode, 'osc']} valuePropName="checked" initialValue={false}>
            <Checkbox>osc</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item name={SysConfigSiteDescription} label="网站描述">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item
          tooltip="网站中的连接跳转前是否跳转到确认页面"
          name={SysConfigUrlRedirect}
          label="直链跳转"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item tooltip="用户登录状态失效时间" name={SysConfigTokenExpireDays} label="Token有效期" initialValue={6}>
          <InputNumber placeholder="6"></InputNumber>
        </Form.Item>
        <Form.Item label="默认节点" name={SysConfigDefaultNodeId}>
          <Select placeholder="请选择节点">
            {nodeList?.map(ele => (
              <Select.Option key={ele.id} value={ele.id!}>
                {ele.name}
              </Select.Option>
            ))}
          </Select>
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
