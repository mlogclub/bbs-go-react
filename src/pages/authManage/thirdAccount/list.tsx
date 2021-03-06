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

  // ??????
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

  // ????????????
  const renderPopoverContent = (item: UserItem) => {
    return (
      <div className={css.detailContent}>
        <p>
          <strong>?????????</strong>
          {item.score}
        </p>
        <p>
          <strong>????????????</strong>
          {item.topicCount}
        </p>
        <p>
          <strong>????????????</strong>
          {item.commentCount}
        </p>
        <p>
          <strong>?????????</strong>
          {item.homePage}
        </p>
        <p>
          <strong>?????????</strong>
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
      title: '??????',
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
      title: '??????',
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
      title: '??????',
      dataIndex: 'nickname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: '??????',
      dataIndex: 'roles',
      render: val => val && val.join('|'),
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '????????????',
      dataIndex: 'emailVerified',
      render: val => (val ? '???' : '???'),
    },
    {
      title: '??????????????????',
      dataIndex: 'forbiddenEndTime',
      render: val => {
        if (val === -1) {
          return '????????????';
        }
        return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '??????',
      dataIndex: 'status',
      render: val => {
        if (val === 1) {
          return <DangerTag>??????</DangerTag>;
        }
        return '??????';
      },
    },
    {
      title: '??????',
      dataIndex: 'action',
      width: 120,
      align: 'center',
      render: (val, item) => {
        return (
          <span className="action-btn-group" style={{ justifyContent: 'space-between' }}>
            <Button type="link">
              <Link to={`/authmanage/user/post?id=${item.id}`}>??????</Link>
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleForbidden(item);
              }}
            >
              {item.forbidden ? '????????????' : '??????'}
            </Button>
            <Button type="link">
              <Link to={`/authmanage/user/post?id=${item.id}`}>??????</Link>
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

  // ????????????
  const handleDelPatch = () => {
    if (!selectIds?.length) {
      message.warn({ content: '???????????????????????????' });
      return;
    }
    Modal.confirm({
      content: '????????????',
    });
  };

  // ??????????????????
  const handleResetPassword = () => {
    if (!selectIds?.length) {
      message.warn({ content: '?????????????????????????????????' });
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
