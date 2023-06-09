import axios from "../../../axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// initial state
const initialState = {
  user: null,
  loggedIn: false,
  loading: false,
  error: null,
  activeRole: "customer",
  freemiusUser: null,
};

export const fetchFreemiusUser = createAsyncThunk("user/fetchFreemiusUser", async ({ pluginId, userId }) => {
  try {
    const response = await axios.get(`/api/v1/freemius/plugins/${pluginId}/users/${userId}?fields=email,public_key,secret_key,first,last`);
    console.log({ pluginId, userId }, response.data);
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
});

export const verifyUserToken = createAsyncThunk("user/verifyUserToken", async () => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    const response = await axios.get(`/api/v1/auth/verify-token?access_token=${access_token}`);
    return response.data.user;
  }
  return null;
});

export const Login = createAsyncThunk("/user/login", async (credential) => {
  try {
    const { data } = await axios.post("/api/v1/auth/login", credential);
    localStorage.setItem("access_token", data?.token?.access_token);
    localStorage.setItem("refresh_token", data?.token?.refresh_token);
    return data?.user;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setFreemiusUser: (state, action) => {
      state.freemiusUser = action.payload;
    },
    setUserRole: (state, action) => {
      state.activeRole = action.payload;
    },
    userLogout: (state, action) => {
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    setUserError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyUserToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyUserToken.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    });
    builder.addCase(verifyUserToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    });

    // login
    builder.addCase(Login.pending, (state, action) => {
      // state.loading = true;
      state.error = null;
    });
    builder.addCase(Login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(Login.rejected, (state, action) => {
      state.loading = false;
      state.error = "Invalid Email/Password!";
    });

    // fetch freemius user
    // builder.addCase(Login.pending, (state, action) => {
    //   // state.loading = true;
    //   state.error = null;
    // });
    builder.addCase(fetchFreemiusUser.fulfilled, (state, action) => {
      state.loading = false;
      state.freemiusUser = action.payload;
    });
    // builder.addCase(Login.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = "Invalid Email/Password!";
    // });
  },
});

export default userSlice.reducer;

export const { setUser, setUserRole, userLogout, setUserError } = userSlice.actions;
