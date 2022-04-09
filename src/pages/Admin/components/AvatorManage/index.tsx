import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message, Upload } from 'antd';
import AvatorWall from '@/components/AvatorWall';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

function AvatorManage() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [key, setKey] = React.useState<number>(Math.random());

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
    console.log("info", info)
    if (info.file.status === 'done') {
      if (info.file.response.code === 1) {
        message.error(info.file.response.msg);
        setLoading(false);
        return;
      }
      message.success("上传成功");
      setLoading(false);
      setKey(Math.random());
    }
  };
  return (
    <PageContainer>
      <Card>
        <Upload
          name="file"
          accept="image/*"
          action="http://127.0.0.1:8080/api/v1/avator_add"
          showUploadList={false}
          headers={{
            "token": localStorage.getItem("token") as any
          }}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {
            loading ? <Button icon={<LoadingOutlined />}>上传中···</Button> : <Button icon={<UploadOutlined />}>点击上传</Button>
          }
        </Upload>,
        <AvatorWall isAdmin={true} key={key} />
      </Card>
    </PageContainer >
  );
}

export default AvatorManage;
