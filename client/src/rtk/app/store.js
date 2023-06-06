import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userSlice from "../features/user/userSlice";
import pluginSlice from "../features/plugin/pluginSlice";

const store = configureStore({
  reducer: combineReducers({
    user: userSlice,
    plugin: pluginSlice,
  }), // This is the reducer that will be used to manage the state of your application.
  // middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(logger),
});

export default store;
