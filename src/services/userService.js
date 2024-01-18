import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const url = `${baseURL}/user`;

const createUser = async (newUser) => {
  const createdUser = await axios.post(`${url}/signup`, newUser);

  if (createdUser) {
    const token = await loginUser(newUser);
    return token;
  }
};

const loginUser = async (user) => {
  const response = await axios.post(`${url}/login`, user);
  const token = response.data.token;

  return token;
};

export default { createUser, loginUser };
