import axios from "axios";

const baseURL = "http://localhost:3003/api/tasks";
const listURL = "http://localhost:3003/api/lists";

const generateConfig = (token) => {
  return {
    headers: {
      authorization: `bearer ${token}`,
    },
  };
};

const getAllTasks = async (token) => {
  const response = await axios.get(baseURL, generateConfig(token));
  return response.data;
};

const createTask = async (newTask, token) => {
  const response = await axios.post(baseURL, newTask, generateConfig(token));
  return response.data;
};

const updateTask = async (id, newTask, token) => {
  const response = await axios.put(
    `${baseURL}/${id}`,
    newTask,
    generateConfig(token)
  );
  return response.data;
};

const moveTask = async (token, task, sourceList, targetList) => {
  const response = await axios.put(
    `${baseURL}/${task.id}`,
    { ...task, listName: targetList.listName },
    generateConfig(token)
  );

  await axios.put(
    `${listURL}/${sourceList.id}`,
    { ...sourceList, count: sourceList.count - 1 },
    generateConfig(token)
  );

  await axios.put(
    `${listURL}/${targetList.id}`,
    { ...targetList, count: targetList.count + 1 },
    generateConfig(token)
  );

  return response.data;
};

// remove a task to trash (not really deletion in Task collection)
const removeTask = async (id, task, list, token) => {
  const updatedTask = { ...task, removed: true };
  const response = await axios.put(
    `${baseURL}/${id}`,
    updatedTask,
    generateConfig(token)
  );

  const updatedList = { ...list, count: list.count - 1 };
  await axios.put(`${listURL}/${list.id}`, updatedList, generateConfig(token));

  return response.data;
};

const deleteTask = async (id, list, token) => {
  const response = await axios.delete(
    `${baseURL}/${id}`,
    generateConfig(token)
  );

  const updatedList = { ...list, count: list.count - 1 };
  await axios.put(
    `http://localhost:3003/api/lists/${list.id}`,
    updatedList,
    generateConfig(token)
  );

  return response.data;
};

export default {
  getAllTasks,
  createTask,
  updateTask,
  moveTask,
  removeTask,
  deleteTask,
};
