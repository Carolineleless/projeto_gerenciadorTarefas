import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsLogin } from "../model/AuthModel";
import { login } from "../controller/AuthController";
import "./Login.css";
import logo from "../resources/(Logo) ABC Tech.svg";
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const handleLogin = (values) => {
        login(values.email, values.password)
            .then((response) => {
                if (response.data.msg === "Usuário logado") {
                    const idLogin = response.data.idLogin;
                    navigate(`/projetos/${idLogin}`);
                }
                else {
                    alert("Não foi possível realizar o cadastro.");
                    console.log("erro ao logar usuario");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <main>
            <h1>Entrar</h1>
            <img src={logo} alt="logo" class="logo" />

            <Formik
                initialValues={{}}
                onSubmit={handleLogin}
                validationSchema={validationsLogin}
            >
                <Form>
                    <label class="label">E-mail</label>
                    <div className="login-form-group">
                        <Field name="email" className="form-field" placeholder="Email" />
                        <ErrorMessage
                            component="span"
                            name="email"
                            className="form-error"
                        />
                    </div>
                    <label class="label">Senha</label>
                    <div className="form-group">
                        <Field name="password" className="form-field" placeholder="Senha" type="password"/>
                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error"
                        />
                    </div>
                    <input class="submit-button" type="submit" value="Logar" />
                </Form>
            </Formik>
            <section class="login-options">
                <a href="/recover_password">Recuperar Senha</a>
                <a href="/register">Criar Conta</a>
            </section>
        </main>
    );
};

export default Login;