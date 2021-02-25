import React, {useState} from "react";
import { Tabs } from "antd";
import ManageUsers from "./ManageUsers";
import ApproveUsers from "./ApproveUsers";
import "antd/dist/antd.css";
import "./Main.css";

const { TabPane } = Tabs;

function AdminControls(props) {
  props.setlink("admincontrols");
  const [Active, SetActive] = useState("1");

  const handler = ActiveKey  =>{
    SetActive(ActiveKey);
  };
  return (
    <>
      <div className="card-container">
        <Tabs defaultActiveKey="1" onChange={handler} activeKey={Active}  onChangetype="card">
          <TabPane tab="Manage Users" key="1">
            <ManageUsers akey={Active} />
          </TabPane>
          <TabPane tab="Approve Users" key="2">
            <ApproveUsers akey={Active} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default AdminControls;
