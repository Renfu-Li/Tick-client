import axios from "axios";

const baseURL = "http://localhost:3003/api/user";

const createUser = async (newUser) => {
  const createdUser = await axios.post(`${baseURL}/signup`, newUser);

  if (createdUser) {
    const token = await loginUser(newUser);
    return token;
  }
};

const loginUser = async (user) => {
  const response = await axios.post(`${baseURL}/login`, user);
  const token = response.data.token;

  return token;
};

export default { createUser, loginUser };
