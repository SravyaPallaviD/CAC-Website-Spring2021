import {createStore} from "redux"
import  {adduserinfo_reducer}  from "./Reducers";
const UserStore = createStore(adduserinfo_reducer);
export default UserStore;


