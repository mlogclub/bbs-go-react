import { Input, Modal, Form } from 'antd';
import { ModalProps } from 'antd/es/modal';
// import { addConfig, updateConfig } from '@/services/siteConfig';
import { PostModalProps } from '@/utils/form';
import { useEffect } from 'react';

export type ConfigItem = {
  id: number;
  description: string;
  key: string;
  name: string;
  userId: number;
  username: string;
  value: string;
  updateTime: number;
  createTime: number;
};

interface ConfigModelProps extends ModalProps, PostModalProps {
  editData?: ConfigItem;
}

const PostModal = (props: ConfigModelProps) => {
  const [form] = Form.useForm();
  const { visible, editData, onSuccess, onFail, ...rest } = props;
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const validForm = () => {
    form.validateFields().then(res => {
      if (!!editData) {
        updateSubmit(res);
      } else {
        createConfig(res);
      }
    });
  };

  const createConfig = data => {
    // addConfig(data)
    //   .then(resp => {
    //     const { code, msg } = resp.data;
    //     if (code === 1) {
    //       message.success('添加成功');
    //       onSuccess?.();
    //     } else {
    //       message.error({ content: msg });
    //     }
    //   })
    //   .catch(onFail);
  };
  const updateSubmit = data => {
    // updateConfig({ id: editData?.id, ...data })
    //   .then(resp => {
    //     const { code, msg } = resp.data;
    //     if (code === 1) {
    //       message.success('修改成功');
    //       onSuccess?.();
    //     } else {
    //       message.error({ content: msg });
    //     }
    //   })
    //   .catch(onFail);
  };

  useEffect(() => {
    if (visible && editData) {
      form.setFieldsValue(editData);
    }
  }, [visible]);

  return (
    <Modal visible={visible} {...rest} title={!!editData ? '修改' : '新增'} onOk={validForm}>
      <Form {...formLayout} form={form}>
        <Form.Item label="key" name="key" required rules={[{ required: true, message: '配置项的key为必填项' }]}>
          <Input placeholder="配置项的key（唯一标识）"></Input>
        </Form.Item>
        <Form.Item label="value" name="value" required rules={[{ required: true, message: '配置项的value为必填项' }]}>
          <Input.TextArea placeholder="配置项的值"></Input.TextArea>
        </Form.Item>
        <Form.Item label="名称" name="name" required rules={[{ required: true, message: '配置项名称为必填项' }]}>
          <Input placeholder="名称"></Input>
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="描述"></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostModal;
