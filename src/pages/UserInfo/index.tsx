import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions, Image, Button, Modal, Tabs, message } from 'antd';
import { useModel, history } from 'umi';
import AvatorMake from './components/AvatorMake';
import UploadAvator from './components/uploadAvator';
import AvatorWall from '@/components/AvatorWall'
import { updateUserAvator } from '@/services/ant-design-pro/api';
import styles from './index.less'

const { TabPane } = Tabs;

function UserInfo() {
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const { currentUser, settings } = initialState!;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newAvator, setNewAvator] = useState<string>(currentUser?.avatar as string);
  const [tmpAvator, setTmpAvator] = useState<string>(currentUser?.avatar as string);
  const changeNewAvator = (val: string): void => {
    setTmpAvator(val);
  }
  const showAvatorModel = (val: boolean) => {
    setIsModalVisible(val)
  }
  const okCloseModel = async () => {
    try {
      await updateUserAvator({ ...currentUser, avatar: tmpAvator })
      message.success('更新头像成功～');
      setNewAvator(tmpAvator);
      refresh();
      setInitialState({ settings: { ...settings }, currentUser: { ...currentUser, avatar: tmpAvator } });
    } catch (error) {
      console.log("okCloseModel error", error);
      message.error('更新头像失败～');
      setNewAvator(currentUser?.avatar as string);
    }
    setIsModalVisible(false);
  }
  return (
    <PageContainer>
      <Card>
        <div className={styles["user-editor-btn"]}>
          <Button value="default" type="primary" style={{ marginRight: 10 }} onClick={() => showAvatorModel(true)}>编辑头像</Button>
          <Button value="default" type="primary" onClick={() => { history.push("/user-info/editor") }} >编辑用户信息</Button>
        </div>
        <div className={styles["user-header"]}>
          <Image
            width={200}
            src={newAvator || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
          />
        </div>
        <Descriptions title="用户信息">
          <Descriptions.Item label="用户昵称">{currentUser?.username}</Descriptions.Item>
          <Descriptions.Item label="用户名">{currentUser?.nickname}</Descriptions.Item>
          <Descriptions.Item label="用户类型">{currentUser?.type === "common" ? "普通用户" : "管理员"}</Descriptions.Item>
          <Descriptions.Item label="用户描述">{currentUser?.desc}</Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {currentUser?.email}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Modal title="更改头像"
        width={1000}
        visible={isModalVisible}
        onOk={() => okCloseModel()}
        onCancel={() => showAvatorModel(false)}
        bodyStyle={{
          padding: "0 16px",
        }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="制作头像">
            <AvatorMake changeNewAvator={changeNewAvator} />
          </TabPane>
          <TabPane tab="上传头像" key="2">
            <UploadAvator changeNewAvator={changeNewAvator} />
          </TabPane>
          <TabPane tab="推荐头像" key="3">
            <AvatorWall isAdmin={false} changeNewAvator={changeNewAvator} />
          </TabPane>
        </Tabs>
      </Modal>
    </PageContainer>
  );
}

export default UserInfo;
