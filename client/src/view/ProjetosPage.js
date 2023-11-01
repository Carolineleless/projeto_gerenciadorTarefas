import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { login, verProjeto } from "../controller/AuthController";
import { Formik, Form, Field, ErrorMessage } from "formik";

const ProjetosPage = () => {
  const [nameProject, setNameProject] = useState("");
  const [projeto, setProjeto] = useState({});
  const { idLogin } = useParams();

  useEffect(() => {
    verProjeto(idLogin)
      .then((response) => {
        setProjeto(response.data);
        const projectName = response.data.nameProject;
        setNameProject(projectName);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [idLogin]);

  return (
    <main>
      <h1>Projeto</h1>
      <p>Nome do Projeto: <br /> {nameProject}</p>
      <section className="project-list">
        <div className="project-item">
          <Link to="/entrar_projeto">
            <button>Abrir meu projeto</button>
          </Link>
        </div>
        <br />
        <div className="project-item">
          <Link to="/vincular_projeto">
            <button>Vincular-se a um projeto</button>
          </Link>
        </div>
        <br />
        <div className="project-item">
          <Link to="/criar_projeto">
            <button>Criar projeto</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ProjetosPage;
