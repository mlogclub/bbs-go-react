import { Modal, Form, Input, Radio, message } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { createTag, updateTag } from '@/services/tag';
import { useEffect } from 'react';

interface NodeModalProps extends ModalProps {
  editData?: any;
  onSuccess?: () => void;
}

const TagModal = (props: NodeModalProps) => {
  console.log(props);
  const { editData, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const isEdit = !!editData;
  const formLayout = {
    labelCol: {
      span: 4,
    },
  };

  const handleSubmit = () => {
    const req = isEdit ? updateTag : createTag;
    console.log(isEdit);
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
    form.setFieldsValue({
      name: data.name,
      description: data.description,
      status: data.status,
      show: data.showMenu,
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
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请填写标签名称' }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item label="状态" name="status" rules={[{ required: true, message: '请填写状态' }]} initialValue={0}>
          <Radio.Group>
            <Radio value={0}>正常</Radio>
            <Radio value={1}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagModal;
