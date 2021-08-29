import { useEffect, useState } from 'react';
import { Spin, Modal, Tabs, Input, Upload } from 'antd';
import Vditor from 'vditor';
import { UploadOutlined } from '@ant-design/icons';
import 'vditor/src/assets/scss/index.scss';
import css from './index.module.scss';

const Veditor = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [editor, setEditor] = useState<Vditor | null>(null);
  // showUploadModal
  let toolbar = [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'upload',
    // 'record',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    'edit-mode',
    'content-theme',
    'code-theme',
    'export',
    {
      name: 'more',
      toolbar: ['fullscreen', 'both', 'preview', 'info', 'help'],
    },
    {
      hotkey: '⇧⌘S',
      name: 'sponsor',
      tipPosition: 'n',
      tip: '添加图片',
      className: 'right',
      icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
      click() {
        setShowUploadModal(true);
      },
    },
  ];
  useEffect(() => {
    setLoading(true);
    const vditor = new Vditor('editor-wrap', {
      width: '100%',
      minHeight: 300,
      toolbar: toolbar,
      preview: {
        maxWidth: 1280,
      },
      after: () => {
        vditor.focus();
        setLoading(false);
        setEditor(vditor);
      },
    });
  }, []);

  return (
    <div className={css.veditorWrap}>
      {loading && (
        <div className="p-20" style={{ textAlign: 'center' }}>
          <Spin></Spin>
        </div>
      )}
      <div id="editor-wrap"></div>
      {/* 插入图片、上传图片 */}
      <Modal
        visible={showUploadModal}
        onOk={() => {
          setShowUploadModal(false);
          editor?.insertValue(
            '![Alt text](http://static.dm.cc/upload/e2bdff7e017949338f604eddc8aba508.jpg "Optional title")',
            true,
          );
        }}
        onCancel={() => {
          setShowUploadModal(false);
        }}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="上传文件" key="1">
            <section className="mb-10">
              <Input placeholder="标题" />
            </section>
            <section>
              <Input placeholder="图片地址" />
            </section>
          </Tabs.TabPane>
          <Tabs.TabPane tab="网络地址" key="2">
            <Upload />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Veditor;
