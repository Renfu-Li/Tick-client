import axios from "axios";

const baseURL = "http://localhost:3003/api/focus";

const generateConfig = (token) => {
  return {
    headers: {
      authorization: `bearer ${token}`,
    },
  };
};

const getAllFocuses = async (token) => {
  const response = await axios.get(baseURL, generateConfig(token));

  return response.data;
};

const createFocus = async (token, newFocus) => {
  const response = await axios.post(baseURL, newFocus, generateConfig(token));

  return response.data;
};

export default { getAllFocuses, createFocus };
