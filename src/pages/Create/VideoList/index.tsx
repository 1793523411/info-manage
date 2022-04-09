import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getVideoRecord } from "@/services/ant-design-pro/api"
import { columns } from './config'
import { history } from 'umi';

export type TableListItem = {
  rid: string;
  user_name: string;
  vname: string;
  vdesc: string;
  vurl?: string;
  vid?: string;
  vmurl?: string;
  vmid?: string;
  vtag: string[];
  vtime: number;
  vstatus: string;
};

function VideoList() {
  return (
    <PageContainer>
      <Card>
        <ProTable<TableListItem>
          columns={columns}
          request={async (params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const res = await getVideoRecord({ page: String(params!.current), pageSize: String(params!.pageSize) })
            console.log(params, sorter, filter);
            return Promise.resolve({
              data: res.data.data,
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
              history.push('/create/editor-video')
            }}>新增记录</Button>,
          ]}
        />
      </Card>
    </PageContainer >
  );
}

export default VideoList;
