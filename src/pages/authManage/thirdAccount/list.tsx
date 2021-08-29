import { useEffect, useState } from 'react';
import { Avatar, Form, Button, Popover, Modal, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { getUsers, GetUsersParams } from '@/services/authManage';
import moment from 'moment';
import { removeEmpty } from '@/utils/util';
import DangerTag from '@/components/antd/dangerTag';
import css from './list.module.scss';

export interface UserItem {
  avatar: string;
  backgroundImage: string;
  commentCount: number;
  createTime: number;
  description: string;
  email: string;
  emailVerified: boolean;
  forbidden: boolean;
  forbiddenEndTime: number;
  homePage: string;
  id: number;
  nickname: string;
  password: string;
  roles: string[];
  score: number;
  status: number;
  topicCount: number;
  type: number;
  updateTime: number;
  username: string;
}

type ListResponse = {
  page: {
    page: number;
    limit: number;
    total: number;
  };
  results?: UserItem[];
};

const Page = () => {
  const [listData, setListData] = useState<UserItem[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<any>();
  const [previewLogo, setPreviewLogo] = useState<boolean>(false);
  const [previewImg, setPreviewImg] = useState<string>();
  const [selectIds, setSelectIds] = useState<number[]>();
  const [resetPassVisible, setResetPassVisible] = useState<boolean>();
  const [forbiddenVisible, setForbiddenVisible] = useState<boolean>();
  const [forbiddenId, setForbiddenId] = useState<number | null>(null);
  const [forbiddenRemove, setForbiddenRemove] = useState<boolean>(false);
  const getListData = (params?: GetUsersParams) => {
    setLoading(true);
    setParams(params);
    getUsers<ListResponse>(params)
      .then(res => {
        const {
          data: { success, data },
        } = res;
        if (success && data) {
          setListData(data.results);
          setTotal(data.page.total);
        }
      })
      .finally(() => setLoading(false));
  };

  // 禁言
  const handleForbidden = (item: UserItem) => {
    setForbiddenVisible(true);
    setForbiddenId(item.id);
    if (item.forbidden) {
      setForbiddenRemove(true);
    }
  };
  useEffect(() => {
    getListData();
  }, []);

  // 更多内容
  const renderPopoverContent = (item: UserItem) => {
    return (
      <div className={css.detailContent}>
        <p>
          <strong>积分：</strong>
          {item.score}
        </p>
        <p>
          <strong>话题数：</strong>
          {item.topicCount}
        </p>
        <p>
          <strong>评论数：</strong>
          {item.commentCount}
        </p>
        <p>
          <strong>主页：</strong>
          {item.homePage}
        </p>
        <p>
          <strong>简介：</strong>
          {item.description}
        </p>
      </div>
    );
  };

  const columns: ColumnProps<UserItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (val, item) =>
        val ? (
          <span
            onClick={() => {
              setPreviewImg(val);
              setPreviewLogo(true);
            }}
          >
            <Avatar src={val} />
          </span>
        ) : (
          <Avatar className={css.userTxtAvatar}>{item.username.charAt(0)}</Avatar>
        ),
    },
    {
      title: '账号',
      dataIndex: 'username',
      render: (val, item) => (
        <Popover content={renderPopoverContent(item)}>
          <Link to={`/authmanage/user/detail/${item.id}`} className="fake-link">
            {val}
          </Link>
        </Popover>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: val => val && val.join('|'),
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '邮箱验证',
      dataIndex: 'emailVerified',
      render: val => (val ? '是' : '否'),
    },
    {
      title: '禁言结束时间',
      dataIndex: 'forbiddenEndTime',
      render: val => {
        if (val === -1) {
          return '永久禁言';
        }
        return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => {
        if (val === 1) {
          return <DangerTag>删除</DangerTag>;
        }
        return '正常';
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      align: 'center',
      render: (val, item) => {
        return (
          <span className="action-btn-group" style={{ justifyContent: 'space-between' }}>
            <Button type="link">
              <Link to={`/authmanage/user/post?id=${item.id}`}>修改</Link>
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleForbidden(item);
              }}
            >
              {item.forbidden ? '取消禁言' : '禁言'}
            </Button>
            <Button type="link">
              <Link to={`/authmanage/user/post?id=${item.id}`}>积分</Link>
            </Button>
          </span>
        );
      },
    },
  ];

  const [form] = Form.useForm();

  const handleSearch = res => {
    res = removeEmpty(res);
    getListData({ ...res, page: 1 });
  };

  const handleSelectRow = ids => setSelectIds(ids);

  const handleChangePage = page => {
    setPage(page);
    getListData({ ...params, page });
  };

  // 批量删除
  const handleDelPatch = () => {
    if (!selectIds?.length) {
      message.warn({ content: '请选择要删除的用户' });
      return;
    }
    Modal.confirm({
      content: '确定删除',
    });
  };

  // 批量重置密码
  const handleResetPassword = () => {
    if (!selectIds?.length) {
      message.warn({ content: '请选择要重置密码的用户' });
      return;
    }
    setResetPassVisible(true);
  };

  const handleResetFrom = () => {
    form.resetFields();
  };

  return <div>????</div>;
};

export default Page;
