import axios from "axios";
import { RENDER_URL } from "../constants";

const baseURL = `${RENDER_URL}/api/user`;

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
