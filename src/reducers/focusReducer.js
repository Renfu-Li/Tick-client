import { createSlice } from "@reduxjs/toolkit";

const focusSlice = createSlice({
  name: "allFocuses",
  initialState: [],
  reducers: {
    setFocuses(state, action) {
      return action.payload;
    },
    createFocus(state, action) {
      const createdFocus = action.payload;
      state.push(createdFocus);
    },
  },
});

const { actions, reducer } = focusSlice;
export const { setFocuses, createFocus } = actions;
export default reducer;
