import { Modal, Form, Input, Button, message, Row, Col } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { create, update, detect } from '@/services/friendlink';
import { useEffect } from 'react';

interface NodeModalProps extends ModalProps {
  editData?: any;
  onSuccess?: () => void;
}

const TagModal = (props: NodeModalProps) => {
  const { editData, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const isEdit = !!editData;
  const formLayout = {
    labelCol: {
      span: 4,
    },
  };

  const handleSubmit = () => {
    const req = isEdit ? update : create;
    form.validateFields().then(data => {
      if (isEdit) {
        data.id = editData.id;
      }
      req(data).then(res => {
        const { success, message: msg } = res.data;
        if (success) {
          onSuccess?.();
        } else {
          message.error({ content: msg });
        }
      });
    });
  };

  const handleDetect = () => {
    const url = form.getFieldValue('url');
    if (!url) {
      message.error({ content: '请输入地址' });
      return;
    }
    detect<{
      title: string;
      description: string;
    }>(url).then(res => {
      const { success, data } = res.data;
      const currentValues = form.getFieldsValue();
      if (success && data) {
        form.setFieldsValue({
          ...currentValues,
          title: data.title,
          summary: data.description,
        });
      }
    });
  };

  const initForm = data => {
    form.setFieldsValue({
      title: data.title,
      url: data.url,
      logo: data.logo,
      summary: data.summary,
    });
  };

  useEffect(() => {
    if (props.visible) {
      initForm(isEdit ? editData : {});
    }
  }, [props.visible]);

  return (
    <Modal title={isEdit ? '编辑' : '创建'} {...rest} onOk={handleSubmit} destroyOnClose>
      <Form {...formLayout} form={form}>
        <Form.Item
          label="网址"
          name="url"
          rules={[
            { required: true, message: '请填写网址' },
            { type: 'url', message: '请填写符合规范的网址（http或者https开头的网址）' },
          ]}
        >
          <Row>
            <Col span={18}>
              <Input placeholder="链接地址"></Input>
            </Col>
            <Col span={4} offset={2}>
              <Button onClick={handleDetect}>抓取</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="名称" name="title" rules={[{ required: true, message: '请填写节点名称' }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item label="描述" name="summary">
          <Input></Input>
        </Form.Item>
        <Form.Item label="Logo" name="logo">
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagModal;
