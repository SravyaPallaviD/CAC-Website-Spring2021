import { Form, Input, Button, Alert, Spin } from "antd";
import React, { useState } from "react";
import "antd/dist/antd.css";
import "./Gateway.css";
import { LoadingOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Link } from 'react-router-dom';
import {
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import axios from 'axios';
const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const OpenResetPassword = (props) => {
  const [loaderState, setLoaderState] = useState("inactive");
  const [captchaValid, setCaptchaValid] = useState(true);

  const HandleRequestSuccess = () => {
    setLoaderState("finished");
  };

  const HandleRequestError = () => {
    ForgotFailed(); //or some specific server error
  };

  const ForgotFailed = () => {
    setLoaderState("error");
    setTimeout(() => {
      setLoaderState("inactive");
    }, 4000);
  };

  const isValidEmail = (subject) => {
    if (/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\\.\w{2,3})+$/.test(subject)) {
      return true;
    }
    return false;
  };

  

  const ForgotHandler = (e) => {
    //Gets Username from field
    var UserName = EmailInputRef.current.state.value;

    if (!isValidEmail(UserName)) {
      ForgotFailed();
      console.log("pre-validation failed");
      return;
    }
    setLoaderState("active");

    //POST request example
    axios
    .post("public", data, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess();
    })
    .catch((err) => {
      HandleRequestError();
    });
    
  };


  const handleCaptchaSuccess = (token) => 
  {
      setCaptchaValid(true);
  };
  
  return (
    <div className="forgotpassword-form">
      <Form>
      <GoogleReCaptcha onVerify={handleCaptchaSuccess} />
        <Form.Item>
          <div>
            <Link to='/login'>
            <Button
              size={"medium"}
              style={{ float: "left" }}
              icon={<ArrowLeftOutlined />}
            ></Button>
            </Link>
          </div>
          <Title style={{ float: "left", paddingLeft: "14%" }} level={4}>
            ResetPassword
          </Title>
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

        <Form.Item>
                {(captchaValid === false) 
                ? null
                : (loaderState === "inactive") 
                    ? <div>
                         {/*https://github.com/ant-design/ant-design/issues/22493 */}
                         <Button onClick={ForgotHandler} type="primary" htmlType="submit" block>
                             Reset Password
                         </Button>
                      </div>
                    : (loaderState === "active") 
                        ? <Spin indicator={antIcon} />
                        : (loaderState === "success") 
                            ? <CheckCircleTwoTone  style={{fontSize: 50 }} twoToneColor="#52c41a" />
                            : null }
                
                { (loaderState === "error") 
                    ? <Alert
                         message="Submission Error"
                         description="There was an error submitting your request."
                         type="error"
                      /> 
                    : null }
               
            </Form.Item>
          
      </Form>
    </div>
  );
};

export default ForgotPassword;
