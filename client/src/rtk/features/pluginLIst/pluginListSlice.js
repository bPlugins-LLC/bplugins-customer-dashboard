import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../axios";

const initialState = {
  loading: true,
  list: [],
  error: null,
  currentId: null,
};

export const fetchPluginList = createAsyncThunk("pluginList/fetchPluginList", async () => {
  const response = await axios.get("/api/v1/plugin-list/");
  return response.data.data;
});

export const addPluginListItem = createAsyncThunk("pluginList/addPluginListItem", async (data) => {
  const response = await axios.post("/api/v1/plugin-list/add-item", data);
  return response.data.data;
});

export const updatePluginListItem = createAsyncThunk("pluginList/updatePluginListItem", async ({ id, data }) => {
  const response = await axios.post(`/api/v1/plugin-list/${id}`, data);
  console.log({ data });
  return response.data.data;
});

export const deletePluginListItem = createAsyncThunk("pluginList/deletePluginListItem", async (id) => {
  const response = await axios.delete(`/api/v1/plugin-list/${id}`);
  return id;
});

const pluginListSlice = createSlice({
  name: "pluginList",
  initialState,
  reducers: {
    setPluginList: (state, action) => {
      state.items = action.payload;
    },
    setCurrentId: (state, action) => {
      state.currentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPluginList.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchPluginList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.list = action.payload;
    });
    builder.addCase(fetchPluginList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.list = [];
    });

    // add Plugin
    builder.addCase(addPluginListItem.pending, (state, action) => {
      state.error = "";
      state.loading = true;
    });
    builder.addCase(addPluginListItem.fulfilled, (state, action) => {
      state.error = "";
      state.loading = false;
      state.list.push(action.payload);
    });
    builder.addCase(addPluginListItem.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    // delete
    builder.addCase(deletePluginListItem.fulfilled, (state, action) => {
      state.list = state.list.filter((item) => item._id !== action.payload);
    });

    // update
    builder.addCase(updatePluginListItem.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePluginListItem.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.map((item) => (item._id === action.payload._id ? action.payload : item));
    });
    builder.addCase(updatePluginListItem.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default pluginListSlice.reducer;

export const { setPluginList, setCurrentId } = pluginListSlice.actions;
