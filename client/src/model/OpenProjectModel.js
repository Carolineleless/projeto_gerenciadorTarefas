import * as yup from 'yup';

export const validationsOpenProject = yup.object().shape({
  taskName: yup.string().required("O nome da tarefa é obrigatório"),
  taskResponsable: yup.string().required("O responsável pela tarefa é obrigatório"),
  taskDescription: yup.string().required("A descrição da tarefa é obrigatória"),
  taskStartDate: yup
    .date()
    .required("A data de início é obrigatória")
    .test(
      "is-startDate-before-finalDate",
      "A data de início deve ser anterior à data de conclusão",
      function (startDate) {
        const finalDate = this.parent.taskFinalDate;
        if (startDate && finalDate) {
          return new Date(startDate) < new Date(finalDate);
        }
        return true;
      }
    ),
  taskFinalDate: yup
    .date()
    .min(yup.ref('taskStartDate'), "A data de conclusão deve ser posterior à data de início")
    .required("A data de conclusão é obrigatória"),
  taskStatus: yup.string().required("O status da tarefa é obrigatório"),
  });