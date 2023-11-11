import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsLinkProject } from "../model/LinkProjectModel";
import { vincularAoProjeto } from "../controller/AuthController";
import { Link, useNavigate, useParams } from "react-router-dom";


const LinkProject = () => {
    const navigate = useNavigate();
    const { idLogin } = useParams();

    const handleLinkProject = (values) => {
        console.log("oioioi:", values.idProject, values.email)
        vincularAoProjeto(values.idProject, values.email)
            .then((response) => {
                if (response.data.msg === "Vinculado com sucesso") {
                    const idLogin = response.data.idLogin;
                    alert("Projeto criado com sucesso. Clique em OK para voltar para a página de projetos.");
                    setTimeout(() => {
                        navigate(`/projetos/${idLogin}`);
                    }, 1000);
                }
                else {
                    alert("Não foi encontrado nenhum projeto com essas informações.");
                }
            })
            .catch((error) => {
                console.error("erro linkProject:", error);
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
                    <label>Código do projeto</label>
                    <div className="linkProject-form-group">
                        <Field class="field-form" name="idProject" className="form-field" placeholder="id do projeto" />
                        <br />
                        <ErrorMessage
                            component="span"
                            name="idProject"
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
                    <div>
                        <Link to={`/projetos/${idLogin}`}>Voltar para meus projetos</Link>
                    </div>
                </Form>
            </Formik>
        </main>
    );
};

export default LinkProject;
