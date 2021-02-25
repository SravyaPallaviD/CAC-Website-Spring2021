import React, { useState, useEffect } from "react";
import "./Main.css";
import "antd/dist/antd.css";
import { Layout, Menu, Button, Spin, Result, notification } from "antd";
import {
  LoadingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LockOutlined,
  SettingOutlined,
  CalendarOutlined,
  AuditOutlined,
  TableOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import ManageCases from "./ManageCases";
import Calendar from "./Calendar";
import AdminControls from "./AdminControls";
import Settings from "./Settings";
import { Router, Switch, Route, Link, HashRouter } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { GetUserInfo } from "./RequestLayer";
import { FullLogout } from "./Tooling";
import UserStore from "./StateManagement/Stores.js";

const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

const { Header, Sider, Content } = Layout;

function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const [currKey, setCurrKey] = useState([0]);
  const [siderWidth, setSiderWidth] = useState("200");
  const [counter, setCounter] = useState(60);
  const [counterEnabled, setCounterEnabled] = useState(false);
  const [appLoader, setAppLoader] = useState("active");

  const handleOnIdle = () => {
    setCounterEnabled(true);
  };

  const { pause } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  const InactivityNotification = () => {
    notification.open({
      key: "inactivityexpiration",
      message: "Inactivity Expiration",
      description: (
        <p>
          {"You are about to be logged out due to inactivity " + counter + ". Click "}
          <button
            type="button"
            className="link-button"
            onClick={InactivityResetNotification}
          >
            here
          </button>
          {" to become active."}
        </p>
      ),
      duration: null,
      type: "warning",
    });
  };

  const InactivityResetNotification = () => {
    resetInactivityTimer(false);
    notification.open({
      key: "inactivityexpiration",
      message: "Inactivity reset.",
      description: <p>You are now active.</p>,
      duration: 1,
      type: "success",
    });
  };

  //This effect starts counting down the 60 second timer
  //(which is part of the inactivity notification)
  //When this timer gets down to 0, we reset the timer and execute
  //the logout sequence.
  useEffect(() => {
    if (counter === 0) {
      resetInactivityTimer(true);
      FullLogout();
    }
    if (counterEnabled) {
      const timer =
        counter > -1 &&
        setInterval(() => {
          setCounter(counter - 1);
          InactivityNotification();
        }, 1000);
      return () => clearInterval(timer);
    }
  });

  useEffect(() => {
    GetUserInfo(setAppLoader, resetInactivityTimer);
    setInterval(() => {
      GetUserInfo(setAppLoader, resetInactivityTimer);
    }, 5000);
  }, []);

  const resetInactivityTimer = (pauseit) => {
    setCounterEnabled(false); //disabled notification timer
    setCounter(60); //resets notification timer to 60
    pauseit && pause(); //pauses the notification listener
  };

  const toggle = () => {
    if (broken === true) {
      setSiderWidth("100%");
    } else {
      setSiderWidth("200");
    }
    setCollapsed(!collapsed);
  };

  const onsel = (e) => {
    setCurrKey(e.key);
  };

  return (
    <HashRouter>
      <Switch>
        {appLoader === "inactive" ? (
          <Layout style={{ height: "100%" }}>
            <Sider
              onCollapse={() => {
                toggle();
              }}
              onBreakpoint={(broken) => {
                setBroken(broken);
              }}
              breakpoint="xs"
              collapsedWidth="0"
              trigger={null}
              collapsible
              collapsed={collapsed}
              width={siderWidth}
            >
              <Menu
                theme="dark"
                mode="inline"
                onSelect={onsel}
                selectedKeys={currKey}
              >
                <Button
                  onClick={toggle}
                  style={{
                    height: "50px",
                    width: "100%",
                    backgroundColor: "#001529",
                    color: "white",
                  }}
                  icon={
                    collapsed ? <ArrowLeftOutlined /> : <ArrowRightOutlined />
                  }
                >
                  CAC Staff Portal
                </Button>
                <Menu.Item key="dashboard" icon={<TableOutlined />}>
                  <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="managecases" icon={<AuditOutlined />}>
                  <Link to="/managecases">Manage Cases</Link>
                </Menu.Item>
                <Menu.Item key="calendar" icon={<CalendarOutlined />}>
                  <Link to="/calendar">Calendar</Link>
                </Menu.Item>
                {UserStore.getState()[0].IsAdmin === "1" ? 
                <Menu.Item key="admincontrols" icon={<LockOutlined />}> 
                  <Link to="/admincontrols">Admin Controls</Link>
                </Menu.Item>
                :null}
                <Menu.Item key="settings" icon={<SettingOutlined />}>
                  <Link to="/settings">Settings</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }}>
                <Button
                  type="primary"
                  onClick={toggle}
                  style={{
                    width: "75px",
                    float: "left",
                    height: "100%",
                    marginBottom: 16,
                  }}
                >
                  {React.createElement(
                    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
                  )}
                </Button>
                <Button
                  type="primary"
                  style={{ float: "right", height: "100%", marginBottom: 16 }}
                  onClick={FullLogout}
                >
                  Log out
                </Button>
              </Header>
              <Content
                style={{
                  margin: "10px 10px",
                  padding: 5,
                  minHeight: 280,
                  height: "100%",
                }}
              >
                <Route path="/managecases">
                  <ManageCases setlink={setCurrKey} />
                </Route>

                <Route path="/calendar">
                  <Calendar setlink={setCurrKey} />
                </Route>
                
                {UserStore.getState()[0].IsAdmin === "1" ? 
                <Route path="/admincontrols">
                  <AdminControls setlink={setCurrKey} />
                </Route>
                :null}

                <Route path="/settings">
                  <Settings setlink={setCurrKey} />
                </Route>
              </Content>
            </Layout>
          </Layout>
        ) : appLoader === "error" ? (
          <Result
            status="warning"
            title="The app portal could not be loaded."
            extra={
              <Button type="primary" key="console">
                Contact support
              </Button>
            }
          />
        ) : (
          <Spin indicator={antIcon} />
        )}
      </Switch>
    </HashRouter>
  );
}

export default Main;
