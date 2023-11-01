import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsLinkProject } from "../model/LinkProjectModel";
import { vincularAoProjeto } from "../controller/AuthController";
import { useNavigate } from "react-router-dom";


const LinkProject = () => {
    const navigate = useNavigate();

    const handleLinkProject = (values) => {
        vincularAoProjeto(values.idProject, values.name, values.responsable, values.email)
            .then((response) => {
                if (response.data.msg === "Vinculado com sucesso") {
                    const idLogin = response.data.idLogin;
                    alert("Projeto criado com sucesso. Clique em OK para voltar para a página de projetos.");
                    setTimeout(() => {
                        navigate(`/projetos/${idLogin}`);
                    }, 1000);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <main>
            <h1>Vincule-se a um projeto</h1>
            <Formik
                initialValues={{}}
                onSubmit={handleLinkProject}
                validationSchema={validationsLinkProject}
            >
                <Form className="linkProject-form">
                    <label>Id do projeto</label>
                    <div className="linkProject-form-group">
                        <Field class="field-form" name="idProject" className="form-field" placeholder="id do projeto" />
                        <br />
                        <ErrorMessage
                            component="span"
                            name="idProject"
                            className="form-error"
                        />
                    </div>
                    <label>Nome do projeto</label>
                    <div className="linkProject-form-group">
                        <Field class="field-form" name="name" className="form-field" placeholder="nome do projeto" />
                        <br />
                        <ErrorMessage
                            component="span"
                            name="name"
                            className="form-error"
                        />
                    </div>
                    <label>Responsável pelo projeto</label>
                    <div className="linkProject-form-group">
                        <Field class="field-form" name="responsable" className="form-field" placeholder="responsável" />
                        <br />
                        <ErrorMessage
                            component="span"
                            name="responsable"
                            className="form-error"
                        />
                    </div>
                    <label>Seu email. Use o mesmo do login:</label>
                    <div className="linkProject-form-group">
                        <Field class="field-form" name="email" className="form-field" placeholder="email" />
                        <br />
                        <ErrorMessage
                            component="span"
                            name="email"
                            className="form-error"
                        />
                    </div>
                    <input type="submit" value="Vincular ao projeto" class="submit-button" />
                </Form>
            </Formik>
            <a href="/projetos">Voltar para meus projetos</a>
        </main>
    );
};

export default LinkProject;
