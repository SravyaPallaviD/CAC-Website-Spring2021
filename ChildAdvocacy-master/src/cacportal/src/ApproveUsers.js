import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
  Tabs,
  Select,
  Divider,
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
  GetAllNonApprovedUsers,
  ApproveUser,
  RejectUser,
} from "./RequestLayer";
import { onChange, onBlur, onFocus, onSearch } from "./Tooling.js";
import { convertLegacyProps } from "antd/lib/button/button";
const { TabPane } = Tabs;
const { Option } = Select;

function ApproveUsers(props) {
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
      width: 100,
    },
    {
      title: "Approve/Reject",
      key: "Approve/Reject",
      render: (text, record) => {
        return (
          <>
            <Button
              onClick={() => {
                SetAccountApprovedLoading(true);
                ApproveUser(
                  record.AccessControlKey,
                  ApproveUser_HandleRequestSuccess,
                  ApproveUser_HandleRequestError
                );
              }}
              loading={AccountApprovedLoading}
              type="primary"
              style={{ marginRight: "15px" }}
            >
              Approve
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                SetAccountRejectedLoading(true);
                RejectUser(
                  record.AccessControlKey,
                  RejectUser_HandleRequestSuccess,
                  RejectUser_HandleRequestError
                );
              }}
              loading={AccountRejectedLoading}
            >
              Reject
            </Button>
          </>
        );
      },
    },
  ];

  const [AllNonApprovedUsers, SetAllNonApprovedUsers] = useState([]);
  const [AccountApprovedLoading, SetAccountApprovedLoading] = useState(false);
  const [AccountRejectedLoading, SetAccountRejectedLoading] = useState(false);

  const GetAllNonApprovedUsers_HandleRequestSuccess = (res) => {
    SetAllNonApprovedUsers(res.data);
  };
  const GetAllNonApprovedUsers_HandleRequestError = (err) => {};

  const ApproveUser_HandleRequestSuccess = (res) => {
    SetAccountApprovedLoading(false);
    message.success(
      "Successfully approved User! They will now appear in the Manage User's screen."
    );
    GetAllNonApprovedUsers(
      GetAllNonApprovedUsers_HandleRequestSuccess,
      GetAllNonApprovedUsers_HandleRequestError
    );
  };

  const ApproveUser_HandleRequestError = (err) => {
    SetAccountApprovedLoading(false);
    message.error("Something went wrong. Did not approve user.");
  };

  const RejectUser_HandleRequestSuccess = (res) => {
    SetAccountRejectedLoading(false);
    message.success(
      "Successfully rejected user! Their information has been deleted."
    );
    GetAllNonApprovedUsers(
      GetAllNonApprovedUsers_HandleRequestSuccess,
      GetAllNonApprovedUsers_HandleRequestError
    );
  };

  const RejectUser_HandleRequestError = (err) => {
    SetAccountRejectedLoading(false);
    message.error("Something went wrong. Did not reject user.");
  };

  useEffect(() => {
    if (props.akey === "2") {
      GetAllNonApprovedUsers(
        GetAllNonApprovedUsers_HandleRequestSuccess,
        GetAllNonApprovedUsers_HandleRequestError
      );
    }
  }, props.akey);
  return (
    <>
      <div className="card-container">
        <Table
          dataSource={AllNonApprovedUsers}
          columns={columns}
          scroll={{ x: 800 }}
        />
      </div>
    </>
  );
}

export default ApproveUsers;
