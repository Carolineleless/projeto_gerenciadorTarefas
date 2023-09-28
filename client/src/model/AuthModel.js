import * as yup from "yup";

export const validationsLogin = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().min(8, "A senha deve ter pelo menos 8 caracteres").required("A senha é obrigatória"),
});

export const validationsRegister = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().min(8, "A senha deve ter pelo menos 8 caracteres").required("A senha é obrigatória"),
  confirmation: yup.string().oneOf([yup.ref("password"), null], "As senhas são diferentes").required("A confirmação da senha é obrigatória"),
});
