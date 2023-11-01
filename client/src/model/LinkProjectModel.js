import * as yup from 'yup';

export const validationsLinkProject = yup.object().shape({
  idProject: yup.string().required("O id do projeto é obrigatório!"),
  name: yup.string().required("O nome do projeto é obrigatório"),
  responsable: yup.string().required("O responsável pelo projeto é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório")
});