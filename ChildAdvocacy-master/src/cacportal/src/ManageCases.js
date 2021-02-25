import React, { useState } from "react";
import { Layout, Menu, Button, Spin, Result, notification, Tag, Space, Table } from "antd";
const data = [
  {
    CaseNumber: "26246",
    Priority: "1",
    Status: "Active",
  },
  {
    CaseNumber: "68927",
    Priority: "2",
    Status: "Active",
  },
  {
    CaseNumber: "65739",
    Priority: "3",
    Status: "Active",
  },
  {
    CaseNumber: "50697",
    Priority: "4",
    Status: "Active",
  },
  {
    CaseNumber: "32465",
    Priority: "5",
    Status: "Active",
  },
  {
    CaseNumber: "88793",
    Priority: "6",
    Status: "Active",
  },
  {
    CaseNumber: "66874",
    Priority: "7",
    Status: "Active",
  },
  {
    CaseNumber: "35676",
    Priority: "8",
    Status: "Active",
  },
  {
    CaseNumber: "09823",
    Priority: "9",
    Status: "Active",
  },
  {
    CaseNumber: "96784",
    Priority: "10",
    Status: "Active",
  },
  {
    CaseNumber: "12785",
    Priority: "11",
    Status: "Active",
  },
  {
    CaseNumber: "76478",
    Priority: "12",
    Status: "Active",
  },
];

function ManageCases() {
  const columns = [
    {
      title: "CaseNumber",
      dataIndex: "CaseNumber",
      key: "CaseNumber",
      width: 100,
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      key: "Priority",
      width: 100,
    },
    {
      title: "Status",
      key: "Status",
      render: (text, record) => (
        <span>
          <Tag color={"volcano"}>{"Closed"}</Tag>
        </span>
      ),
    },
    {
      title: "Manage",
      key: "Manage",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
          >
            Manage
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      {/*ADD A CASE HANDLER COLUMN TO THE TABLE...
         SEE WHO'S WORKING A CASE.
         -ALSO ADD SEARCH OPTION
      */}
      <Button>New Case</Button>
      <div className="card-container">
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 800 }}
        />
      </div>
    </>
  );
}

export default ManageCases;
