import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import CustomEditor from './components/CustomEditor';
import TemEditor from './components/TemEditor';
const { TabPane } = Tabs;

interface FormData {
  type: string;
  body: string;
}

function TopicEditor() {
  const [formData, setFormData] = useState<FormData>({
    type: "custom",
    body: JSON.stringify({})
  } as FormData);
  const [currentType, setCurrentType] = useState('custom');
  useEffect(() => {
    console.log("currentType", currentType);
    console.log("formData", JSON.parse(formData.body));
    console.log("formData", formData);
  }, [currentType, formData]);

  const onSubmit = () => {
    console.log("formData", formData);
  }
  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="custom" onChange={setCurrentType}>
          <TabPane tab="图文混排" key="custom" >
            <CustomEditor setFormData={setFormData} />
          </TabPane>
          <TabPane tab="纯文字图片" key="template">
            <TemEditor setFormData={setFormData} />
          </TabPane>
        </Tabs>
        <br />
        <Button type="primary" ghost style={{ width: '100%' }} onClick={() => onSubmit()}>提交</Button>
      </Card>
    </PageContainer >
  );
}

export default TopicEditor;
