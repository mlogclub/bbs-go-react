import { Button, Form, Input, message, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { RollbackOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { createUser, updateUser, getUserDetail, PostUserData } from '@/services/authManage';
import { removeEmpty, query } from '@/utils/util';
import { UserRolesOwner, UserRolesAdmin } from '@/utils/constant';

// 角色
const roles = [UserRolesOwner, UserRolesAdmin];

const Page = () => {
  const [postId, setPostId] = useState<number>();

  const history = useHistory();
  const [form] = Form.useForm<PostUserData>();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  // 获取用户信息
  const getUserData = id => {
    getUserDetail<PostUserData>({ id }).then(res => {
      const { success, data } = res.data;
      if (success) {
        data.password = '';
        data.roles = data.roles || [];
        form.setFieldsValue(data);
      }
    });
  };

  // 创建用户
  const handleFinish = userData => {
    let postData = removeEmpty(userData);
    // 如果是编辑
    if (postId) {
      return updateUserDetail({ id: postId, ...postData });
    }
    createUser(postData).then(res => {
      const { success, message: msg } = res.data;
      if (success) {
        message.success({ content: '创建成功' });
        history.goBack();
      } else {
        message.error({ content: msg });
      }
    });
  };

  // 更新用户信息
  const updateUserDetail = postData => {
    updateUser(postData).then(res => {
      const { success, message: msg } = res.data;
      if (success) {
        message.success({ content: '修改成功' });
        history.goBack();
      } else {
        message.error({ content: msg });
      }
    });
  };

  useEffect(() => {
    const id = query('id');
    if (id) {
      setPostId(parseInt(id) || 0);
      getUserData(id);
    }
  }, []);

  return (
    <div className="page-card-wrap page-post-from">
      <p className="post-header">
        <Tooltip title="返回">
          <Button type="text" onClick={() => history.goBack()} icon={<RollbackOutlined />}></Button>
        </Tooltip>
      </p>
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item name="username" label="账号/用户名" rules={[{ required: true, message: '请填写用户名/账号' }]}>
          <Input placeholder="用户名/登录账号（只能用英文字母+数字）" />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请填写昵称' }]}>
          <Input placeholder="昵称" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="邮箱" />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input placeholder="密码" type="password" />
        </Form.Item>
        {postId && (
          <>
            <Form.Item name="roles" label="角色">
              <Select mode="multiple">
                {roles.map(ele => (
                  <Select.Option key={ele} value={ele}>
                    {ele}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select>
                <Select.Option value={0}>正常</Select.Option>
                <Select.Option value={1}>删除</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item label={' '} colon={false} className="post-tools">
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => history.goBack()}>取消</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
