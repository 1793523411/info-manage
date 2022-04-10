import { message, Tag, Modal } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import type { FC } from 'react';
import { useEffect } from 'react';
import { history } from 'umi';
import { delVideoRecordById, updateVideoRecord } from '@/services/ant-design-pro/api';
import styles from "./index.less"

import type { TableListItem } from './index'
const { confirm } = Modal;

const genRandomColor = () => {
  const colorArr = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
  return colorArr[Math.floor(Math.random() * colorArr.length)]
}

export const VideoCom: FC<any> = ({ vurl, vmurl, rid }) => {
  useEffect(() => {
    new Player({
      id: 'vs' + rid,
      url: vurl,
      poster: vmurl,
      autoplay: false,
      volume: 0.3,
      playsinline: true,
      controlPlugins: [
        volume,
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div id={`vs${rid}`} />
  )
}

const Editor: FC<any> = ({ rid }) => {
  return <a key="link" onClick={() => {
    history.push("/create/editor-video/" + rid)
  }}>编辑</a>
}

const PublishCom: FC<any> = ({ record, action }) => {
  const canPub = record?.vstatus === "init"
  return <a key="link2" style={{
    color: !canPub ? '#ccc' : "", cursor: !canPub ? 'default' : ''
  }} onClick={async () => {
    if (!canPub) {
      return;
    };
    confirm({
      title: '确认发布该视频？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const res = await updateVideoRecord({ ...record, vstatus: "done" });
        if (res.code === 0) {
          message.success("发布成功");
          action.reload()
        } else {
          message.error(res.msg || "发布失败");
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }}> 发布</a >
}

const DelCom: FC<any> = ({ rid, action }) => {
  return <a key="link3" onClick={async () => {
    confirm({
      title: '确认删除改记录？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        const res = await delVideoRecordById({ params: { rid } });
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
    title: '视频名称',
    align: 'center',
    width: 180,
    ellipsis: true,
    dataIndex: 'vname',
    render: (_) => <div>{_}</div>,
  },
  {
    title: '视频描述',
    dataIndex: 'vdesc',
    align: 'center',
    ellipsis: true,
    width: 180,
    render: (_) => <div>{_}</div>,
  },
  {
    title: '视频状态',
    width: 100,
    dataIndex: 'vstatus',
    align: 'center',
    initialValue: 'init',
    valueEnum: {
      init: { text: '草稿', status: 'Default' },
      done: { text: '已发布', status: 'Success' },
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
    dataIndex: 'vtime',
    valueType: 'date',
  },
  {
    title: '视频标签',
    align: 'center',
    dataIndex: 'vtag',
    render: (_) => (<div>
      {(_ as string[]).map((item: string) => {
        return <Tag color={genRandomColor()} key={item}>{item}</Tag>
      })}
    </div>) as any,
  },
  {
    title: '视频内容',
    dataIndex: 'vurl',
    align: 'center',
    width: 200,
    ellipsis: true,
    render: (_, record) => (
      <div className={styles["video-cell"]}>
        <VideoCom vurl={record.vurl} vmurl={record.vmurl} key={record.rid} rid={record.rid} />
      </div>
    )
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    align: 'center',
    valueType: 'option',
    render: (_, record, index, action) => [
      <Editor rid={record.rid} key={record.rid} />,
      <PublishCom record={record} key={record.rid} action={action} />,
      <DelCom rid={record.rid} key={record.rid} action={action} />,
    ],
  },
];
