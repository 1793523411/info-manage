import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal, Select, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import type { UploadFile } from 'antd/lib/upload/interface';
import type { FC, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const TemEditor: FC<any> = ({ setFormData, formData }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<SetStateAction<string>>('');
  const [initData, setInitData] = useState(JSON.parse(formData.body));
  useEffect(() => {
    setFormData({
      type: "template",
      body: JSON.stringify(initData)
    })
  }, [initData, setFormData])
  const handleChange = (info: any) => {
    console.log("onChange", info)
    if (info.file.status === 'done') {
      if (info.file.response.code === 1) {
        message.error(info.file.response.msg);
        return;
      }
      const url = info.fileList[info.fileList.length - 1].response.data;
      setInitData({
        ...initData, topicImgList: initData?.topicImgList?.concat(...info.fileList.map((item: any) => {
          return { url: item?.response?.data }
        }))?.filter((item: { url?: any; }) => !!Object.keys(item).length && !!item.url)
      });
      console.log("url", url)
    }
  }
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{}}
        onFinish={() => { }}
        onFinishFailed={() => { }}
        onValuesChange={(val) => {
          setInitData({ ...initData, topicTitle: val.topicTitle })
        }}
        autoComplete="off"
      >
        <Form.Item
          label="标题"
          name="topicTitle"
        >
          <Input style={{ width: '100%' }} defaultValue={initData?.topicTitle} />
        </Form.Item>
        <Form.Item
          label="文字内容"
          name="topicText"
        >
          <TextArea rows={4} placeholder="" maxLength={Infinity} defaultValue={initData?.topicText} />
        </Form.Item>
        <Form.Item
          label="图片内容"
          name="topicImg">
          <Upload
            name="file"
            accept="image/*"
            action="http://127.0.0.1:8080/api/v1/upload_top_img"
            headers={{
              "token": localStorage.getItem("token") as any
            }}
            listType="picture-card"
            defaultFileList={initData?.topicImgList as unknown as UploadFile<{ url: string }>[]}
            onPreview={(file: UploadFile) => {
              setPreviewVisible(true);
              console.log("file", file)
              setPreviewImage(file?.response?.data || file.url);
            }}
            onChange={handleChange}
            onRemove={(v: UploadFile) => {
              console.log("remove", v)
              setInitData({
                ...initData, topicImgList: initData?.topicImgList?.filter((item: any) => item.url !== v?.response?.data)
              });
            }}
          >
            {initData?.topicImgList?.length >= 99999 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={"图片预览"}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage as string} />
          </Modal>
        </Form.Item>
        <Form.Item
          label="标签"
          name="topicTag"
        >
          <Select mode="tags"
            style={{ width: '100%' }}
            placeholder=""
            defaultValue={initData?.topicTag}
            onChange={(val) => {
              setInitData({ ...initData, topicTag: val })
            }}
          />,
        </Form.Item>
      </Form>
    </div>
  );
}

export default TemEditor;
