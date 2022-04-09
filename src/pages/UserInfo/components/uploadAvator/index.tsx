import type { FC } from 'react';
import React from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';



const UploadAvator: FC<{ changeNewAvator: (val: string) => void }> = ({ changeNewAvator }) => {

  const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file: { type: string; size: number; }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 1) {
        message.error(info.file.response.msg);
        setLoading(false);
        return;
      }
      const url = info.fileList[info.fileList.length - 1].response.data;
      setImageUrl(url);
      changeNewAvator(url);
      setLoading(false);
    }
  };

  return (
    <div className={styles["upload-avator"]}>
      <Upload
        name="file"
        accept="image/*"
        listType="picture-card"
        className={styles["avatar-uploader"]}
        showUploadList={false}
        action="http://127.0.0.1:8080/api/v1/upload_user_avator"
        headers={{
          "token": localStorage.getItem("token") as any
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </div>
  );
}

export default UploadAvator;
