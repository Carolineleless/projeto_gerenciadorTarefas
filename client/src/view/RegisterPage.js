// components/RegisterPage.js

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsRegister } from "../model/AuthModel";
import { register } from "../controller/AuthController";
import "./Register.css";
import Axios from "axios";

const Register = () => {
    const handleRegister = (values) => {
        register(values.email, values.password)
            .then((response) => {
                alert(response.data.msg);
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <main>
            <h1>Junte-se a Nós</h1>
            <h2>Seja membro da equipe ABC Tech</h2>
            <Formik
                initialValues={{}}
                onSubmit={handleRegister}
                validationSchema={validationsRegister}
            >
                <Form className="register-form">
                    <label>E-mail</label>
                    <div className="register-form-group">
                        <Field class="field-form" name="email" className="form-field" placeholder="Email"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="email"
                            className="form-error"
                        />
                    </div>
                    <label>Senha</label>
                    <div className="form-group">
                        <Field class="field-form" name="password" className="form-field" placeholder="Senha" />
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error"
                        />
                    </div>
                    <label>Confirmar Senha</label>
                    <div className="form-group">
                        <Field class="field-form" name="confirmation" className="form-field" placeholder="Senha"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="confirmation"
                            className="form-error"
                        />
                    </div>
                    <input type="submit" value="Criar Conta" class="submit-button"/>
                </Form>
            </Formik>
            <a href="/login">Voltar para login</a>
        </main>
    );
};

export default Register;
