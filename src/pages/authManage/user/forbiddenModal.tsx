import { forbiddenUser } from '@/services/authManage';
import { message, Modal, Form, Select } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { PostModalProps } from '@/utils/form';

interface ResetPassModalProps extends ModalProps, PostModalProps {
  id?: number | null;
  remove?: boolean;
}
const ResetPassModal = (props: ResetPassModalProps) => {
  const { id, remove, onSuccess, onFail, ...rest } = props;
  const [form] = Form.useForm();
  const handleForbidden = () => {
    if (remove) {
      forbiddenReq({ day: 0 });
      return;
    }
    form.validateFields().then(forbiddenReq);
  };

  const forbiddenReq = data => {
    forbiddenUser({
      userId: id,
      ...data,
    })
      .then(res => {
        const { success, message: msg } = res.data;
        if (success) {
          onSuccess?.();
        } else {
          message.error({ content: msg });
          onFail?.(res.data);
        }
      })
      .catch(onFail);
  };
  return (
    <Modal title="禁言" {...rest} onOk={handleForbidden}>
      {!remove ? (
        <Form form={form} layout="vertical">
          <Form.Item name="days" label="禁言时长" required rules={[{ required: true, message: '请选择时长' }]}>
            <Select>
              <Select.Option value="3">3天</Select.Option>
              <Select.Option value="5">5天</Select.Option>
              <Select.Option value="7">7天</Select.Option>
              <Select.Option value="15">15天</Select.Option>
              <Select.Option value="30">30天</Select.Option>
              <Select.Option value="-1">永久</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="禁言原因" required rules={[{ required: true, message: '请选择原因' }]}>
            <Select>
              <Select.Option value="广告">广告</Select.Option>
              <Select.Option value="灌水">灌水</Select.Option>
              <Select.Option value="涉黄">涉黄</Select.Option>
              <Select.Option value="涉政">涉政</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <span>确定要取消禁言</span>
      )}
    </Modal>
  );
};

export default ResetPassModal;
