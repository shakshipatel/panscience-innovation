import { combineReducers } from "redux";

import userReducer from "./reducers/userSlice";
import taskReducer from "./reducers/taskSlice";
import accountReducer from "./reducers/accountSlice";

const rootReducer = combineReducers({
  user: userReducer,
  account: accountReducer,
  task: taskReducer,
});

export default rootReducer;
