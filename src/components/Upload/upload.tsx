import { useEffect, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { UploadProps, UploadChangeParam, RcFile } from 'antd/es/upload';
import { uploadFile } from '@/services/common';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import CroperImage from '@/components/CropperImg/cropperImage';
import { fileToBase64 } from '@/utils/util';

import './upload.scss';

export type AssetItem = {
  url: string;
};

export const MaxSize = 2; // mb

export interface MyUploadProps {
  onSuccess?: (item: AssetItem) => void;
  onFail?: (err?: any) => void;
  showCrop?: boolean;
  maxSize?: number; // -1 不限制大小
  onChange?: (url?: string) => void;
  value?: string;
  customAction?: (file: Blob) => Promise<any>;
}

const MyUpload = (props: MyUploadProps & UploadProps) => {
  const { onSuccess, onFail, showCrop, maxSize, onChange, value, name } = props;

  const [cropper, setCropper] = useState<Cropper>();
  const [tmpImg, setTmpImg] = useState<string>();
  const [cropVisible, setCropVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPrevieVisible] = useState<boolean>(false);
  // const [cropImg, setCropImg] = useState<Blob>();
  const [uploading, setUploading] = useState<boolean>();

  const defaultConfig = {
    showUploadList: true,
    maxCount: 1,
  };

  const triggerChange = url => {
    onChange?.(url);
  };
  const customRequest = (file: Blob) => {
    setUploading(true);
    const formData = new FormData();
    formData.append(name || 'file', file, fileList[0]?.name);
    return uploadFile<AssetItem>(formData)
      .then(res => {
        const { success, data } = res.data;
        if (success) {
          onSuccess?.(data);
          triggerChange(data.url);
        } else {
          onFail?.(res.data);
        }
      })
      .catch(err => {
        setUploading(false);
        onFail?.(err);
      })
      .finally(() => setUploading(false));
  };

  const handleBeforeUpload = (file: RcFile) => {
    const size = file.size / 1024 / 1024;
    if (maxSize !== -1) {
      if (size > (maxSize || MaxSize)) {
        message.error({ content: '文件不允许超出2MB' });
      }
    }
    return false;
  };

  const handleChange = ({ file, fileList }: UploadChangeParam) => {
    if (fileList[0]?.originFileObj) {
      if (showCrop) {
        fileToBase64(fileList[0].originFileObj)
          .then(res => {
            setTmpImg(res);
            setCropVisible(true);
          })
          .catch(err => {
            message.error({ content: err });
          });
      } else {
        customRequest(fileList[0]?.originFileObj);
      }
    } else {
      triggerChange('');
      setTmpImg('');
    }
  };

  const handleOk = () => {
    cropper?.getCroppedCanvas().toBlob(res => {
      if (!res) {
        return;
      }
      setUploading(true);
      fileToBase64(res)
        .then(result => {
          // const newList = fileList.map(item => ({
          //   ...item,
          //   thumbUrl: result,
          // }));
          // 上传文件
          customRequest(res).then(() => {
            setCropVisible(false);
          });
        })
        .catch(err => setUploading(false));
    });
  };

  // 预览
  const handlePreview = () => {
    setPrevieVisible(true);
  };

  const uploadButton = (
    <div>
      {uploading ? (
        <LoadingOutlined />
      ) : (
        <>
          <PlusOutlined />
          <p>Upload</p>
        </>
      )}
    </div>
  );

  useEffect(() => {
    if (value) {
      setFileList([
        {
          url: value,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  console.log(value, fileList);
  return (
    <>
      <Upload
        {...defaultConfig}
        {...props}
        // customRequest={customRequest}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}
        onPreview={handlePreview}
        className="dm-upload"
        fileList={fileList}
      >
        {fileList.length > 0 ? null : uploadButton}
      </Upload>
      <div>
        {/* 裁剪弹框 */}
        <Modal
          width={800}
          visible={cropVisible}
          onOk={handleOk}
          onCancel={() => {
            setCropVisible(false);
            setTmpImg('');
            setFileList([]);
          }}
          wrapClassName="dm-upload-crop-modal"
          okButtonProps={{ loading: uploading }}
        >
          <CroperImage
            src={tmpImg}
            onReady={instance => {
              setCropper(instance);
            }}
          />
        </Modal>

        {/* 预览弹框 */}
        <Modal
          title="预览"
          visible={previewVisible}
          footer={null}
          onOk={() => setPrevieVisible(false)}
          onCancel={() => setPrevieVisible(false)}
          wrapClassName="dm-upload-preview-modal"
        >
          <img src={value} alt="" className="preview-img" />
        </Modal>
      </div>
    </>
  );
};

export default MyUpload;
