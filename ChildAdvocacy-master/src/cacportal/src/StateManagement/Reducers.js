import { combineReducers } from "redux";

export const adduserinfo_reducer = (state, action) => {
  switch (action.type) {
    case "ADD_USERINFO":
      return action.text;
    default:
      return state;
  }
};

