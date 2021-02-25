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

const ForgotPassword = (props) => {
  const EmailInputRef = React.createRef();
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

    /*if (!isValidEmail(UserName)) {
      ForgotFailed();
      console.log("pre-validation failed");
      return;
    }*/
    setLoaderState("active");

    //POST request example
    axios
    .post("public/api/forgotpw", String(UserName))
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
            Forgot Password
          </Title>
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
        
        ]}>
          
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            ref={EmailInputRef}
          />
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
