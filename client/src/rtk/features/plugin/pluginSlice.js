import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../axios";

const initialState = {
  plugins: [],
  loading: true,
  error: null,
  details: {},
  subLoading: false,
  syncing: false,
};

export const fetchPlugins = createAsyncThunk("plugin/fetchPlugins", async (userId) => {
  const response = await axios.get(`/api/v1/plugins/user/${userId}`);
  return response.data.data;
});

export const fetchFreemiusPluginVersions = createAsyncThunk("plugin/fetchFreemiusPluginVersions", async (productId) => {
  try {
    const response = await axios.get(`/api/v1/freemius/tags/${productId}`);
    return { productId, versions: response.data?.data };
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
});

export const fetchFreemiusPluginInstalls = createAsyncThunk("plugin/fetchFreemiusPluginInstalls", async ({ productId, userId }) => {
  try {
    const response = await axios.get(`/api/v1/freemius/plugins/${productId}/installs?user_id=${userId}`);
    return { productId, installs: response.data?.data?.installs };
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
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
      state.details = { ...state.details, ...action.payload };
    },
    logout: (state) => {
      state = initialState;
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

    //fetchFreemiusPluginVersions
    builder.addCase(fetchFreemiusPluginVersions.pending, (state, action) => {
      state.subLoading = true;
    });
    builder.addCase(fetchFreemiusPluginVersions.fulfilled, (state, action) => {
      state.details[`versions${action.payload.productId}`] = action.payload.versions;
      state.subLoading = false;
    });
    builder.addCase(fetchFreemiusPluginVersions.rejected, (state, action) => {
      state.error = action.payload;
      state.subLoading = false;
    });

    //fetchFreemiusPluginInstalls
    builder.addCase(fetchFreemiusPluginInstalls.pending, (state, action) => {
      state.subLoading = true;
    });
    builder.addCase(fetchFreemiusPluginInstalls.fulfilled, (state, action) => {
      state.details[`installs${action.payload.productId}`] = action.payload.installs;
      state.subLoading = false;
      console.log(action.payload);
    });
    builder.addCase(fetchFreemiusPluginInstalls.rejected, (state, action) => {
      state.error = action.payload;
      state.subLoading = false;
    });
  },
});

export default pluginSlice.reducer;

export const { setPlugins, setDetails, logout } = pluginSlice.actions;
