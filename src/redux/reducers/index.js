import { combineReducers } from "redux";
import memeReducer from "./meme.reducer";
import alertReducer from "./meme.reducer";

export default combineReducers({
  meme: memeReducer, alertReducer
});