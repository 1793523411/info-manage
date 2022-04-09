import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Image, Button, message, Spin } from 'antd';
import { getAllAvator, delOneAvator } from '@/services/ant-design-pro/api'
import styles from './index.less'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { ERRIGURL } from '@/const/common'

const PlacLoading = () => {
  return (
    <div style={{
      width: "100px",
      height: "10px",
      position: "absolute",
      top: "50%",
      left: "50%",
    }}><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></div>
  )
}

const HidImg: FC<{ url: string; name: string; getAvator: any }> = ({ url, name, getAvator }) => {
  const [visible, setVisible] = useState(false);
  const delImg = async () => {
    const res = await delOneAvator({ params: { uid: name } })
    if ((res as any).code === 0) {
      message.success('删除成功');
      getAvator()
    } else {
      message.error((res as any)?.msg);
    }
  }
  return (
    <div className={styles["hid-img"]}>
      <Button
        type="primary"
        icon={<CloseOutlined width={"0.7em"} height={"0.7em"} />}
        size={"small"}
        className={styles["hid-img-btn"]}
        onClick={delImg} />
      <Image
        width={100}
        height={100}
        style={{}}
        src={url}
        placeholder={<PlacLoading />}
        fallback={ERRIGURL}
        preview={{
          visible,
          src: url,
          onVisibleChange: value => {
            setVisible(value);
          },
        }}
      />
    </div>
  )
}

interface ShowImgProps {
  url: string, index: number;
  currentIndex: number;
  setCurrentIndex: any;
  changeNewAvator: (url: string) => void | undefined
}

const ShowImg: FC<ShowImgProps> = ({ url, index, currentIndex, setCurrentIndex, changeNewAvator }) => {
  const clickImg = () => {
    setCurrentIndex(index)
    changeNewAvator(url)
  }
  return (
    <div className={`${styles["show-img"]} ${index === currentIndex ? styles["show-img-active"] : ""}`} onClick={clickImg}>
      <Image
        width={100}
        height={100}
        preview={false}
        placeholder={<PlacLoading />}
        fallback={ERRIGURL}
        src={url}
      />
    </div>

  );
}

interface AvatorWallProps {
  isAdmin: boolean;
  changeNewAvator?: (url: string) => void | undefined
}

const AvatorWall: FC<AvatorWallProps> = ({ isAdmin, changeNewAvator }) => {
  const [urlList, setUrlList] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const getAvator = async () => {
    const res = await getAllAvator()
    if ((res as any).code === 1) {
      message.error((res as any)?.msg);
    } else {
      setUrlList(res.data)
      console.log("res", res)
    }

  }
  useEffect(() => {
    getAvator()
  }, [])

  return (
    <div className={styles.contain}>
      {
        isAdmin ?
          urlList?.map(item => <HidImg
            url={item?.avator_url}
            key={item?.url}
            name={item?.uid}
            getAvator={getAvator}
          />) :
          urlList?.map((item, index) => <ShowImg
            url={item?.avator_url}
            index={index}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            key={item?.url}
            changeNewAvator={changeNewAvator as any}
          />)
      }
    </div>
  );
}

export default AvatorWall;
