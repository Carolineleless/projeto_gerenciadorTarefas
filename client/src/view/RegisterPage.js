import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsRegister } from "../model/AuthModel";
import { register } from "../controller/AuthController";
import "./Register.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    const isMounted = useRef(true); 

    const handleRegister = (values) => {
        register(values.email, values.name, values.office, values.occupationArea, values.responsibleName, values.password)
            .then((response) => {
                if (response.data.msg === "Usuário cadastrado com sucesso") {
                    setShowNotification(true);
                    
                    setTimeout(() => {
                        navigate("/login");
                    }, 4000);
                } else {
                    alert("Não foi possível realizar o cadastro.");
                    console.log(response);
                }
            })
            .catch((error) => {
                console.error("Erro na solicitação Axios:", error);
                alert("Erro na solicitação Axios. Verifique a console para detalhes.");
            });
    };

    useEffect(() => {
        // Define um temporizador para esconder a notificação após 10 segundos
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 60000);

        return () => {
            clearTimeout(timer);
            isMounted.current = false;
        };
    }, [showNotification]);

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
                    <label>Nome do responsável</label>
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
                        <Field class="field-form" name="password" className="form-field" placeholder="Senha" type="password"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error"
                        />
                    </div>
                    <label>Confirmar Senha</label>
                    <div className="form-group">
                        <Field class="field-form" name="confirmation" className="form-field" placeholder="Senha" type="password"/>
                        <br/>
                        <ErrorMessage
                            component="span"
                            name="confirmation"
                            className="form-error"
                        />
                    </div>
                    <input type="submit" value="Criar Conta" className="submit-button"/>
                </Form>
            </Formik>

            {showNotification && (
                <div className="success-notification">
                    <p>Registro bem-sucedido! Redirecionando para a página de login em breve...</p>
                </div>
            )}

            <a href="/login">Voltar para login</a>
        </main>
    );
};

export default Register;
