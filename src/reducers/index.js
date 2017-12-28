import { combineReducers } from "redux";

import eventReducer from "./eventReducer";
import configReducer from "./configReducer";
import newsReducer from "./newsReducer";
import dealReducer from "./dealReducer";
import loginReducer from "./loginReducer";
import commonReducer from "./commonReducer";

export default combineReducers({
  event : eventReducer,
  news : newsReducer,
  deal : dealReducer,
  config : configReducer,
  login : loginReducer,
  common: commonReducer
});
