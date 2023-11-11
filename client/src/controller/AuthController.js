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

export const criarProjeto = (name, type, company, startDate, finalDate, restriction, description, team, responsable, idLogin) => {
  return Axios.post("http://localhost:3001/criarProjeto", { name, type, company, startDate, finalDate, restriction, description, team, responsable, idLogin });
}

export const vincularAoProjeto = (idProject, email) => {
  return Axios.post("http://localhost:3001/vincularAoProjeto", { idProject, email });
}

export const abrirProjeto = (idLogin) => {
  return Axios.post("http://localhost:3001/abrirProjeto", { idLogin });
}

export const criarTarefa = (taskName, taskResponsable, taskDescription, taskStartDate, taskFinalDate, taskDependencies, taskObservation, taskStatus, idProject) => {
  console.log(idProject);
  return Axios.post("http://localhost:3001/criarTarefa", { taskName, taskResponsable, taskDescription, taskStartDate, taskFinalDate, taskDependencies, taskObservation, taskStatus, idProject });
}

export const excluirTarefa = (taskName, idProject) => {
  return Axios.post("http://localhost:3001/excluirTarefa", { taskName, idProject });
}
