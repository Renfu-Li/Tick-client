import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const url = `${baseURL}/focus`;

const generateConfig = (token) => {
  return {
    headers: {
      authorization: `bearer ${token}`,
    },
  };
};

const getAllFocuses = async (token) => {
  const response = await axios.get(url, generateConfig(token));

  return response.data;
};

const createFocus = async (token, newFocus) => {
  const response = await axios.post(url, newFocus, generateConfig(token));

  return response.data;
};

const deleteFocusByTask = async (token, taskId) => {
  const response = await axios.delete(
    `${url}/${taskId}`,
    generateConfig(token)
  );

  return response.data;
};

export default { getAllFocuses, createFocus, deleteFocusByTask };
