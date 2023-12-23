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

const createTask = async (taskInfo, token) => {
  // console.log("task and token from task service", task, token);
  const response = await axios.post(baseURL, taskInfo, generateConfig(token));
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

const deleteTask = async (id, token) => {
  const response = await axios.delete(
    `${baseURL}/${id}`,
    generateConfig(token)
  );
  return response.data;
};

export default { getAllTasks, createTask, updateTask, deleteTask };
