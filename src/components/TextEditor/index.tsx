import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { FC, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './index.less';
import hljs from 'highlight.js';

import 'highlight.js/styles/github.css';



const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      ['link', 'image', 'code-block'],
      ['clean'],                           // remove formatting button
    ],
    handlers: {
      'image': function imageHandler(value: any) {
        (document.querySelector('input[type="file"]') as any).click();

        console.log(document.querySelector(".upload"))
        console.log("imgHndler", value)
      }

    },
  },
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'code-block', 'color', 'background', 'font'
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handlerCode = (code: any) => {
  return hljs.highlightAuto(code as any).value
}

const TextEditor: FC<any> = ({ initData, setInitData }) => {
  const [value, setValue] = useState(initData.textValue || "");
  const textInput = useRef(null);
  const onChange = (val: SetStateAction<string>) => {
    const content = handlerCode(val)
    console.log('content', content);
    setValue(val);

    setInitData({ ...initData, textValue: val });
  }
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
    const quillEditor = (textInput!.current as any).getEditor()
    if (info.file.status === 'done') {
      if (info.file.response.code === 1) {
        message.error(info.file.response.msg);
        return;
      }
      const url = info.fileList[info.fileList.length - 1].response.data;
      console.log("url", url, textInput)
      const range = quillEditor.getSelection()

      // this part the image is inserted
      // by 'image' option below, you just have to put src(link) of img here.
      quillEditor.insertEmbed(range.index, 'image', url)
      quillEditor.insertEmbed(range.index, '\n')
    }
  };
  useEffect(() => {
    setValue(value);
    hljs.highlightAll();
  }, [])
  return (
    <div className={styles.editor}>
      <Upload name="file"
        accept="image/*"
        listType="picture-card"
        showUploadList={false}
        action="http://127.0.0.1:8080/api/v1/upload_top_img"
        headers={{
          "token": localStorage.getItem("token") as any
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        className={styles.upload}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <ReactQuill
        ref={textInput}
        className={styles.editor}
        theme="snow"
        value={value}
        modules={modules}
        formats={formats}
        onChange={onChange} />
    </div >
  );
}

export default TextEditor;
