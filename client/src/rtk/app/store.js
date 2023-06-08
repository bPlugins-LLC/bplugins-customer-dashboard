import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userSlice from "../features/user/userSlice";
import pluginSlice from "../features/plugin/pluginSlice";
import pluginListReducer from "../features/pluginLIst/pluginListSlice";

const store = configureStore({
  reducer: combineReducers({
    user: userSlice,
    plugin: pluginSlice,
    pluginList: pluginListReducer,
  }),
});

export default store;
