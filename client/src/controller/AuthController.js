import Axios from "axios";

export const login = (email, password) => {
  return Axios.post("http://localhost:3001/login", { email, password });
};

export const register = (email, password) => {
  return Axios.post("http://localhost:3001/register", { email, password });
}

