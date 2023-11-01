// components/RegisterPage.js

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsRegister } from "../model/AuthModel";
import { register } from "../controller/AuthController";
import "./Register.css";

const Register = () => {
    const handleRegister = (values) => {
        register(values.email, values.name, values.office, values.occupationArea, values.responsibleName, values.password)
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

                    <label>Nome</label>
                    <div className="register-form-group">
                        <Field class="field-form" name="name" className="form-field" placeholder="nome"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="name"
                            className="form-error"
                        />
                    </div>
                    <label>Departamento</label>
                    <div className="register-form-group">
                        <Field class="field-form" name="office" className="form-field" placeholder="departamento"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="office"
                            className="form-error"
                        />
                    </div>
                    <label>Área de ocupação</label>
                    <div className="register-form-group">
                        <Field class="field-form" name="occupationArea" className="form-field" placeholder="área de ocupação"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="occupationArea"
                            className="form-error"
                        />
                    </div>
                    <label>Nome do responsável (caso você seja o responsável, deixe em branco)</label>
                    <div className="register-form-group">
                        <Field class="field-form" name="responsibleName" className="form-field" placeholder="nome do responsável"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="responsibleName"
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
