import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import CustomEditor from './components/CustomEditor';
import TemEditor from './components/TemEditor';
import { createTopicRecord } from '@/services/ant-design-pro/api'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { tmpEditor, customEditor } from './mock'
import { useModel, history } from 'umi';
const { TabPane } = Tabs;

interface FormData {
  type: string;
  body: string;
}

function TopicEditor() {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  const [formData, setFormData] = useState<FormData>({
    type: "",
    body: JSON.stringify({})
  } as FormData);
  const [currentType, setCurrentType] = useState('custom');
  const [showBody, setShowBody] = useState(false);
  const [idEditorMod,] = useState(false);
  useEffect(() => {
    console.log("currentType", currentType);
    console.log("formData body", JSON.parse(formData.body));
    console.log("formData", formData);
  }, [currentType, formData]);

  useEffect(() => {
    setFormData(customEditor)
    setShowBody(true);
  }, [])

  const onSubmit = async () => {
    console.log("formData", formData);
    const res = await createTopicRecord({
      topic_type: formData.type,
      topic_body: formData.body,
      user_name: currentUser?.username,
    })
    if (res.code === 0) {
      history.push("/create/topic-list")
      message.success("创作成功");
    } else {
      message.error(res.msg);
    }
  }
  return (
    <PageContainer>
      <Card>
        {
          showBody && (
            <>
              <Tabs defaultActiveKey={formData.type} onChange={setCurrentType}>
                <TabPane tab="图文混排" key="custom" disabled={!idEditorMod && formData.type === 'template'}>
                  <CustomEditor setFormData={setFormData} formData={formData} />
                </TabPane>
                <TabPane tab="纯文字图片" key="template" disabled={!idEditorMod && formData.type === 'custom'}>
                  <TemEditor setFormData={setFormData} formData={formData} />
                </TabPane>
              </Tabs>
              <br />
              <Button type="primary" ghost style={{ width: '100%' }} onClick={() => onSubmit()}>提交</Button>
            </>
          )
        }

      </Card>
    </PageContainer >
  );
}

export default TopicEditor;
