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
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import UserStore from "./StateManagement/Stores";
import adduserinfo_action from "./StateManagement/Actions";
import "antd/dist/antd.css";
import "./Main.css";
import { UpdateSettingsRequest } from "./RequestLayer";

import { LoadingOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const carriers = [
  { label: "Verizon", value: "Verizon" },
  { label: "AT@T", value: "AT@T" },
  { label: "Sprint", value: "Sprint" },
  { label: "Cricket", value: "Cricket" },
  { label: "T-Mobile", value: "T-Mobile" },
];

function Settings(props) {
  const [formDisabled, setFormDisabled] = useState(true);
  const [form] = Form.useForm();
  const [loaderState, setLoaderState] = useState("inactive");
  const [resetpwModalVisible, setResetPwModalVisble] = useState(false);
  const [managepicsModalVisible, setManagePicsModalVisble] = useState(false);

  props.setlink("settings");

  const HandleRequestSuccess = (res) => {
    setLoaderState("inactive");
    message.success("Successfully Updated Settings!");
    //update the state instantly here. We won't wait on
    //30 second interval request to getuserinfo.
    var temp = UserStore.getState();
    temp[0].FirstName = form.getFieldValue("FirstName");
    temp[0].LastName = form.getFieldValue("LastName");
    temp[0].EmailAddress = form.getFieldValue("EmailAddress");
    temp[0].PhoneNumber = form.getFieldValue("PhoneNumber");
    temp[0].Carrier = form.getFieldValue("Carrier");
    UserStore.dispatch(adduserinfo_action(temp));
    setFormDisabled(true);
  };

  const HandleRequestError = (err) => {
    setLoaderState("error");
    message.error("There was a problem. Try again later.");
    //Something has failed. Reset the values
    var temp = UserStore.getState();
    form.setFieldsValue({ FirstName: temp[0].FirstName });
    form.setFieldsValue({ LastName: temp[0].LastName });
    form.setFieldsValue({ EmailAddress: temp[0].EmailAddress });
    form.setFieldsValue({ PhoneNumber: temp[0].PhoneNumber });
    form.setFieldsValue({ Carrier: temp[0].Carrier });
    setFormDisabled(true);
  };

  const UpdateSettingsHandler = (values) => {
    setLoaderState("active");
    UpdateSettingsRequest(values, HandleRequestSuccess, HandleRequestError);
  };

  return (
    <>
      <Modal
        title="Reset Password"
        centered
        visible={resetpwModalVisible}
        onOk={() => {setResetPwModalVisble(false)}}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Password Reset Screen</p>
      </Modal>
      <Modal
        title="Manage Pictures"
        centered
        visible={managepicsModalVisible}
        onOk={() => {}}
        onCancel={() => setManagePicsModalVisble(false)}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Manage Pictures Screen</p>
      </Modal>
      <div className="cc">
        <div className="settings-avatar">
          <Avatar shape="square" size={200} icon={<UserOutlined />} />
          <div className="settings-links">
            <button
              onClick={() => setManagePicsModalVisble(true)}
              type="button"
              className="link-button"
            >
              Manage Pictures
            </button>
            <button
              onClick={() => setResetPwModalVisble(true)}
              type="button"
              className="link-button"
            >
              Reset Password
            </button>
          </div>
        </div>

        <div className="settings-form">
          <div className="settings-form-actions">
            <Button
              style={{ width: "100px" }}
              onClick={() => setFormDisabled(!formDisabled)}
            >
              Edit
            </Button>
          </div>

          <Form
            size={"large"}
            form={form}
            onFinish={UpdateSettingsHandler}
            name="Settings"
            layout="vertical"
            labelCol={{ span: 10, offset: 0 }}
            wrapperCol={{ span: 20, offset: 0.5 }}
            style={{ width: "300px", display: "inline-block" }}
          >
            <Form.Item
              initialValue={UserStore.getState()[0].FirstName}
              validatetrigger="onBlur"
              name="FirstName"
              label={"First Name"}
              rules={[
                {
                  required: true,
                  message: "Please input your first name.",
                  whitespace: true,
                },
              ]}
            >
              <Input disabled={formDisabled} />
            </Form.Item>

            <Form.Item
              initialValue={UserStore.getState()[0].LastName}
              validatetrigger="onBlur"
              name="LastName"
              label={"Last Name"}
              rules={[
                {
                  required: true,
                  message: "Please input your last name.",
                  whitespace: true,
                },
              ]}
            >
              <Input disabled={formDisabled} />
            </Form.Item>

            <Form.Item
              initialValue={UserStore.getState()[0].EmailAddress}
              validatetrigger="onBlur"
              name="EmailAddress"
              label="Primary E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input disabled={formDisabled} />
            </Form.Item>

            <Form.Item
              initialValue={UserStore.getState()[0].PhoneNumber}
              validatetrigger="onBlur"
              name="PhoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input disabled={formDisabled} />
            </Form.Item>
            <Form.Item
              initialValue={UserStore.getState()[0].Carrier}
              name="Carrier"
              label="Cellular Carrier"
              rules={[{ required: true, message: "Missing Carrier" }]}
            >
              <Select options={carriers} disabled={formDisabled} />
            </Form.Item>

            <Form.Item>
              {loaderState === "inactive" ? (
                <div>
                  {/*https://github.com/ant-design/ant-design/issues/22493 */}
                  <Button
                    disabled={formDisabled}
                    type="primary"
                    htmlType="submit"
                  >
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
        </div>
      </div>
    </>
  );
}

export default Settings;
