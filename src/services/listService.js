import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const url = `${baseURL}/lists`;

const generateConfig = (token) => {
  return {
    headers: {
      authorization: `bearer ${token}`,
    },
  };
};

const getAllList = async (token) => {
  const response = await axios.get(url, generateConfig(token));
  return response.data;
};

// return all lists
const createList = async (token, listName) => {
  const response = await axios.post(url, { listName }, generateConfig(token));
  return response.data;
};

// update a list
const updateList = async (token, newList) => {
  const response = await axios.put(
    `${url}/${newList.id}`,
    newList,
    generateConfig(token)
  );

  return response.data;
};

// delete a list and return all lists
const deleteList = async (token, listId) => {
  const response = await axios.delete(
    `${url}/${listId}`,
    generateConfig(token)
  );

  return response.data;
};

export default { getAllList, createList, updateList, deleteList };
