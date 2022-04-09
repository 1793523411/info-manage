import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { useModel } from 'umi';
import { updateUserAvator } from '@/services/ant-design-pro/api';
import styles from "./index.less";

function EditorInfo() {
  const formRef = useRef<ProFormInstance>();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser, settings } = initialState!;

  const handleSubmit = async (values: any) => {
    try {
      await updateUserAvator({ ...currentUser, ...values })
      message.success('更新用户信息成功～');
      setInitialState({ settings: { ...settings }, currentUser: { ...currentUser, ...values } });
    } catch (error) {
      message.error('更新头像失败～');
    }

  }
  return (
    <div className={styles.outer}>
      <PageContainer>
        <Card>
          <ProForm
            title="新建表单"
            initialValues={currentUser}
            formRef={formRef}
            layout={"vertical"}
            submitter={{
              render: (props, doms) => {
                return [
                  ...doms,
                ];
              },
            }}
            onReset={async () => {
              console.log('reset')
            }}
            onFinish={handleSubmit}
          >
            <ProFormText
              width="md"
              name="username"
              label="用户名"
              disabled
              tooltip="不可编辑"
              placeholder="请输入名称"
            />
            <ProFormText
              width="md"
              name="type"
              label="用户类型"
              disabled
              tooltip="不可编辑"
              placeholder="请输入名称"
            />

            <ProFormText width="md" name="nickname" label="用户昵称" placeholder="请输入名称" />
            <ProFormTextArea width="md" name="desc" label="用户描述" />
            <ProFormText width="md" name="email" label="用户邮箱" placeholder="请输入名称" />
          </ProForm>
        </Card>
      </PageContainer>
    </div>
  );
}

export default EditorInfo;
