import { Modal, Form, Input } from 'antd';
import { ModalProps } from 'antd/es/modal';

export interface NoticeModalProps extends ModalProps {}

const NoticeModal = (props: NoticeModalProps) => {
  return (
    <Modal {...props}>
      <Form>
        <Form.Item label="标题" name="title">
          <Input></Input>
        </Form.Item>
        <Form.Item label="内容" name="content">
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NoticeModal;
