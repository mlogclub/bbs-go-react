import { Modal, Form, Input, Radio, message, InputNumber } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { createNode, updateNode } from '@/services/topicNode';
import { useEffect } from 'react';
import MyUpload from '@/components/Upload/upload';
interface NodeModalProps extends ModalProps {
  editData?: any;
  onSuccess?: () => void;
}

const TopicNodeModal = (props: NodeModalProps) => {
  const { editData, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const isEdit = !!editData;
  const formLayout = {
    labelCol: {
      span: 4,
    },
  };

  const handleSubmit = () => {
    const req = isEdit ? updateNode : createNode;
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

  const initForm = data => {
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      initForm(isEdit ? editData : {});
    } else {
      initForm({});
    }
  }, [props.visible]);

  console.log(editData);
  return (
    <Modal title={isEdit ? '编辑' : '创建'} {...rest} onOk={handleSubmit} destroyOnClose>
      <Form {...formLayout} form={form} preserve={false}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请填写节点名称' }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item label="Logo" name="logo">
          <MyUpload name="image" maxCount={1} listType="picture-card" accept="image/*" showCrop={true}></MyUpload>
        </Form.Item>
        <Form.Item label="状态" name="status" initialValue={0}>
          <Radio.Group>
            <Radio value={0}>正常</Radio>
            <Radio value={1}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="排序" name="sortNo">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TopicNodeModal;
