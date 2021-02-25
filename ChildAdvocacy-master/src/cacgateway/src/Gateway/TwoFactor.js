import { Form, Input, Button, Alert, Spin } from "antd";
import React, { useState, useContext } from "react";
import "antd/dist/antd.css";
import "./Gateway.css";
import { LoadingOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { Typography } from "antd";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { AuthContext } from "../AuthContext";
import axios from "axios";
const { Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const TwoFactor = () => {
  const CodeInputRef = React.createRef();
  const [loaderState, setLoaderState] = useState("inactive");
  const [captchaValid, setCaptchaValid] = useState(true);
  const { AuthState, setAuthState } = useContext(AuthContext);

  const handleCaptchaSuccess = (token) => {
    setCaptchaValid(true);
  };
  const HandleRequestSuccess = (res) => {
    const AccessToken = res.headers.authorization;
    setAuthState(JSON.stringify({ AccessTok: [AccessToken] }));
    setLoaderState("success");

    document.cookie = "cnfrm_cookie=" + AccessToken + ";SameSite=Strict;";

    let form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "/app");

    let hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("Name", "Token");
    hiddenField.setAttribute("value", AccessToken);

    form.appendChild(hiddenField);

    document.body.appendChild(form);

    form.submit();
  };

  const HandleRequestError = (err) => {
    console.log(err);
    twoFactorFailed();
  };

  const twoFactorFailed = () => {
    setLoaderState("error");
    setTimeout(() => {
      setLoaderState("inactive");
    }, 4000);
  };
  const handler = (values) => {
    var Code = CodeInputRef.current.state.value;
    /* removing this code for security.
    if(Code.length != 5) {
      HandleRequestError("");
      return;
    }*/
    var obj = JSON.parse(AuthState);

    setLoaderState("active");
    axios
      .post("/mfauthentication", Code, {
        headers: {
          Authorization: "Bearer " + obj.MFTok,
        },
      })
      .then((res) => {
        HandleRequestSuccess(res);
      })
      .catch((err) => {
        HandleRequestError(err);
      });

    console.log("Received values of form: ", values);
  };
  return (
    <div className="twofactor-form">
      <Form size={"medium"} name="MFA" layout="vertical">
        <GoogleReCaptcha onVerify={handleCaptchaSuccess} />

        <Title level={3}>2-Factor Verification</Title>

        <p>
          We texted your phone and sent an email. Please enter either code to
          sign in.
        </p>
        <Form.Item>
          <Input placeholder="Code" ref={CodeInputRef} />
        </Form.Item>
        <Form.Item>
          {captchaValid === false ? null : loaderState === "inactive" ? (
            <div>
              {/*https://github.com/ant-design/ant-design/issues/22493 */}
              <Button onClick={handler} type="primary" htmlType="submit" block>
                Verify
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
              message="Verification Error"
              description="Code is incorrect."
              type="error"
            />
          ) : null}
        </Form.Item>
      </Form>
    </div>
  );
};

export default TwoFactor;
