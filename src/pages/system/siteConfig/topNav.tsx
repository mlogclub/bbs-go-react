import { useState } from 'react';
import { Form, Button, Modal, Card, Table, Input, Tooltip } from 'antd';
import { ColumnProps } from 'antd/es/table';
import cls from 'classnames';
import { SysConfigSiteNavs } from '@/utils/constant';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { UserConfig } from './util';

import css from './index.module.scss';

interface NavItem {
  index: number;
  title: string;
  url: string;
}

const Page = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [configData, save, loading] = UserConfig(form, true);

  const dataSource = (configData?.config?.[SysConfigSiteNavs] || []).map((e, i) => ({ ...e, index: i }));

  const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

  const saveSiteNav = nav => {
    save({
      [SysConfigSiteNavs]: nav.map(ele => ({ title: ele.title, url: ele.url })),
    });
  };
  // 删除
  const handleDel = item => {
    Modal.confirm({
      content: `确定要删除 ${item.title} ？`,
      onOk: () => {
        dataSource.splice(item.index, 1);
        saveSiteNav(dataSource);
      },
    });
  };

  const columns: ColumnProps<NavItem>[] = [
    {
      dataIndex: 'sort',
      width: 50,
      render: () => <DragHandle />,
    },
    {
      title: '排序',
      width: 80,
      dataIndex: 'index',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '地址',
      dataIndex: 'url',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (val, item, i) => (
        <Tooltip title="删除">
          <Button
            type="text"
            icon={<DeleteFilled />}
            danger
            className="table-row-dragging-hidden"
            onClick={handleDel.bind(null, item)}
          ></Button>
        </Tooltip>
      ),
    },
  ];

  const TableSortableItem = SortableElement(props => <tr {...props} />);
  const TableSortableContainer = SortableContainer(props => <tbody {...props} />);

  const onSortEnd = ({ oldIndex, newIndex, nodes }, e) => {
    console.log(oldIndex, newIndex, nodes);
    if (oldIndex !== newIndex) {
      const newData = [...dataSource];
      const item = newData.splice(oldIndex, 1)[0];
      newData.splice(newIndex, 0, item);
      saveSiteNav(newData);
    }
  };

  const draggableContainer = props => (
    <TableSortableContainer
      useDragHandle
      disableAutoscroll
      helperClass={cls('table-row-dragging', css.draggingWrap)}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const draggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <TableSortableItem index={index} {...restProps} />;
  };

  const handleAdd = () => {
    setVisible(true);
  };

  const handleSubmitNav = () => {
    form.validateFields().then(res => {
      dataSource.push({ ...res });
      setVisible(false);
      save({
        [SysConfigSiteNavs]: dataSource,
      });
    });
  };

  return (
    <Card bordered={false} className="page-card-wrap page-post-from" loading={loading}>
      <div className="post-header">
        <Button type="primary" icon={<PlusOutlined />} shape="round" onClick={handleAdd}>
          添加
        </Button>
      </div>
      <Table<NavItem>
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="index"
        components={{
          body: {
            wrapper: draggableContainer,
            row: draggableBodyRow,
          },
        }}
      ></Table>

      <Modal visible={visible} title="添加" onOk={handleSubmitNav} onCancel={() => setVisible(false)} destroyOnClose>
        <Form form={form} preserve={false}>
          <Form.Item label="标题" name="title" required rules={[{ required: true, message: '请填写导航标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="url" required rules={[{ required: true, message: '请填写导航地址' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default Page;
