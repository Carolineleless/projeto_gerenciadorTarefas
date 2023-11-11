import * as yup from 'yup';

export const validationsLinkProject = yup.object().shape({
  idProject: yup.string().required("O id do projeto é obrigatório!"),
  email: yup.string().email("Email inválido").required("O email é obrigatório")
});