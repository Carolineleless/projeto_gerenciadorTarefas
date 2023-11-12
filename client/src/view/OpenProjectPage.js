import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { abrirProjeto, criarTarefa, excluirTarefa, editarTarefa } from "../controller/AuthController";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { validationsOpenProject } from "../model/OpenProjectModel";
import io from "socket.io-client";

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
  const [showEdicaoNotification, setShowEdicaoNotification] = useState(false);
  const [editableTaskName, setEditableTaskName] = useState("");
  const [editableResponsable, setEditableResponsable] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [editableStatus, setEditableStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [socket, setSocket] = useState(null);

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
        setUserName(response.data.userName);

        const filteredTaskNames = taskNames.filter(value => typeof value === 'string');
        console.log("dados:", description);
        setAbrirProjeto(response.data);
        setNameProject(projectName);
        setDescription(description);
        setMembers(members);
        setResponsable(responsable);
        setIdProject(idProject);
        setTaskNames(taskNames);
        setSocket(newSocket);
      })
      .catch((error) => {
        console.error(error);
      });

    // Configuração do Socket.io
    const newSocket = io("http://localhost:3002", {
      transports: ['websocket', 'polling']
    });

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.off('chat message');
        newSocket.disconnect();
      }
    };


  }, [idLogin]);


  const sendMessage = () => {
    if (currentMessage.trim() !== "" && socket) {
      const messageWithSender = `${userName}: ${currentMessage}`;
      socket.emit('chat message', messageWithSender);
      setCurrentMessage("");
    }
  };

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

  const handleEditarTarefa = (taskName) => {
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
    setEditableTaskName(selectedTaskDetails.name);
    setEditableResponsable(selectedTaskDetails.responsable);
    setEditableDescription(selectedTaskDetails.description);
    setEditableStatus(selectedTaskDetails.status);
    setIsEditing(true);
  };


  const handleSalvarEdicao = async () => {
    try {
      const updatedTask = {
        name: editableTaskName,
        responsable: editableResponsable,
        description: editableDescription,
        status: editableStatus,
      };

      const originalTask = {
        name: selectedTask.name,
        responsable: selectedTask.responsable,
        description: selectedTask.description,
        status: selectedTask.status,
      };

      const response = await editarTarefa(idProject, updatedTask, originalTask);

      if (response.data.msg === "Tarefa editada com sucesso") {
        setShowEdicaoNotification(true);
        setIsEditing(false);
        setSelectedTask(null);
      } else {
        console.error(response.msg);
        alert('Não foi possível editar a tarefa. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao chamar o método editarTarefa:', error);
      alert('Erro ao editar a tarefa. Tente novamente.');
    }
  };

  const handleAtualizarPagina = () => {
    setShowEdicaoNotification(false);
    window.location.reload();
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
          console.log(response);
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
        console.log("resp", response);
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
          isEditing ? (
            <div>
              <label>Nome da tarefa</label>
              <input
                type="text"
                value={editableTaskName}
                onChange={(e) => setEditableTaskName(e.target.value)}
              />

              <label>Responsável pela tarefa</label>
              <input
                type="text"
                value={editableResponsable}
                onChange={(e) => setEditableResponsable(e.target.value)}
              />

              <label>Descrição da tarefa</label>
              <input
                type="text"
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
              />

              <label>Status da tarefa</label>
              <input
                type="text"
                value={editableStatus}
                onChange={(e) => setEditableStatus(e.target.value)}
              />
            </div>
          ) : (
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
          )
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
        {members.map((member, index) => (
          <p key={index}>{member}</p>
        ))}
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

      {showEdicaoNotification && (
        <div className="success-notification">
          <p>A edição foi salva com sucesso.</p>
          <button onClick={handleAtualizarPagina}>Atualizar Página</button>
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
              <p>Descrição: {taskDescription[index]}</p>
              <p>Status: {taskStatus[index]}</p>
              {isEditing && selectedTask.name === taskName ? (
                <div>
                  <div>
                    <label>Nome da tarefa</label>
                    <input
                      type="text"
                      value={editableTaskName}
                      onChange={(e) => setEditableTaskName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Responsável pela tarefa</label>
                    <input
                      type="text"
                      value={editableResponsable}
                      onChange={(e) => setEditableResponsable(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Descrição da tarefa</label>
                    <input
                      type="text"
                      value={editableDescription}
                      onChange={(e) => setEditableDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Status da tarefa</label>
                    <input
                      type="text"
                      value={editableStatus}
                      onChange={(e) => setEditableStatus(e.target.value)}
                    />
                  </div>

                  <button onClick={() => handleSalvarEdicao(selectedTask.name, selectedTask)}>Salvar Edição</button>

                </div>

              ) : (
                <div>
                  <button onClick={() => handleVerTarefa(taskName)}>Ver Tarefa</button>
                  <button onClick={() => handleExcluirTarefa(taskName)}>Excluir Tarefa</button>
                  <button onClick={() => handleEditarTarefa(taskName)}>Editar Tarefa</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma tarefa foi criada.</p>
      )}
      <button onClick={() => setShowCriarTarefa(true)}>Criar tarefa</button>


      <br></br>
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>


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
