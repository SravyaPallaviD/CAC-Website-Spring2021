import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { GetEventTypes, AddEvent, GetEventsByRange } from "./RequestLayer.js";
import "antd/dist/antd.css";
import {
  Modal,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Avatar,
  message,
  Spin,
  Alert,
} from "antd";
import { PlusOutlined, CheckCircleTwoTone, LoadingOutlined } from "@ant-design/icons";
const { Option } = Select;
const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

const Calendar = (props) => {
  const [form] = Form.useForm();
  //const [currentEvents, setCurrentEvents] = useState([]);
  //const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [eventTypeSuggestions, setEventTypeSuggestions] = useState([]);
  const [tempadd, setTempAdd] = useState("");

  const [loaderState, setLoaderState] = useState("inactive");
  const HandleEventTypeRequestSuccess = (res) => {
    console.log("Event Types Success!");
    if (res.data != "") {
      //setEventTypeSuggestions([res.data);
    }
  };
  const HandleEventTypeRequestError = (err) => {
    console.log("Event Types Error");
    console.log(err);
  };

  const HandleAddEventRequestSuccess = (res) => {
    setLoaderState("inactive");
    console.log("Success!");
  };

  const HandleAddEventRequestError = (err) => {
    setLoaderState("inactive");
    console.log("failure!");
    
  };

  useEffect(() => {
    //GetEventTypes(HandleEventTypeRequestSuccess, HandleEventTypeRequestError);
    //var date = new Date();
    //var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    //var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //GetEventsByRange();
  }, []);


  const AddEventHandler = (values) => {
    setLoaderState("active");

    console.log("values before");
    console.log(values);
    var startend = values["EventStartDateTm"];
    delete values["EventStartDateTm"];
    console.log("values after");
    console.log(values);
    values.EventStartDateTm = startend[0];
    values.EventEndDateTm = startend[1];
    values.CaseKey = parseInt(values.CaseKey);
    console.log("values after");
    console.log(values);
    AddEvent(values, HandleAddEventRequestSuccess, HandleAddEventRequestError);
  };

  props.setlink("calendar");
  /*
    const handleWeekendsToggle = () => { setWeekendsVisible(!weekendsVisible); }
    */

  /*const handleEvents = (events) => {
        setCurrentEvents(events);
    }*/

  const suggestionHandler = (value) => {
    if (value) {
      //console.log(value);
      setEventTypeSuggestions((eventTypeSuggestions) => [
        ...eventTypeSuggestions,
        value,
      ]);
    }
  };

  return (
    <>
      <Modal
        title="Create Event"
        centered
        visible={createEventModalVisible}
        onOk={() => {
          setCreateEventModalVisible(false);
        }}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form
          size={"medium"}
          form={form}
          onFinish={AddEventHandler}
          name="CreateEvent"
          layout="vertical"
          labelCol={{ span: 10, offset: 0 }}
          wrapperCol={{ span: 20, offset: 0.5 }}
          style={{ width: "300px", display: "inline-block" }}
        >
          <Form.Item name="EventType" label={"Event Type"}>
            <Select style={{ width: 200 }} placeholder="Event Type">
              {/*eventTypeSuggestions.map(val => (
              <Option value={val}>{val}</Option>
              ))*/}
              <Option value={"Staff Meeting"}>Staff Meeting</Option>
              <Option value={"Interview"}>Interview</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="CaseKey"
            label="Case Number"
            tooltip="Case number associated with interview."
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Location"
            label="Event Location"
            tooltip="Location that the event will be held."
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="EventStartDateTm"
            label="Event Time Range"
            tooltip="Date request was made for interview"
          >
            <RangePicker
              style={{ width: 475 }}
              showTime={{ use12Hours: true, format: "h:mm a" }}
              allowClear={false}
              format="YYYY-MM-DD h:mm a"
              onChange={console.log("")}
            />
          </Form.Item>
          <Form.Item>
            {loaderState === "inactive" ? (
              <div>
                {/*https://github.com/ant-design/ant-design/issues/22493 */}
                <Button type="primary" htmlType="submit">
                  Create Event
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
                message="Error"
                description="Something went wrong."
                type="error"
              />
            ) : null}
          </Form.Item>
        </Form>
      </Modal>
      <Button
        onClick={() => {
          setCreateEventModalVisible(true);
        }}
      >
        Create Event
      </Button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={GetEventsByRange}
        //weekends={weekendsVisible}
        eventContent={renderEventContent} // custom render function
      />
    </>
  );
};

export default Calendar;
