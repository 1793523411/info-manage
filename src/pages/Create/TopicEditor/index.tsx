import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import CustomEditor from './components/CustomEditor';
import TemEditor from './components/TemEditor';
import { createTopicRecord, getTopicRecordById, updateTopicRecord } from '@/services/ant-design-pro/api'
import { useModel, history, useRouteMatch } from 'umi';
import moment from 'moment';
const { TabPane } = Tabs;

interface FormData {
  type: string;
  body: string;
}

function TopicEditor() {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  const { params: { rid } } = useRouteMatch<any>()
  const [formData, setFormData] = useState<FormData>({
    type: "",
    body: JSON.stringify({})
  } as FormData);
  const [currentType, setCurrentType] = useState('custom');
  const [showBody, setShowBody] = useState(false);
  const [isEditorMod, setIsEditorMod] = useState(true);

  useEffect(() => {
    console.log("currentType", currentType);
    console.log("formData body", JSON.parse(formData.body));
    console.log("formData", formData);
  }, [currentType, formData]);

  const getRecordList = async (topicId: string) => {
    const { data } = await getTopicRecordById({ params: { rid: topicId } })
    const handleRes = {
      type: data.topic_type,
      body: data.topic_body
    }
    console.log('handlrRes', handleRes);
    setFormData(handleRes)
    setShowBody(true);
    setIsEditorMod(false);
  }
  useEffect(() => {
    if (rid) {
      getRecordList(rid)
    } else {
      setShowBody(true);
      setIsEditorMod(true);
    }
  }, [])

  const onSubmit = async () => {
    console.log("formData", formData);
    const reqData = {
      topic_type: formData.type,
      topic_body: formData.body,
      topic_time: moment().valueOf(),
      user_name: currentUser?.username,
    }
    let res;
    if (rid) {
      res = await updateTopicRecord({ rid: rid, ...reqData })
    } else {
      res = await createTopicRecord(reqData);
    }
    if (res.code === 0) {
      history.push("/create/topic-list")
      message.success("创作成功");
    } else {
      message.error(res.msg);
    }
  }
  return (
    <PageContainer
      content=""
      header={{
        title: "编辑话题"
      }}
    >
      <Card>
        {
          showBody && (
            <>
              <Tabs defaultActiveKey={formData.type} onChange={setCurrentType}>
                <TabPane tab="图文混排" key="custom" disabled={!isEditorMod && formData.type === 'template'}>
                  <CustomEditor setFormData={setFormData} formData={formData} />
                </TabPane>
                <TabPane tab="纯文字图片" key="template" disabled={!isEditorMod && formData.type === 'custom'}>
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
