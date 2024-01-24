import { createSlice } from "@reduxjs/toolkit";

export const listSlice = createSlice({
  name: "allLists",
  initialState: [],
  reducers: {
    setLists(state, action) {
      return action.payload;
    },
    createList(state, action) {
      const createdList = action.payload;
      state.push(createdList);
    },
    updateList(state, action) {
      // const type = action.type;
      // const listName = action.payload;
      // const listToUpdate = state.find((list) => list.listName === listName);
      // const updatedList = {
      //   ...listToUpdate,
      //   count:
      //     type === "INCREASE" ? listToUpdate.count + 1 : listToUpdate.count - 1,
      // };

      const updatedList = action.payload;
      return state.map((list) =>
        list.listName === updatedList.listName ? updatedList : list
      );
    },
    changeCount(state, action) {
      const originalList = action.payload;
      switch (action.type) {
        case "INCREASE":
          return state.map((list) =>
            list.listName === originalList.listName
              ? { ...originalList, count: originalList.count + 1 }
              : list
          );
        case "DECREASE":
          return state.map((list) =>
            list.listName === originalList.listName
              ? { ...originalList, count: originalList.count - 1 }
              : list
          );
        default:
          return state;
      }
    },
    moveTask(state, action) {
      const { originalList, newList } = action.payload;
      const listsAfterRemoval = state.map((list) =>
        list.listName === originalList
          ? { ...list, count: list.count - 1 }
          : list
      );

      return listsAfterRemoval.map((list) =>
        list.listName === newList ? { ...list, count: list.count + 1 } : list
      );
    },
  },
});

const { actions, reducer } = listSlice;

export const { setLists, createList, updateList, changeCount, moveTask } =
  actions;
export default reducer;
