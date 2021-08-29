import { Modal, Form, message, Select } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { useEffect, useState } from 'react';
import { updateArticleTag, ArticleItem, ArticleTag } from '@/services/article';

export interface ArticleModalProps extends ModalProps {
  editItem?: ArticleItem;
  onSuccess?: (ArticleTag) => void;
}

const ArticleModal = (props: ArticleModalProps) => {
  const { editItem, visible, onOk, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const [tagList, setTagList] = useState<any[]>();

  const handleOk = () => {
    form.validateFields().then(data => {
      console.log(data);
      updateArticleTag<ArticleTag>({
        articleId: editItem?.id!,
        tags: data.tags.join(','),
      }).then(res => {
        const { success, data, message: msg } = res.data;
        if (success) {
          onSuccess?.(data);
        } else {
          message.error({ content: msg });
        }
      });
    });
  };

  // 搜索
  const handleSearch = res => {
    console.log(res);
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        tags: editItem?.tags?.map(ele => ele.tagName),
      });
      setTagList(editItem?.tags);
    }
  }, [visible]);

  return (
    <Modal visible={visible} {...rest} onOk={handleOk}>
      <Form layout="vertical" form={form}>
        <Form.Item name="tags">
          <Select mode="tags" showSearch onSearch={handleSearch} optionFilterProp="children">
            {tagList?.map(ele => (
              <Select.Option key={ele.tagName} value={ele.tagName}>
                {ele.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticleModal;
