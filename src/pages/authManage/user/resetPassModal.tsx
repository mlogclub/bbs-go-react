import { resetPassword } from '@/services/authManage';
import { Input, message, Modal, Form } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { PostModalProps } from '@/utils/form';
import { encrypPass } from '@/utils/util';

interface ResetPassModalProps extends ModalProps, PostModalProps {
  ids?: number[];
}
const ResetPassModal = (props: ResetPassModalProps) => {
  const { ids, onSuccess, onFail, ...rest } = props;
  const [form] = Form.useForm();
  const handleSubmit = () => {
    form.validateFields().then(data => {
      console.log(data);
      resetPassword({
        ids,
        password: encrypPass(data.password || '123456'),
      })
        .then(res => {
          const { code, msg } = res.data;
          if (code === 1) {
            onSuccess?.();
          } else {
            message.error({ content: msg });
            onFail?.(res.data);
          }
        })
        .catch(onFail);
    });
  };
  return (
    <Modal title="重置密码" {...rest} onOk={handleSubmit}>
      <Form form={form} layout="vertical">
        <Form.Item name="password" label="新密码(不填写默认：123456)">
          <Input placeholder="密码"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPassModal;
