import React, { useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Landing from "./Landing/Landing";
import RegistrationForm from "./Gateway/Registration";
import Login from "./Gateway/Login";
import ForgotPassword from "./Gateway/ForgotPassword";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthContext } from "./AuthContext";
import TwoFactor from "./Gateway/TwoFactor";

function App() {
  const [AuthState, setAuthState] = useState("");
  const [RenderMFA, setRenderMFA] = useState(false);

  return (
    <AuthContext.Provider value={{ AuthState, setAuthState }}>
      <div>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/login" />
            <Route path="/login">
              <GoogleReCaptchaProvider reCaptchaKey="6Lcc2NAZAAAAACacxhunfZt6Wq3PVKSu7odDM8j4">
                {RenderMFA ? <TwoFactor /> : <Login MFA={setRenderMFA} />}
              </GoogleReCaptchaProvider>
            </Route>
            <Route path="/register">
              <GoogleReCaptchaProvider reCaptchaKey="6Lcc2NAZAAAAACacxhunfZt6Wq3PVKSu7odDM8j4">
                <RegistrationForm />
              </GoogleReCaptchaProvider>
            </Route>
            <Route path="/forgotpw">
              <GoogleReCaptchaProvider reCaptchaKey="6Lcc2NAZAAAAACacxhunfZt6Wq3PVKSu7odDM8j4">
                <ForgotPassword />
              </GoogleReCaptchaProvider>
            </Route>
          </Switch>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
