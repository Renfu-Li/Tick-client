import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: null,
  reducers: {
    setToken(state, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = tokenSlice;
export const { setToken } = actions;
export default reducer;
