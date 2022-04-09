import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Form, Select, Image, Button, Row, Col } from 'antd';
import { option, optionMap, defaultOption } from './option'
const { Option } = Select;
import { sample } from 'lodash';
import styles from "./index.less";

const Avator: FC<{ url: string }> = ({ url }) => {
  return (
    <Image
      width={200}
      src={url}
    />
  )
}

const AvatorMake: FC<{ changeNewAvator: (val: string) => void }> = ({ changeNewAvator }) => {
  const [form] = Form.useForm();
  const [avatorUrl, setAvatorUrl] = useState<string>("");
  const [initValue,] = useState(defaultOption);
  const obj = {}
  const handleChange = () => {
    let str = ""
    for (const key of Object.keys(option)) {
      str += `&${key}=${form.getFieldValue(key)}`
      obj[key] = form.getFieldValue(key)
    }
    setAvatorUrl(`https://avataaars.io/?avatarStyle=${form.getFieldValue("avatarStyle")}${str}`)
    changeNewAvator(`https://avataaars.io/?avatarStyle=${form.getFieldValue("avatarStyle")}${str}`)
  }
  useEffect(() => {
    let str = ""
    for (const [key, value] of Object.entries(option)) {
      str += `&${key}=${value[0]}`
    }
    setAvatorUrl(`https://avataaars.io/?avatarStyle=Circle${str}`)
    changeNewAvator(`https://avataaars.io/?avatarStyle=Circle${str}`)
  }, [])

  const onRandomAvator = () => {
    let str = ""
    for (const [key, value] of Object.entries(option)) {
      const randomValue = sample(value)
      str += `&${key}=${randomValue}`
      form.setFields([{ name: key, value: randomValue }])
    }
    form.setFields([{ name: "avatarStyle", value: "Circle" }])
    setAvatorUrl(`https://avataaars.io/?avatarStyle=Circle${str}`)
    changeNewAvator(`https://avataaars.io/?avatarStyle=Circle${str}`)
  }

  return (
    <div style={{ marginBottom: 20 }} className={styles.avator}>
      <Button type="primary" onClick={onRandomAvator} size="small">随机生成</Button>
      <Row align="middle">
        <Col span={18} order={4}>
          <Form
            name="basic"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            layout="inline"
            labelAlign="left"
            form={form}
            initialValues={initValue}
          >
            <Form.Item
              label="头像类型"
              name="avatarStyle">
              <Select style={{ width: 200 }} onChange={handleChange}>
                <Option value="Circle" >Circle</Option>
                <Option value="Transparent">Transparent</Option>
              </Select>
            </Form.Item>
            {
              Object.entries(option).map(([key, value]) => (
                <Form.Item
                  label={optionMap[key]}
                  name={key}
                  key={key}
                >
                  <Select style={{ width: 200 }} onChange={handleChange}>
                    {
                      value.map((item: any) => (
                        <Option value={item} key={item}>{item}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              ))
            }
          </Form>
        </Col>
        <Col span={6} order={3}>
          <Avator url={avatorUrl} />
        </Col>
      </Row>
    </div>
  );
}

export default AvatorMake;
