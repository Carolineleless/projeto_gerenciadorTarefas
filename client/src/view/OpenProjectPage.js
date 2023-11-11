import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { abrirProjeto, criarTarefa, excluirTarefa } from "../controller/AuthController";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { validationsOpenProject } from "../model/OpenProjectModel";

const OpenProject = () => {
  const { idLogin } = useParams();
  const [nameProject, setNameProject] = useState("");
  const [projeto, setAbrirProjeto] = useState({});
  const [showSobreProjeto, setShowSobreProjeto] = useState(false);
  const [showMembros, setShowMembros] = useState(false);
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [responsable, setResponsable] = useState([]);
  const [showCriarTarefa, setShowCriarTarefa] = useState(false);
  const [idProject, setIdProject] = useState({});
  const [taskNames, setTaskNames] = useState([]);
  const [showTarefaModal, setShowTarefaModal] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState("");
  const [showExclusaoNotification, setShowExclusaoNotification] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDescription, setTaskDescription] = useState([]);
  const [taskStartDate, setTaskStartDate] = useState([]);
  const [taskFinalDate, setTaskFinalDate] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [taskResponsable, setTaskResponsable] = useState([]);
  const [taskDependencies, setTaskDependencies] = useState([]);
  const [taskObservation, setTaskObservation] = useState([]);
  const [showCriacaoTarefaNotification, setShowCriacaoTarefaNotification] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    abrirProjeto(idLogin)
      .then((response) => {
        const projectName = response.data.nameProject;
        const description = response.data.description;
        const members = response.data.members;
        const responsable = response.data.responsable;
        const idProject = response.data.idProject;
        const taskNames = Object.values(response.data.taskName);
        setTaskDescription(response.data.taskDescription);
        setTaskStartDate(response.data.taskStartDate);
        setTaskFinalDate(response.data.taskFinalDate);
        setTaskStatus(response.data.taskStatus);
        setTaskResponsable(response.data.taskResponsable)
        setTaskDependencies(response.data.taskDependencies);
        setTaskObservation(response.data.taskObservation);


        const filteredTaskNames = taskNames.filter(value => typeof value === 'string'); // Filtrar apenas as strings (nomes das tarefas)
        console.log(description, members);
        setAbrirProjeto(response.data);
        setNameProject(projectName);
        setDescription(description);
        setMembers(members);
        setResponsable(responsable);
        setIdProject(idProject);
        setTaskNames(taskNames);

      })
      .catch((error) => {
        console.error(error);
      });
  }, [idLogin]);

  const handleVerTarefa = (taskName) => {
    const taskIndex = taskNames.indexOf(taskName);
    const selectedTaskDetails = {
      name: taskName,
      responsable: taskResponsable[taskIndex],
      description: taskDescription[taskIndex],
      startDate: taskStartDate[taskIndex],
      endDate: taskFinalDate[taskIndex],
      status: taskStatus[taskIndex],
      dependencies: taskDependencies[taskIndex],
      observation: taskObservation[taskIndex]
    };

    setSelectedTask(selectedTaskDetails);
    setShowTarefaModal(true);
  };

  const handleExcluirTarefa = (taskName) => {
    excluirTarefa(
      taskName,
      idProject
    )
      .then((response) => {
        if (response.data.msg == "Tarefa excluída com sucesso") {
          setShowExclusaoNotification(true);
          setTimeout(() => {
            setShowExclusaoNotification(false);
          }, 3000);
          setTaskNames((prevTaskNames) => prevTaskNames.filter((name) => name !== taskName));
        } else {
          alert("Não foi possível deletar a tarefa. Tente novamente.");
        }
      })
  };

  const handleOpenProject = (values) => {
    criarTarefa(
      values.taskName,
      values.taskResponsable,
      values.taskDescription,
      values.taskStartDate,
      values.taskFinalDate,
      values.taskDependencies,
      values.taskObservation,
      values.taskStatus,
      idProject
    )
      .then((response) => {
        if (response.data.msg === "task inserida com sucesso") {
          setTaskNames((prevTaskNames) => [...prevTaskNames, values.taskName]);
          setTaskResponsable((prevTaskResponsable) => [...prevTaskResponsable, values.taskResponsable]);
          setTaskDescription((prevTaskDescription) => [...prevTaskDescription, values.taskDescription]);
          setTaskStatus((prevTaskStatus) => [...prevTaskStatus, values.taskStatus]);
          setTaskStartDate((prevTaskStartDate) => [...prevTaskStartDate, values.taskStartDate]);
          setTaskFinalDate((prevTaskFinalDate) => [...prevTaskFinalDate, values.taskFinalDate]);
          setTaskDependencies((prevTaskDependencies) => [...prevTaskDependencies, values.taskDependencies]);
          setTaskObservation((prevTaskObservation) => [...prevTaskObservation, values.taskObservation]);


          setAbrirProjeto(response.data);
          setNameProject(response.data.nameProject);
          setDescription(response.data.description);
          setMembers(response.data.members);

          setShowCriacaoTarefaNotification(true);
          setTimeout(() => {
            setShowCriacaoTarefaNotification(false);
          }, 3000);
          setShowCriarTarefa(false);

        }
        if (response.data.msg === "Erro ao criar tarefa") {
          alert("Não foi possível criar a tarefa.");
        }
        if (response.data.msg === "task com mesmo nome") {
          alert("Já existe uma tarefa com esse nome no projeto.");
        }

      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main>
      <h1>{nameProject}</h1>

      <button onClick={() => setShowSobreProjeto(true)}>Sobre o Projeto</button>
      <button onClick={() => setShowMembros(true)}>Membros</button>

      <p>Responsável: {responsable}</p>

      <Modal
        isOpen={showTarefaModal}
        onRequestClose={() => setShowTarefaModal(false)}
        contentLabel="Visualizar Tarefa Modal"
      >
        {selectedTask ? (
          <div>
            <h2>{selectedTask.name}</h2>
            <p>Responsável pela tarefa: {selectedTask.responsable}</p>
            <p>Descrição da tarefa: {selectedTask.description}</p>
            <p>Início da tarefa: {selectedTask.startDate}</p>
            <p>Fim da tarefa: {selectedTask.endDate}</p>
            <p>Status da tarefa: {selectedTask.status}</p>
            <p>Dependências da tarefa: {selectedTask.dependencies}</p>
            <p>Observação: {selectedTask.observation}</p>
            <button onClick={() => setShowTarefaModal(false)}>Fechar</button>
          </div>
        ) : (
          <p>Nenhuma tarefa selecionada.</p>
        )}
      </Modal>

      <Modal
        isOpen={showSobreProjeto}
        onRequestClose={() => setShowSobreProjeto(false)}
        contentLabel="Sobre o Projeto Modal"
      >
        <h2>Sobre o Projeto</h2>
        <p>{description}</p>
        <button onClick={() => setShowSobreProjeto(false)}>Fechar</button>
      </Modal>

      <Modal
        isOpen={showMembros}
        onRequestClose={() => setShowMembros(false)}
        contentLabel="Membros Modal"
      >
        <h2>Membros</h2>
        <p>{members}</p>
        <button onClick={() => setShowMembros(false)}>Fechar</button>
      </Modal>

      {showExclusaoNotification && (
        <div className="success-notification">
          <p>A tarefa foi excluída com sucesso.</p>
          <button onClick={() => setShowExclusaoNotification(false)}>Fechar</button>
        </div>
      )}

      {showCriacaoTarefaNotification && (
        <div className="success-notification">
          <p>A tarefa foi criada com sucesso.</p>
          <button onClick={() => setShowCriacaoTarefaNotification(false)}>Fechar</button>
        </div>
      )}


      <br />

      <h2>Tarefas</h2>
      {taskNames.length > 0 ? (
        <ul>
          {taskNames.map((taskName, index) => (
            <li key={index}>
              {taskName}
              <p>Responsável: {taskResponsable[index]}</p>
              <p>Status: {taskStatus[index]}</p>
              <button onClick={() => handleVerTarefa(taskName)}>Ver Tarefa</button>
              <button onClick={() => handleExcluirTarefa(taskName)}>Excluir Tarefa</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma tarefa criada ainda.</p>
      )}
      <button onClick={() => setShowCriarTarefa(true)}>Criar tarefa</button>

      <Modal
        isOpen={showCriarTarefa}
        onRequestClose={() => setShowCriarTarefa(false)}
        contentLabel="Criar Tarefas Modal"
      >
        <Formik
          initialValues={{
            taskStatus: "to-do",
          }}
          onSubmit={handleOpenProject}
          validationSchema={validationsOpenProject}
        >
          <Form className="openProject-form">
            <label>Nome da tarefa</label>
            <Field type="text" name="taskName" placeholder="nome da tarefa" />
            <ErrorMessage component="span" name="taskName" />

            <label>Responsável pela tarefa</label>
            <Field
              type="text"
              name="taskResponsable"
              placeholder="responsável"
            />
            <ErrorMessage component="span" name="taskResponsable" />

            <label>Descrição da tarefa</label>
            <Field
              type="text"
              name="taskDescription"
              placeholder="descrição"
            />
            <ErrorMessage component="span" name="taskDescription" />

            <label>Data de Início</label>
            <Field type="date" name="taskStartDate" />
            <ErrorMessage component="span" name="taskStartDate" />

            <label>Data de Término</label>
            <Field type="date" name="taskFinalDate" />
            <ErrorMessage component="span" name="taskFinalDate" />

            <label>Dependências</label>
            <Field
              type="text"
              name="taskDependencies"
              placeholder="dependências"
            />
            <ErrorMessage component="span" name="taskDependencies" />

            <label>Observação</label>
            <Field
              type="text"
              name="taskObservation"
              placeholder="observação"
            />
            <ErrorMessage component="span" name="taskObservation" />

            <label>Status</label>
            <Field as="select" name="taskStatus">
              <option value="to-do">To-Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-test">In Test</option>
              <option value="done">Done</option>
            </Field>
            <ErrorMessage component="span" name="taskStatus" />

            <button type="submit" className="submit-button">
              Criar Tarefa
            </button>
          </Form>
        </Formik>
      </Modal>
    </main>
  );
};

export default OpenProject;
