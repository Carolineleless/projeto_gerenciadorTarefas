import Axios from "axios";

export const login = (email, password) => {
  return Axios.post("http://localhost:3001/login", { email, password });
};

export const register = (email, name, office, occupationArea, responsibleName, password) => {
  console.log(email, name, office, occupationArea, responsibleName, password);
  return Axios.post("http://localhost:3001/register", { email, name, office, occupationArea, responsibleName, password });
}

export const verProjeto = (idLogin) => {
  return Axios.post("http://localhost:3001/verProjeto", { idLogin });
}

export const criarProjeto = (name, type, company, startDate, finalDate, restriction, description, team, responsable) => {
  return Axios.post("http://localhost:3001/criarProjeto", { name, type, company, startDate, finalDate, restriction, description, team, responsable });
}

export const vincularAoProjeto = (idProject, name, responsable, email) => {
  return Axios.post("http://localhost:3001/vincularAoProjeto", { idProject, name, responsable, email });
}

