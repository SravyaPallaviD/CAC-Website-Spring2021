import React, { useState, useEffect } from "react";

import {
  Form,
  Input,
  Select,
  Button,
  Divider,
  Avatar,
  message,
  Spin,
  Alert,
  Modal,
  DatePicker,
} from "antd";

function FIReport() {
  const [form] = Form.useForm();
  const [loaderState, setLoaderState] = useState("inactive");
  return (
    <>
      <Form
        size={"medium"}
        form={form}
        onFinish={UpdateSettingsHandler}
        name="Settings"
        layout="vertical"
        labelCol={{ span: 10, offset: 0 }}
        wrapperCol={{ span: 20, offset: 0.5 }}
        style={{ width: "300px", display: "inline-block" }}
      >
        <Form.Item
          name="ReferralEntity"
          label={"Referral Entity"}
          tooltip="Organization that requested forensic interview."
        >
          <Select>
            <Option value="LE">Law Enforcement</Option>
            <Option value="CS">Children's Services</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="ReferralName"
          label={"Referral Name"}
          tooltip="Name of person who requested forensic interview."
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="ReferralDate"
          label={"Referral Date"}
          tooltip="Date request was made for interview"
        >
          <DatePicker />
        </Form.Item>

        <Form.Item>
          {loaderState === "inactive" ? (
            <div>
              {/*https://github.com/ant-design/ant-design/issues/22493 */}
              <Button disabled={formDisabled} type="primary" htmlType="submit">
                Update Settings
              </Button>
            </div>
          ) : loaderState === "active" ? (
            <Spin indicator={antIcon} />
          ) : loaderState === "success" ? (
            <CheckCircleTwoTone
              style={{ fontSize: 50 }}
              twoToneColor="#52c41a"
            />
          ) : null}

          {loaderState === "error" ? (
            <Alert
              message="Error"
              description="Something went wrong."
              type="error"
            />
          ) : null}
        </Form.Item>
      </Form>
    </>
  );
}

export default FIReport;
