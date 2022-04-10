import type { ProColumns } from '@ant-design/pro-table';
import { message, Modal, Tag } from 'antd';
import type { FC } from 'react';
import type { TableListItem } from './index';
import { history } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { delTopRecordById } from '@/services/ant-design-pro/api';

const { confirm } = Modal;

const genRandomColor = () => {
  const colorArr = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
  return colorArr[Math.floor(Math.random() * colorArr.length)]
}

const typeMap = {
  'template': '纯文字图片',
  'custom': '图文混排'
}

const Editor: FC<any> = ({ rid }) => {
  return <a key="link" onClick={() => {
    history.push("/create/topic-editor/" + rid)
  }}>编辑</a>
}


const DelCom: FC<any> = ({ rid, action }) => {
  return <a key={rid} onClick={async () => {
    confirm({
      title: '确认删除改记录？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const res = await delTopRecordById({ params: { rid } });
        if (res.code === 0) {
          message.success("删除成功");
          action.reload()
        } else {
          message.error(res.msg || "删除失败");
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }}>删除</a>
}


export const columns: ProColumns<TableListItem>[] = [
  {
    title: '记录id',
    width: 100,
    dataIndex: 'rid',
    align: 'center',
    ellipsis: true,
    copyable: true,
    render: (_) => <div>{_}</div>,
  },
  {
    title: '话题名称',
    align: 'center',
    width: 180,
    ellipsis: true,
    dataIndex: 'topicTitle',
    render: (_) => <div>{_}</div>,
  },
  {
    title: '话题类型',
    align: 'center',
    width: 180,
    ellipsis: true,
    dataIndex: 'topic_type',
    render: (_, record) => {
      console.log('record', record);
      return (
        <div>{typeMap[record.topic_type]}</div>
      )
    },
  },
  {
    title: '创作者',
    dataIndex: 'user_name',
    align: 'center',
    width: 150,
    ellipsis: true,
    render: (_) => <div>{_}</div>,
  },
  {
    title: (
      <>
        创建时间
      </>
    ),
    width: 140,
    key: 'since',
    align: 'center',
    dataIndex: 'topic_time',
    valueType: 'date',
  },
  {
    title: '视频标签',
    align: 'center',
    dataIndex: 'topicTag',
    render: (_) => {
      return (
        <div>
          {(_ as string[])?.map((item: string) => {
            return <Tag color={genRandomColor()} key={item}>{item}</Tag>
          })}
        </div>
      )
    },
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    align: 'center',
    valueType: 'option',
    render: (_, record, index, action) => [
      <Editor rid={record.rid} key={record.rid} />,
      <DelCom rid={record.rid} key={record.rid} action={action} />,
    ],
  },
];

