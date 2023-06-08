import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../axios";

import originalAxios from "axios";

const initialState = {
  plugins: [],
  loading: true,
  error: null,
  details: {},
  subLoading: false,
};

export const fetchPlugins = createAsyncThunk("plugin/fetchPlugins", async (userId) => {
  const response = await axios.get(`/api/v1/plugins/user/${userId}`);
  console.log(`/api/v1/plugins/user/${userId}`, response.data);
  return response.data.data;
});

export const deactivateLicense = createAsyncThunk("plugin/deactivateLicense", async (data, { getState }) => {
  const state = getState();
  const response = await axios.post(`http://localhost/freemius/wp-json/license/v1/gumroad`, { action: "deactive", ...data });
  if (response?.data?.success) {
    return { [data.license_key]: state.plugin.details[data.license_key].filter((item) => item !== data.website) };
  }
  return {};
});

const pluginSlice = createSlice({
  name: "plugin",
  initialState,
  reducers: {
    setPlugins: (state, action) => {
      state.plugins = action.payload;
      state.loading = false;
    },
    setDetails: (state, action) => {
      console.log("set details", action.payload);
      state.details = { ...state.details, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlugins.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPlugins.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.plugins = action.payload;
    });
    builder.addCase(fetchPlugins.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.plugins = [];
    });

    // deactivate license
    builder.addCase(deactivateLicense.pending, (state, action) => {
      state.subLoading = true;
      state.error = null;
    });
    builder.addCase(deactivateLicense.fulfilled, (state, action) => {
      state.subLoading = false;
      state.error = null;
      state.details = { ...state.details, ...action.payload };
    });
    builder.addCase(deactivateLicense.rejected, (state, action) => {
      state.subLoading = false;
      state.error = action.error.message;
    });
  },
});

export default pluginSlice.reducer;

export const { setPlugins, setDetails } = pluginSlice.actions;
