import React, { useState } from "react";
import { Form, Input, Select, Button, Alert, Spin, message, Space } from "antd";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import "./Gateway.css";
import axios from "axios";
const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const carriers = [
  { label: "Verizon", value: "Verizon" },
  { label: "AT@T", value: "AT@T" },
  { label: "Sprint", value: "Sprint" },
  { label: "Cricket", value: "Cricket" },
  { label: "T-Mobile", value: "T-Mobile" },
];

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [loaderState, setLoaderState] = useState("inactive");
  const [captchaValid, setCaptchaValid] = useState(false);

  const HandleRequestSuccess = () => {
    

    setLoaderState("success");
    
    message.success('You have successfully created an account.',2.5);

    form.resetFields();
    
    setTimeout(function (){

      message.loading('You are being redirected to the login page...', 2)

      window.location.replace('/login');

      console.log("request success");
    
    }, 5000);
    
  };

  const HandleRequestError = () => {
    form.resetFields();
    setLoaderState("error");
    setTimeout(() => {
      setLoaderState("inactive");
    }, 4000);

    console.log("request failure");

    
  };

  const onFinish = (values) => {
    setLoaderState("active");
    values["Password"] = btoa(values["Password"]);
    values["ConfirmPassword"] = btoa(values["Password"]);

    axios
      .post("/public/api/request_account", values, null)
      .then((res) => {
        HandleRequestSuccess(res);
      })
      .catch((err) => {
        HandleRequestError(err);
      });

    console.log("Received values of form: ", values);
  };

  const handleCaptchaSuccess = (token) => {
    setCaptchaValid(true);
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <Form
          size={"medium"}
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <GoogleReCaptcha onVerify={handleCaptchaSuccess} />

          <Form.Item>
            <div>
              <Link to="/login">
                <Button
                  size={"medium"}
                  style={{ float: "left" }}
                  icon={<ArrowLeftOutlined />}
                ></Button>
              </Link>
            </div>
            <Title level={4}>Request Account</Title>
          </Form.Item>
          <Form.Item
            validateTrigger="onBlur"
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
            <Input />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
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
            <Input />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            name="EmailAddress"
            label="Primary E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail.",
              },
              {
                required: true,
                message: "Please input your E-mail.",
              },
            
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            name="Password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password.",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            name="ConfirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password.",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("Password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match."
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            validateTrigger="onBlur"
            name="PhoneNumber"
            label="Phone Number"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              ({ setFieldsValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  value = value.toString();
                  value = value.replace(/[^\d]/g, "");
                  
                  setFieldsValue({ PhoneNumber: value });
                  if (value.length > 10) {
                    value = value.substring(0, value.length - 1);
                    setFieldsValue({ PhoneNumber: value });
                    //return Promise.reject("Can't be longer than 10 digits.");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            validateTrigger="onBlur"
            name="Carrier"
            label="Cellular Carrier"
            rules={[
              {
                required: true,
                message: "Missing Carrier",
              },
            ]}
          >
            <Select options={carriers} />
            {/*<Tooltip title="We use your phone and carrier for 2 factor authentication.">
              <QuestionCircleOutlined />
          </Tooltip>*/}
          </Form.Item>

          <Form.Item>
            {captchaValid === false ? null : loaderState === "inactive" ? (
              <div>
                {/*https://github.com/ant-design/ant-design/issues/22493 */}
                <Button
                  style={{ marginTop: "20px", float: "left" }}
                  type="primary"
                  htmlType="submit"
                  block
                >
                  Request Account
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
                message="Request Account Error"
                description="Something went wrong. Try again later."
                type="error"
              />
            ) : null}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegistrationForm;
