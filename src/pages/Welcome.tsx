import React, { useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const App = () => {
  const [fileList, setFileList] = React.useState<any[]>([]);
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    } else {
      console.log('???')
    }
    let fileListNew = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileListNew = fileListNew.slice();

    // 2. Read from response and show file link
    fileListNew = fileList.map(file => {
      console.log('file', file)
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileListNew);
  };

  const createFileObject = (file: any, key: number, thumbUrl: number) => {
    const fileObject = {
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      name: file.name,
      size: file.size,
      type: file.type,
      uid: key,
      originFileObj: file,
      percent: 100,
      key: key,
      response: { hash: key, key: key },
      status: 'done',
      thumbUrl: thumbUrl,
    }
    console.log('fileObject', fileObject)
    return fileObject
  }
  const handleClickPaste = async () => {
    try {
      const read = await (navigator.clipboard as any).read(); // 此 API 较新，类型不完善（typescript4.4- 无此方法）
      const foundImageMimeType = read[0].types.find((val: string) => val.startsWith('image/png'));
      if (foundImageMimeType) {
        const blob = await read[0].getType(foundImageMimeType);
        // 截止 Chrome98 / Safari15，仍然不支持本地文件上传
        const file = new File([blob], 'screenshot.png', {
          type: foundImageMimeType,
        });
        console.log('file', file);
        // manuallyUpload(file); // => 上传文件并添加到 fileList
        // fileList.push(createFileObject(file, Math.random(), Math.random()));
        setFileList([...fileList, createFileObject(file, Math.random(), Math.random())]);
      } else {
        message.info('剪切板中没有 png 类型图片');
      }
    } catch (e) {
      const err = e as Error;
      let errTips = '';
      if (err.name === 'NotAllowedError') {
        errTips = '您没有授权使用剪切板，Chrome 用户请刷新按钮右边的「锁」形 icon 打开权限';
      } else if (err.name === 'DataError') {
        errTips = '不支持读取剪切板中的图片文件，请按 Ctrl+V';
      } else {
        errTips = '浏览器可能不支持读取剪切板，请手动上传';
      }
      message.error(`${errTips} (${err.message})`, 5);
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handleClickPaste);
    return () => {
      window.removeEventListener('paste', handleClickPaste);
    }
  }, []);
  return (
    <Upload
      action='http://127.0.0.1:8080/api/v1/upload_user_avator'
      onChange={handleChange}
      multiple={true}
      fileList={fileList}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
}


// class App2 extends React.Component {
//   state = {
//     fileList: [],
//   };

//   handleChange = (info: { fileList: any; }) => {
//     let fileList = [...info.fileList];

//     // 1. Limit the number of uploaded files
//     // Only to show two recent uploaded files, and old ones will be replaced by the new
//     fileList = fileList.slice();

//     // 2. Read from response and show file link
//     fileList = fileList.map(file => {
//       console.log('file', file)
//       if (file.response) {
//         // Component will show file.url as link
//         file.url = file.response.url;
//       }
//       return file;
//     });

//     this.setState({ fileList });
//   };

//   render() {
//     const props = {
//       action: 'http://127.0.0.1:8080/api/v1/upload_user_avator',
//       onChange: this.handleChange,
//       multiple: true,
//     };
//     return (
//       <Upload {...props} fileList={this.state.fileList}>
//         <Button icon={<UploadOutlined />}>Upload</Button>
//       </Upload>
//     );
//   }
// }

export default App;
