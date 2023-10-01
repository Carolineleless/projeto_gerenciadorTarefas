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
        <div>
            <h1>Se cadastre!</h1>
            <Formik
                initialValues={{}}
                onSubmit={handleRegister}
                validationSchema={validationsRegister}
            >
                <Form className="register-form">
                    <div className="register-form-group">
                        <Field name="email" className="form-field" placeholder="Email" />

                        <ErrorMessage
                            component="span"
                            name="email"
                            className="form-error"
                        />
                    </div>

                    <div className="form-group">
                        <Field name="password" className="form-field" placeholder="Senha" />

                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error"
                        />
                    </div>

                    <div className="form-group">
                        <Field
                            name="confirmation"
                            className="form-field"
                            placeholder="Senha"
                        />

                        <ErrorMessage
                            component="span"
                            name="confirmation"
                            className="form-error"
                        />
                    </div>

                    <button className="button" type="submit">
                        Cadastrar
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default Register;
