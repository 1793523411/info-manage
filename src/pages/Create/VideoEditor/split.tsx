import { FileImageOutlined, LoadingOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { message, Spin, Image } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import type { FC } from "react";
import { useEffect } from "react";
import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import playbackRate from 'xgplayer/dist/controls/playbackRate';
import styles from "./index.less";

export type FormValue = {
  videoBase: {
    vname: string;
    vdesc: string;
  };
  videoBody: {
    vurl: string;
    vid: string;
    vmurl: string;
    vmid: string;
  };
  videoTag: {
    vTag: any[];
    vStatus: boolean;
  }
};
export const formValue: FormValue = {
  videoBase: {
    vname: '',
    vdesc: '',
  },
  videoBody: {
    vurl: '',
    vid: '',
    vmurl: '',
    vmid: '',
  },
  videoTag: {
    vTag: [],
    vStatus: false
  }
};

export const VideoCom: FC<any> = ({ formVal }) => {
  console.log("formVal", formVal)
  useEffect(() => {
    new Player({
      id: 'vs' + formVal.videoBody.rid,
      url: formVal.videoBody.vurl,
      poster: formVal.videoBody.vmurl,
      autoplay: false,
      volume: 0.3,
      playsinline: true,
      controlPlugins: [
        volume,
        playbackRate
      ],
      playbackRate: [0.5, 0.75, 1, 1.5, 2] //传入倍速可选数组
    });
  }, [formVal])
  return (
    <div id={`vs${formVal.videoBody.rid}`} />
  )
}

export const Loading = () => {
  return (
    <div style={{ width: 600, height: 337, position: 'relative', }} >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        style={{ position: 'absolute', top: "50%", left: "50%" }}
      />
    </div>
  )
}

export const ImgCom: FC<any> = ({ formVal }) => {
  return (
    <div>
      <Image
        width={600}
        height={337}
        src={formVal.videoBody.vmurl}
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UploadVideo: FC<any> = ({ setVStatus, formVal, setFormVal }) => {
  const beforeUpload = (file: { type: string; size: number; }) => {
    const isLt2M = file.size / 1024 / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return !!isLt2M;
  }

  const handleChange = (info: any) => {
    setVStatus("uploading");
    console.log('info', info)
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 1 || !info.file.response.data.vurl) {
        message.error(info.file.response.msg);
        setVStatus("unUpload");
        return;
      }
      const url = info.fileList[0].response.data;
      const { vid, vurl } = info.fileList[info.fileList.length - 1].response.data;
      const newFormVal = {
        videoBase: { ...formVal.videoBase },
        videoBody: {
          ...formVal.videoBody,
          vid,
          vurl
        }
      }
      setFormVal(newFormVal)
      console.log("url", url)
      setVStatus("uploaded");

    }
  };
  return (
    <div className={styles.video_loading}>
      <Dragger
        name="file"
        accept="video/*"
        listType="picture-card"
        action="http://127.0.0.1:8080/api/v1/upload_video"
        headers={{
          "token": localStorage.getItem("token") as any
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}>
        <p className="ant-upload-drag-icon">
          <VideoCameraAddOutlined />
        </p>
        <p className="ant-upload-text">上传视频</p>
      </Dragger>
    </div>

  )
}

export const UploadImg: FC<any> = ({ setImgStatus, formVal, setFormVal }) => {
  const beforeUpload = (file: { type: string; size: number; }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info: any) => {
    if (info.fileList.length > 1)
      setImgStatus("uploading");
    console.log('info', info)
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 1 || !info.file.response.data.vmurl) {
        message.error(info.file.response.msg);
        setImgStatus("unUpload");
        return;
      }
      const { vmid, vmurl } = info.fileList[info.fileList.length - 1].response.data;
      const newFormVal = {
        videoBase: { ...formVal.videoBase },
        videoBody: {
          ...formVal.videoBody,
          vmid,
          vmurl
        }
      }
      console.log("vmid, vmurl ", vmid, vmurl)
      setImgStatus("uploaded");
      setFormVal(newFormVal)
    }
  };
  return (
    <Dragger
      name="file"
      multiple={false}
      accept="image/*"
      listType="picture-card"
      showUploadList={false}
      action="http://127.0.0.1:8080/api/v1/upload_video_img"
      headers={{
        "token": localStorage.getItem("token") as any
      }}
      beforeUpload={beforeUpload}
      onChange={handleChange}>
      <>
        <p className="ant-upload-drag-icon">
          <FileImageOutlined />
        </p>
        <p className="ant-upload-text">上传视频封面</p></>
    </Dragger>
  )
}

export const BlankCom = () => {
  return (
    <div style={{ width: 600, height: 337, position: 'relative', border: "1px solid #eee" }} >
      <Spin
        indicator={<VideoCameraOutlined style={{ fontSize: 24 }} />}
        style={{ position: 'absolute', top: "50%", left: "50%" }}
      />
    </div>
  )
}
