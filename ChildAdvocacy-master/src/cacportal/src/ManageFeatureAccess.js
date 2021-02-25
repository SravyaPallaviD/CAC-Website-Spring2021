import React from "react";
import "antd/dist/antd.css";
import { List } from "antd";

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: false,
  });
}

const data = [
  "AdminControls",
  "ManageCases",
  "Dashboard",
  "Calendar",
  "ScheduleEvents",
];
console.log(mockData);

function ManageFeatureAccess() {
  return (
    <>
      <List
        style={{
          width: "250px",
          textAlign: "center",
          alignItems: "center",
          alignContent: "center",
        }}
        size="small"
        header={<div>Accessible Features</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </>
  );
}

export default ManageFeatureAccess;
