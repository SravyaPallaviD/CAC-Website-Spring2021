import axios from "axios";
import UserStore from "./StateManagement/Stores";
import adduserinfo_action from "./StateManagement/Actions";
import { FullLogout, getCookie, LocalLogout } from "./Tooling";

export function GetUserInfo(setAppLoader, resetInactivityTimer) {
  const HandleRequestError = (err) => {
    setAppLoader("error");
    resetInactivityTimer(true);
    //display short error message and then..
    //Cannot contact server! inititiate logout process.
    FullLogout();
  };

  const HandleRequestSuccess = (res) => {
    UserStore.dispatch(adduserinfo_action(res.data));
    setAppLoader("inactive");
  };

  var cook = getCookie("cnfrm_cookie");

  axios
    .get("/secure/api/get_userinfo", {
      headers: {
        Authorization: "Bearer " + cook,
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function UpdateSettingsRequest(
  values,
  HandleRequestSuccess,
  HandleRequestError
) {
  var cook = getCookie("cnfrm_cookie");

  axios
    .post("/secure/api/update_userinfo", values, {
      headers: {
        Authorization: "Bearer " + cook,
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function AttemptRemoteAndPurgeLocal() {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("/secure/api/purge_usersession", null, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": null,
      },
    })
    .then((res) => {
      LocalLogout();
    })
    .catch((err) => {
      LocalLogout();
    });
}

export function GetAllApprovedUsers(HandleRequestSuccess, HandleRequestError) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .get("/secure/api/admin/getall_approvedusers", {
      headers: {
        Authorization: "Bearer " + cook,
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function GetAllNonApprovedUsers(
  HandleRequestSuccess,
  HandleRequestError
) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .get("/secure/api/admin/getall_nonapprovedusers", {
      headers: {
        Authorization: "Bearer " + cook,
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function ActivateUser(key, HandleRequestSuccess, HandleRequestError) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/admin/activateuser", key, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function DeactivateUser(key, HandleRequestSuccess, HandleRequestError) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/admin/deactivateuser", key, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function ApproveUser(key, HandleRequestSuccess, HandleRequestError) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/admin/approveuser", key, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function RejectUser(key, HandleRequestSuccess, HandleRequestError) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/admin/rejectuser", key, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function MakeUserAdmin(key, HandleRequestSuccess, HandleRequestError) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/admin/makeuser_admin", key, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess();
    })
    .catch((err) => {
      HandleRequestError();
    });
}

export function MakeUserNonAdmin(
  key,
  HandleRequestSuccess,
  HandleRequestError
) {
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/admin/makeuser_nonadmin", key, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function GetEventTypes(HandleRequestSuccess, HandleRequestError){
  var cook = getCookie("cnfrm_cookie");
  axios
    .get("secure/api/get_eventtypes", {
      headers: {
        Authorization: "Bearer " + cook,
      },
    })
    .then((res) => {
      HandleRequestSuccess(res);
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}

export function DeleteEvent(EventKey,HandleRequestSuccess, HandleRequestError){}

export function AddEvent(data,HandleRequestSuccess,HandleRequestError){
  var cook = getCookie("cnfrm_cookie");
  axios
    .post("secure/api/addevent", data, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess();
    })
    .catch((err) => {
      HandleRequestError();
    });
}

export function EditEvent(HandleRequestSuccess,HandleRequestError){}

export function GetEventsByRange(fetchInfo,HandleRequestSuccess,HandleRequestError ){
  var cook = getCookie("cnfrm_cookie");
  var sd = fetchInfo.startStr;
  var ed = fetchInfo.endStr;
  var data = {};
  data.EventStartDateTm = sd;
  data.EventEndDateTm = ed;
  var final = JSON.stringify(data);
  axios
    .post("secure/api/get_eventsbyrange",final, {
      headers: {
        Authorization: "Bearer " + cook,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      HandleRequestSuccess(Array.prototype.slice.call( // convert to array
        res.data
      ).map(function(eventEl) {
        return {
          title: eventEl.title,
          start: eventEl.start,
          end: eventEl.end
        }
      }));
    })
    .catch((err) => {
      HandleRequestError(err);
    });
}


