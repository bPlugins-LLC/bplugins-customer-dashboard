const { createSlice } = require("@reduxjs/toolkit");

// initial state
const initialState = {
  user: null,
  loggedIn: false,
  loading: true,
  error: null,
};

const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
});

export default userSlice.reducer;

export const { setUser } = userSlice.actions;
