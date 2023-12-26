import axios from "axios";
import taskService from "./taskService";

const baseURL = "http://localhost:3003/api/lists";

const generateConfig = (token) => {
  return {
    headers: {
      authorization: `bearer ${token}`,
    },
  };
};

const getAllList = async (token) => {
  const response = await axios.get(baseURL, generateConfig(token));
  return response.data;
};

// return all lists
const createList = async (token, listName) => {
  const response = await axios.post(
    baseURL,
    { listName },
    generateConfig(token)
  );
  return response.data;
};

// update a list
const updateList = async (token, newList) => {
  const response = await axios.put(
    `${baseURL}/${newList.id}`,
    { newList },
    generateConfig(token)
  );

  return response.data;
};

// move a task to another list
// first, delete the task from the existing list
// then, add the task to another list
const moveTask = async (token, task, newListName) => {
  await taskService.deleteTask(task.id, token);
  const newTask = { ...task, listName: newListName };
  const updatedTask = await taskService.createTask(newTask, token);

  return updatedTask;
};

// delete a list and return all lists
const deleteList = async (token, listId, listName) => {
  const response = await axios.post(
    `${baseURL}/${listId}`,
    { listName },
    generateConfig(token)
  );

  return response.data;
};

export default { getAllList, createList, updateList, moveTask, deleteList };
