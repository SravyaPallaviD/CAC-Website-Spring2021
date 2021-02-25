import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
  Tabs,
  Select,
  Divider,
  Tag,
  Table,
  Space,
  Modal,
  Switch,
  Form,
  message,
  Button,
} from "antd";
import ManageFeatureAccess from "./ManageFeatureAccess.js";
import "./Main.css";
import {
  GetAllApprovedUsers,
  GetUserInfo,
  MakeUserAdmin,
  MakeUserNonAdmin,
  ActivateUser,
  DeactivateUser,
} from "./RequestLayer";
import { onChange, onBlur, onFocus, onSearch } from "./Tooling.js";
const { TabPane } = Tabs;
const { Option } = Select;

function ManageUsers(props) {
  const columns = [
    {
      title: "FirstName",
      dataIndex: "FirstName",
      key: "FirstName",
      width: 100,
    },
    {
      title: "LastName",
      dataIndex: "LastName",
      key: "LastName",
      width: 100,
    },
    {
      title: "Email Address",
      dataIndex: "EmailAddress",
      key: "EmailAddress",
      width: 100,
    },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
      width: 150,
    },
    {
      title: "Status",
      key: "Status",
      render: (text, record) => (
        <span>
          <Tag
            color={record.EffectiveThru === "" ? "green" : "volcano"}
            key={record.EffectiveThru}
          >
            {record.EffectiveThru === "" ? "Activated" : "Deactivated"}
          </Tag>
          <Space size={5}/>
          {record.IsAdmin === "1" ? (
            <Tag color={"blue"} key={record.IsAdmin}>
              {"Admin"}
            </Tag>
          ) : null}
        </span>
      ),
      sorter: (a, b) => {
        return a.EffectiveThru.length - b.EffectiveThru.length;
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Manage",
      key: "Manage",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              SetSelectedRecord(record);
              SetManageUserModal(true);
            }}
            type="primary"
          >
            Manage
          </Button>
        </Space>
      ),
    },
  ];

  const [AllApprovedUsers, SetAllApprovedUsers] = useState([]);
  const [ManageUserModal, SetManageUserModal] = useState(false);
  const [SelectedRecord, SetSelectedRecord] = useState({});
  const [AccountActivatedLoading, SetAccountActivatedLoading] = useState(false);
  const [IsAdminLoading, SetIsAdminLoading] = useState(false);

  const GetAllApprovedUsers_HandleRequestSuccess = (res) => {
    console.log("ManageUsers Successful here:");
    console.log(res);
    console.log(res.data);
    SetAllApprovedUsers(res.data);
  };

  const GetAllApprovedUsers_HandleRequestError = (err) => {
    console.log(err);
  };

  const ActivateUser_HandleRequestSuccess = (res) => {
    message.success(
      "Successfully activated " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        "'s account."
    );
    SetAccountActivatedLoading(false);
    GetAllApprovedUsers(
      GetAllApprovedUsers_HandleRequestSuccess,
      GetAllApprovedUsers_HandleRequestError
    );
    var temp = SelectedRecord;
    temp.EffectiveThru = "";
    SetSelectedRecord(temp);
  };

  const ActivateUser_HandleRequestError = (err) => {
    message.error(
      "Something went wrong activating " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        "'s account."
    );
    SetAccountActivatedLoading(false);
  };

  const DeactivateUser_HandleRequestSuccess = (res) => {
    message.success(
      "Successfully deactivated " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        "'s account."
    );
    SetAccountActivatedLoading(false);
    GetAllApprovedUsers(
      GetAllApprovedUsers_HandleRequestSuccess,
      GetAllApprovedUsers_HandleRequestError
    );
    var temp = SelectedRecord;
    temp.EffectiveThru = "tempval";
    SetSelectedRecord(temp);
  };

  const DeactivateUser_HandleRequestError = (err) => {
    message.error(
      "Something went wrong deactivating " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        "'s account."
    );
    SetAccountActivatedLoading(false);
  };

  const MakeUserAdmin_HandleRequestSuccess = (res) => {
    message.success(
      "Successfully made " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        " an admin."
    );
    SetIsAdminLoading(false);
    GetAllApprovedUsers(
      GetAllApprovedUsers_HandleRequestSuccess,
      GetAllApprovedUsers_HandleRequestError
    );
    var temp = SelectedRecord;
    temp.IsAdmin = "1";
    SetSelectedRecord(temp);
  };

  const MakeUserAdmin_HandleRequestError = (res) => {
    message.error(
      "Something went wrong making " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        " an admin."
    );
    SetIsAdminLoading(false);
  };

  const MakeUserNonAdmin_HandleRequestSuccess = (res) => {
    message.success(
      "Successfully made " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        " an non admin."
    );
    SetIsAdminLoading(false);
    GetAllApprovedUsers(
      GetAllApprovedUsers_HandleRequestSuccess,
      GetAllApprovedUsers_HandleRequestError
    );
    var temp = SelectedRecord;
    temp.IsAdmin = "0";
    SetSelectedRecord(temp);
  };

  const MakeUserNonAdmin_HandleRequestError = (res) => {
    message.error(
      "Something went wrong making " +
        SelectedRecord.FirstName +
        " " +
        SelectedRecord.LastName +
        " a non admin."
    );
    SetIsAdminLoading(false);
  };

  const AdminCheck = () => {
    var count = 0;
    AllApprovedUsers.map((user) => user.IsAdmin == "1" && count++);
    if (count < 2 && SelectedRecord.IsAdmin === "1") {
      message.warning(
        "This operation cannot be performed. There has to be at least one administrator at all times."
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (props.akey === "1") {
      GetAllApprovedUsers(
        GetAllApprovedUsers_HandleRequestSuccess,
        GetAllApprovedUsers_HandleRequestError
      );
    }
  }, [props.akey]);
  return (
    <>
      <Modal
        title={
          "Manage " +
          SelectedRecord.FirstName +
          " " +
          SelectedRecord.LastName +
          "'s account."
        }
        centered
        visible={ManageUserModal}
        onOk={() => {
          SetManageUserModal(false);
        }}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form
          labelCol={{ span: 7, offset: 0 }}
          wrapperCol={{ span: 2, offset: 0 }}
          colon={false}
          labelAlign="left"
        >
          <Form.Item label={"Is Admin?"}>
            <Switch
              checked={SelectedRecord.IsAdmin === "1" ? true : false}
              loading={IsAdminLoading}
              onChange={(val) => {
                SetIsAdminLoading(true);
                if (val) {
                  MakeUserAdmin(
                    SelectedRecord.AccessControlKey,
                    MakeUserAdmin_HandleRequestSuccess,
                    MakeUserAdmin_HandleRequestError
                  );
                } else {
                  if (AdminCheck()) {
                    MakeUserNonAdmin(
                      SelectedRecord.AccessControlKey,
                      MakeUserNonAdmin_HandleRequestSuccess,
                      MakeUserNonAdmin_HandleRequestError
                    );
                  } else {
                    SetIsAdminLoading(false);
                  }
                }
              }}
            />
          </Form.Item>
          <Form.Item label={"Account Activated?"}>
            <Switch
              checked={SelectedRecord.EffectiveThru === "" ? true : false}
              loading={AccountActivatedLoading}
              onChange={(val) => {
                SetAccountActivatedLoading(true);

                if (val) {
                  ActivateUser(
                    SelectedRecord.AccessControlKey,
                    ActivateUser_HandleRequestSuccess,
                    ActivateUser_HandleRequestError
                  );
                } else {
                  if (AdminCheck()) {
                    DeactivateUser(
                      SelectedRecord.AccessControlKey,
                      DeactivateUser_HandleRequestSuccess,
                      DeactivateUser_HandleRequestError
                    );
                  } else {
                    SetAccountActivatedLoading(false);
                  }
                }
              }}
            />
          </Form.Item>
        </Form>
        {console.log(SelectedRecord)}
      </Modal>
      <div className="card-container">
        <Table
          dataSource={AllApprovedUsers}
          columns={columns}
          scroll={{ x: 800 }}
        />
      </div>
    </>
  );
}

export default ManageUsers;
