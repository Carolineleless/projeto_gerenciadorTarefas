import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { login, verProjeto } from "../controller/AuthController";
import { Formik, Form, Field, ErrorMessage } from "formik";

const ProjetosPage = () => {
  const [nameProject, setNameProject] = useState("");
  const [projeto, setProjeto] = useState({});
  const { idLogin } = useParams();
  const [hasProject, setHasProject] = useState(false);

  useEffect(() => {
    verProjeto(idLogin)
      .then((response) => {
        setProjeto(response.data);
        const projectName = response.data.nameProject;
        setNameProject(projectName);
        setHasProject(true);
      })
      .catch((error) => {
        console.error(error);
        setHasProject(false);
      });
  }, [idLogin]);

  return (
    <main>
      <h1>Projetos</h1>

      {hasProject ? (
        <React.Fragment>
          <p>Nome do Projeto: <br /> {nameProject}</p>
          <section className="project-list">
            <div className="project-item">
              <Link to={`/abrir_projeto/${idLogin}`}>
                <button>Abrir meu projeto</button>
              </Link>
            </div>
          </section>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>Você não possui nenhum projeto vinculado.</p>
          <section className="project-list">
            <div className="project-item">
              <Link to={`/vincular_projeto/${idLogin}`}>
                <button class="standard-button">Vincular-se a um projeto</button>
              </Link>
            </div>
            <br />
            <div className="project-item">
              <Link to={`/criar_projeto/${idLogin}`}>
                <button class="standard-button">Criar projeto</button>
              </Link>
            </div>
          </section>
        </React.Fragment>
      )}
    </main>
  );
};

export default ProjetosPage;
