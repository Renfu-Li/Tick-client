import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const taskURL = `${baseURL}/tasks`;
const listURL = `${baseURL}/lists`;

const generateConfig = (token) => {
  return {
    headers: {
      authorization: `bearer ${token}`,
    },
  };
};

const getAllTasks = async (token) => {
  const response = await axios.get(taskURL, generateConfig(token));
  return response.data;
};

const createTask = async (newTask, token) => {
  const response = await axios.post(taskURL, newTask, generateConfig(token));
  return response.data;
};

const updateTask = async (id, newTask, token) => {
  const response = await axios.put(
    `${taskURL}/${id}`,
    newTask,
    generateConfig(token)
  );
  return response.data;
};

const moveTask = async (token, task, sourceList, targetList) => {
  const response = await axios.put(
    `${taskURL}/${task.id}`,
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
    `${taskURL}/${id}`,
    updatedTask,
    generateConfig(token)
  );

  const updatedList = { ...list, count: list.count - 1 };
  await axios.put(`${listURL}/${list.id}`, updatedList, generateConfig(token));

  return response.data;
};

const deleteTask = async (token, id) => {
  const response = await axios.delete(
    `${taskURL}/${id}`,
    generateConfig(token)
  );

  // no need to update List since the count was decreased when the task was removed
  // const updatedList = { ...list, count: list.count - 1 };
  // await axios.put(
  //   `http://localhost:3003/api/lists/${list.id}`,
  //   updatedList,
  //   generateConfig(token)
  // );

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
