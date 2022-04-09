import TextEditor from '@/components/TextEditor';
import { Form, Input, Select } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';


const CustomEditor: FC<any> = ({ setFormData, formData }) => {
  const [initData, setInitData] = useState(JSON.parse(formData.body));
  useEffect(() => {
    setFormData({
      type: "custom",
      body: JSON.stringify(initData)
    })
  }, [initData, setFormData])
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={initData}
        onFinish={() => { }}
        onFinishFailed={() => { }}
        onValuesChange={(val) => { setInitData({ ...initData, topicTitle: val.topicTitle }) }}
        autoComplete="off"
      >
        <Form.Item
          label="标题"
          name="topicTitle"
        >
          <Input style={{ width: '100%' }} />
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
            }} />,
        </Form.Item>
      </Form>
      <TextEditor setInitData={setInitData} initData={initData} />
    </div>
  );
}

export default CustomEditor;
