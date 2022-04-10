import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Card, Button } from 'antd';
import { columns } from './config'
import { history } from 'umi';
import { getTopicRecord } from '@/services/ant-design-pro/api';
import _ from 'lodash';

export interface TableListItem {
  rid: string;
  user_name: string;
  topicTag: string[]
  topicTitle: string;
  topic_type: string;
  topic_time: number;
}

const handleTopicRecord = (recordLsit: any[]) => {
  const resRecord: { [x: string]: any;[x: number]: any;[x: symbol]: any; }[] = [];
  recordLsit.some((item: any) => {
    const obj = {
      ..._.omit(item, 'topic_body')
    };
    const topicBody = JSON.parse(item.topic_body)
    obj.topicTag = topicBody.topicTag
    obj.topicTitle = topicBody.topicTitle
    resRecord.push(obj)
    return false;
  })
  return resRecord;
}

function TopicList() {
  return (
    <PageContainer>
      <Card>
        <ProTable<TableListItem>
          columns={columns}
          request={async (params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const res = await getTopicRecord({ page: String(params!.current), pageSize: String(params!.pageSize) })
            console.log(params, sorter, filter);
            const handleRecord = handleTopicRecord(res.data.data)
            return Promise.resolve({
              data: handleRecord as TableListItem[],
              total: res.data.count,
              success: true,
            });
          }}
          rowKey="key"
          pagination={{
            showQuickJumper: true,
          }}
          search={false}
          dateFormatter="string"
          headerTitle="视频记录"
          toolBarRender={() => [
            <Button key="add" type="primary" onClick={() => {
              history.push('/create/topic-editor')
            }}>新增记录</Button>,
          ]}
        />
      </Card>
    </PageContainer >
  );
}

export default TopicList;
