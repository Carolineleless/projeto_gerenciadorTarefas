import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsLogin } from "../model/AuthModel";
import { login } from "../controller/AuthController";
import "./Login.css";

const Login = () => {
    const handleLogin = (values) => {
        login(values.email, values.password)
            .then((response) => {
                alert(response.data.msg);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <Formik
                initialValues={{}}
                onSubmit={handleLogin}
                validationSchema={validationsLogin}
            >
                <Form className="login-form">
                    <div className="login-form-group">
                        <Field name="email" className="form-field" placeholder="Email" />

                        <ErrorMessage
                            component="span"
                            name="email"
                            className="form-error"
                        />
                    </div>
                    {/*Outro campo*/}
                    <div className="form-group">
                        <Field name="password" className="form-field" placeholder="Senha" />

                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error"
                        />
                    </div>

                    <button className="button" type="submit">
                        Login
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default Login;
