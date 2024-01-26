import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "allTasks",
  initialState: [],
  reducers: {
    setTasks(state, action) {
      return action.payload;
    },
    createTask(state, action) {
      const createdTask = action.payload;
      state.push(createdTask);
    },
    updateTask(state, action) {
      const updatedTask = action.payload;
      return state.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
    },
    deleteTask(state, action) {
      const task = action.payload;
      return state.filter((t) => t.id !== task.id);
    },
  },
});

const { actions, reducer } = taskSlice;

export const { setTasks, createTask, updateTask, deleteTask } = actions;
export default reducer;
