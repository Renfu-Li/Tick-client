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
    deleteByTask(state, action) {
      const taskId = action.payload;
      return state.filter((focus) => focus.task !== taskId);
    },
  },
});

const { actions, reducer } = focusSlice;
export const { setFocuses, createFocus, deleteByTask } = actions;
export default reducer;
