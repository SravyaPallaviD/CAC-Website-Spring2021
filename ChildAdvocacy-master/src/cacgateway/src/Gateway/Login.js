import { Form, Input, Button, Alert, Spin } from "antd";
import React, { useState, useContext } from "react";
import "antd/dist/antd.css";
import "./Gateway.css";
import axios from "axios";
import { LoadingOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Login = (props) => {
  const EmailInputRef = React.createRef();
  const PasswordInputRef = React.createRef();
  const [loaderState, setLoaderState] = useState("inactive");
  const [captchaValid, setCaptchaValid] = useState(true);
  const { AuthState, setAuthState } = useContext(AuthContext);

  const HandleRequestSuccess = (res) => {
    const MFToken = res.headers.authorization;
    setAuthState(JSON.stringify({ MFTok: [MFToken] }));
    setLoaderState("success");
    props.MFA(true);
  };

  const HandleRequestError = (err) => {
    console.log(err);
    loginFailed(); //or some specific server error
  };

  const loginFailed = () => {
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

  const LoginHandler = (e) => {
    //Gets Username from field
    var UserName = EmailInputRef.current.state.value;

    //Gets Password from field
    var Password = PasswordInputRef.current.state.value;

   
    /*if (
      !isValidEmail(UserName) ||
      Password === undefined ||
      Password.length < 6
    ) {
      console.log("Failed here!")
      loginFailed();
      return;
    }*/

    setLoaderState("active");

    axios
      .post("/BasicAuthentication", null, {
        headers: {
          Authorization: "Basic " + btoa(UserName + ":" + Password),
        },
      })
      .then((res) => {
        HandleRequestSuccess(res);
      })
      .catch((err) => {
        HandleRequestError(err);
      });
  };

  const handleCaptchaSuccess = (token) => {
    setCaptchaValid(true);
  };

  return (
    <div className="login-form">
      <Form>
        <GoogleReCaptcha onVerify={handleCaptchaSuccess} />
        <Form.Item>
          <Title level={3}>Login {AuthState}</Title>
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            ref={EmailInputRef}
          />
        </Form.Item>

        <Form.Item>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            ref={PasswordInputRef}
            type={"password"}
          />
        </Form.Item>

        <Form.Item>
          {captchaValid === false ? null : loaderState === "inactive" ? (
            <div>
              {/*https://github.com/ant-design/ant-design/issues/22493 */}
              <Button
                onClick={LoginHandler}
                type="primary"
                htmlType="submit"
                block
              >
                Log in
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
              message="Login Error"
              description="Username or Password is incorrect."
              type="error"
            />
          ) : null}
        </Form.Item>
        <Link style={{ float: "right" }} to="/forgotpw">
          Forgot Password?
        </Link>
        <Link style={{ float: "left" }} to="/register">
          Request Account
        </Link>
      </Form>
    </div>
  );
};

export default Login;
