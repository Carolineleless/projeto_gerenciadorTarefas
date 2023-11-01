import * as yup from 'yup';

export const validationsCreateProject = yup.object().shape({
  name: yup.string().required("O nome do projeto é obrigatório"),
  type: yup.string().required("O tipo do projeto é obrigatório"),
  company: yup.string().required("A empresa é obrigatória"),
  startDate: yup.date().required("A data de início é obrigatória"),
  finalDate: yup.date()
    .min(yup.ref('startDate'), "A data de conclusão deve ser posterior à data de início")
    .required("A data de conclusão é obrigatória"),
  restriction: yup.string().required("As restrições são obrigatórias"),
  description: yup.string().required("A descrição é obrigatória"),
  team: yup.string().required("A equipe é obrigatória"),
  responsable: yup.string().required("O responsável é obrigatório"),
});
