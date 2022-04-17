import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSwitch } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ProFormText, ProFormTextArea, StepsForm } from '@ant-design/pro-form';

import { createVideoRecord, getVideoRecordById, updateVideoRecord } from '@/services/ant-design-pro/api'
import moment from 'moment';
import { useModel, history, useRouteMatch } from 'umi';

import type { FormValue } from './split';
import { formValue, VideoCom, Loading, ImgCom, UploadVideo, UploadImg, BlankCom } from './split';

const videoMap = {
  "uploading": () => {
    return <Loading />
  },
  "unUpload": () => {
    return <BlankCom />
  },
  "uploaded": (formVal: any) => {
    return <VideoCom formVal={formVal} />
  },
}

const imgMap = {
  "uploading": () => {
    return <Loading />
  },
  "unUpload": () => {
    return <BlankCom />
  },
  "uploaded": (formVal: any) => {
    return <ImgCom formVal={formVal} />
  },
}


function VideoEditor() {
  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  const [vStatus, setVStatus] = React.useState("unUpload");
  const [imgStatus, setImgStatus] = React.useState("unUpload");
  const [formVal, setFormVal] = React.useState<FormValue>(formValue);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  const { params: { rid } } = useRouteMatch<any>()
  console.log(rid)

  const getRecordList = async (videoId: string) => {
    const { data } = await getVideoRecordById({ params: { rid: videoId } })
    const newFormalue = {
      videoBase: {
        vname: data.vname,
        vdesc: data.vdesc,
      },
      videoBody: {
        vurl: data.vurl,
        vid: data.vid,
        vmurl: data.vmurl,
        vmid: data.vmid,
      },
      videoTag: {
        vTag: data.vtag,
        vStatus: data.vstatus === 'init' ? false : true,
      }
    }
    setFormVal(newFormalue)
    setVStatus("uploaded");
    setImgStatus("uploaded");
    formMapRef.current.forEach((formInstanceRef) => {
      formInstanceRef.current?.setFieldsValue(newFormalue);
    });
  }
  useEffect(() => {
    if (rid) {
      getRecordList(rid)
    }
  }, []);
  const setFormField = (newValue: FormValue) => {
    formMapRef.current.forEach((formInstanceRef) => {
      formInstanceRef.current?.setFieldsValue(newValue);
    });
    setFormVal(newValue)
  }
  return (
    <PageContainer
      content="三步完成视频创作"
      header={{
        title: "编辑视频"
      }}>
      <Card>
        <StepsForm
          formMapRef={formMapRef}
          onFinish={async (values) => {
            console.log(values);
            const reqData = {
              "user_name": currentUser?.username,
              "vdesc": values.videoBase.vdesc,
              "vname": values.videoBase.vname,
              "vid": String(values.videoBody.vid),
              "vmid": String(values.videoBody.vmid),
              "vmurl": values.videoBody.vmurl,
              "vurl": values.videoBody.vurl,
              "vtag": values.videoTag.vTag,
              "vtime": moment().valueOf(),
              "vstatus": values.videoTag.vStatus ? "done" : "init",
            }
            let res;
            if (rid) {
              res = await updateVideoRecord({ rid: rid, ...reqData })
            } else {
              res = await createVideoRecord(reqData);
            }
            if (res.code === 0) {
              history.push("/create/editor-list")
              message.success("创作成功");
            } else {
              message.error(res.msg);
            }
          }}
        >
          <StepsForm.StepForm name="step1" title="视频信息">
            <ProFormText label="视频名称" rules={[{ required: true }]} name={['videoBase', 'vname']} />
            <ProFormTextArea label="视频描述" rules={[{ required: true }]} name={['videoBase', 'vdesc']} />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'视频内容'}>
            {
              videoMap[vStatus](formVal)
            }
            <UploadVideo setVStatus={setVStatus} formVal={formVal} setFormVal={setFormField} />
            <br />
            {
              imgMap[imgStatus](formVal)
            }
            <UploadImg setImgStatus={setImgStatus} formVal={formVal} setFormVal={setFormField} />
            <br />
            <ProFormText label="视频url" rules={[{ required: true }]} disabled name={['videoBody', 'vurl']} />
            <ProFormText label="视频id" rules={[{ required: true }]} disabled name={['videoBody', 'vid']} />
            <ProFormText label="封面url" rules={[{ required: true }]} disabled name={['videoBody', 'vmurl']} />
            <ProFormText label="封面id" rules={[{ required: true }]} disabled name={['videoBody', 'vmid']} />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step3" title={'视频标签'}>
            <ProFormSelect
              label="视频标签"
              mode="tags"
              rules={[{ required: true }]}
              name={['videoTag', 'vTag']}
            />
            <ProFormSwitch label="是否发布" name={['videoTag', 'vStatus']} />
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer >
  );
}

export default VideoEditor;
