import { combineReducers } from "redux";
import chainReducer from "./chainReducer";
const appReducer = combineReducers({
  chainReducer,
});
export default appReducer;
