import axios from "axios";

const baseURL = "http://localhost:3003/api/tasks";

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

// remove a task to trash (not really deletion in Task collection)
const removeTask = async (id, task, list, token) => {
  const updatedTask = { ...task, deleted: true };
  const response = await axios.put(
    `${baseURL}/${id}`,
    updatedTask,
    generateConfig(token)
  );

  const updatedList = { ...list, count: list.count-- };
  await axios.put(
    `http://localhost:3003/api/lists/${list.id}`,
    updatedList,
    generateConfig(token)
  );

  return response.data;
};

const deleteTask = async (id, token) => {
  const response = await axios.delete(
    `${baseURL}/${id}`,
    generateConfig(token)
  );
  return response.data;
};

export default { getAllTasks, createTask, updateTask, removeTask, deleteTask };
