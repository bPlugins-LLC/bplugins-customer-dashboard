import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plugins: null,
  loading: true,
};

const pluginSlice = createSlice({
  name: "plugin",
  initialState,
  reducers: {
    setPlugins: (state, action) => {
      state.plugins = action.payload;
      state.loading = false;
    },
  },
});

export default pluginSlice.reducer;

export const { setPlugins } = pluginSlice.actions;
