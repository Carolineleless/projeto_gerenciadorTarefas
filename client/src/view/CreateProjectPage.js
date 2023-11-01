import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationsCreateProject } from "../model/CrateProjectModel";
import { criarProjeto } from "../controller/AuthController";
import { useNavigate } from "react-router-dom";



const CreateProject = () => {
  const navigate = useNavigate();

  const handleCreateProject = (values) => {
    criarProjeto(values.name, values.type, values.company, values.startDate, values.finalDate, values.restriction, values.description, values.team, values.responsable)
      .then((response) => {
        if (response.data.msg === "Projeto criado com sucesso") {
          alert("Projeto criado com sucesso. Clique em OK para voltar para a página de projetos.");
          setTimeout(() => {
            navigate("/projetos");
          }, 1000);
        } else {
          console.log("Erro ao criar projeto");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main>
      <h1>Criar Projeto</h1>
      <Formik
        initialValues={{}}
        onSubmit={handleCreateProject}
        validationSchema={validationsCreateProject}
      >
        <Form className="createProject-form">
          <label>Nome do Projeto</label>
          <div className="createProject-form-group">
            <Field
              class="field-form"
              name="name"
              className="form-field"
              placeholder="Nome do Projeto"
            />
            <br />
            <ErrorMessage
              component="span"
              name="name"
              className="form-error"
            />
          </div>

          <label>Tipo do Projeto</label>
          <div className="createProject-form-group">
            <Field
              class="field-form"
              name="type"
              className="form-field"
              placeholder="Tipo do Projeto"
            />
            <br />
            <ErrorMessage
              component="span"
              name="type"
              className="form-error"
            />
          </div>

          <label>Empresa</label>
          <div>
            <Field
              type="text"
              id="company"
              name="company"
              class="field-form"
              className="form-field"
              placeholder="Empresa"
            />
            <ErrorMessage
              component="span"
              name="company"
              className="form-error"
            />
          </div>

          <label htmlFor="startDate">Data de Início:</label>
          <div>
            <Field
              type="date"
              id="startDate"
              name="startDate"
              class="field-form"
              className="form-field"
              placeholder="Data de Início"
            />
            <ErrorMessage
              component="span"
              name="startDate"
              className="form-error"
            />
          </div>

          <label htmlFor="finalDate">Data de Conclusão:</label>
          <div>
            <Field
              type="date"
              id="finalDate"
              name="finalDate"
              class="field-form"
              className="form-field"
              placeholder="Data de Conclusão"
            />
            <ErrorMessage
              component="span"
              name="finalDate"
              className="form-error"
            />
          </div>

          <label htmlFor="restriction">Restrições:</label>
          <div>
            <Field
              as="textarea"
              id="restriction"
              name="restriction"
              class="field-form"
              className="form-field"
              placeholder="Restrições"
            />
            <ErrorMessage
              component="span"
              name="restriction"
              className="form-error"
            />
          </div>

          <label htmlFor="description">Descrição:</label>
          <div>
            <Field
              as="textarea"
              id="description"
              name="description"
              class="field-form"
              className="form-field"
              placeholder="Descrição"
            />
            <ErrorMessage
              component="span"
              name="description"
              className="form-error"
            />
          </div>

          <label htmlFor="team">Equipe:</label>
          <div>
            <Field
              type="text"
              id="team"
              name="team"
              class="field-form"
              className="form-field"
              placeholder="Equipe"
            />
            <ErrorMessage
              component="span"
              name="team"
              className="form-error" />
          </div>

          <label htmlFor="responsable">Responsável:</label>
          <div>
            <Field
              type="text"
              id="responsable"
              name="responsable"
              class="field-form"
              className="form-field"
              placeholder="Responsável"
            />
            <ErrorMessage
              component="span"
              name="responsable"
              className="form-error" />
          </div>
          <button type="submit" class="submit-button">Criar Projeto</button>
        </Form>
      </Formik>
      <a href="/projetos">Voltar para projetos</a>
    </main>
  );
};

export default CreateProject;
