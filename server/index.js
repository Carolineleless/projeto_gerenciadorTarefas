const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const http = require('http');
const socketIo = require('socket.io');

const db = mysql.createPool({
  host: "localhost", // ALTERAR PARA 127.0.0.1 PARA ERRO DE CONEXAO
  user: "root",
  password: "root",
  database: "gerenciadorTarefas"
});

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { name, office, occupationArea, responsibleName } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao verificar o email" });
    }

    if (result.length === 0) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO user (email, password) VALUES (?, ?)",
          [email, hash],
          (error, response) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ error: "Erro ao realizar cadastro" });
            }

            const idLogin = response.insertId;
            db.query(
              "INSERT INTO userData (idLogin, name, office, occupationArea, responsibleName) VALUES (?, ?, ?, ?, ?)",
              [idLogin, name, office, occupationArea, responsibleName],
              (error, response) => {
                if (error) {
                  console.log("error idLogin 1:".error);
                  return res.status(500).json({ error: "Erro ao realizar cadastro" });
                }

                res.json({ msg: "Usuário cadastrado com sucesso" });
              }
            );
          }
        );
      });
    } else {
      res.json({ msg: "Email já cadastrado" });
    }
  });
});



app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log("error idLog 2:", err);
      res.send(err);
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (error) {
          res.send(error);
        }

        const idLogin = result[0].idLogin;

        if (response) {
          res.send({ msg: "Usuário logado", idLogin: idLogin });
        } else {
          console.log("error Idlogin 2")
          res.send({ msg: "Senha incorreta" });
        }
      });
    } else {
      res.json({ msg: "Usuário não registrado!" });
    }
  });
});

app.post("/criarProjeto", (req, res) => {
  const { name, type, company, startDate, finalDate, restriction, description, responsable, idLogin } = req.body;
  console.log(name, type, company, startDate, finalDate, restriction, description, responsable, idLogin);

  db.query(
    "INSERT INTO project (name, type, company, startDate, finalDate, restriction, description, responsable) VALUES (?,?,?,?,?,?,?,?)",
    [name, type, company, startDate, finalDate, restriction, description, responsable],
    (error, response) => {
      if (error) {
        console.log("errooor:", error);
        res.status(500).json({ error: "Erro ao criar o projeto" });
      } else {
        const idProject = response.insertId;
        res.status(200).json({ msg: "Projeto criado com sucesso", idProject: idProject });
      }
    }
  );
});

app.post("/vincularAoProjeto", (req, res) => {
  const idProject = req.body.idProject;
  const email = req.body.email;

  db.query("SELECT * FROM project WHERE idProject = ? ", [idProject], (err, result) => {
    if (err) {

      console.log(err);
      return res.status(500).json({ error: "Erro ao vincular ao projeto" });
    }

    if (result.length !== 0) {
      const project = result[0];

      const idProject = project.idProject;
      const nameProject = project.name;

      db.query("SELECT idLogin FROM user WHERE email = ?", [email], (err, userResult) => {
        if (err) {
          console.log("erro aqui 3:", err);
          return res.status(500).json({ error: "Erro ao buscar o ID do usuário" });
        }

        if (userResult.length === 0) {
          console.log("erro aqui 2:", err);
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const idLogin = userResult[0].idLogin;

        db.query("INSERT INTO userProject (idLogin, idProject, nameProject) VALUES (?, ?, ?)", [idLogin, idProject, nameProject], (insertErr, insertResult) => {
          if (insertErr) {
            console.log("error aqui 4:", insertErr);
            return res.status(500).json({ error: "Erro ao inserir dados na tabela userData" });
          }

          res.send({ msg: "Vinculado com sucesso", idLogin: idLogin });
        });
      })
    } else {
      res.send({ msg: "Dados incorretos" });
    }
  });
});

app.post("/verProjeto", (req, res) => {
  const idLogin = req.body.idLogin;
  db.query("SELECT * FROM userProject WHERE idLogin = ?", [idLogin], (err, result) => {
    if (err) {
      console.log("na vdd aqui!!!!");
      res.send(err);
    }

    if (result[0].idLogin == idLogin) {
      res.send({ msg: "Vinculado com sucesso", nameProject: result[0].nameProject });
    } else {
      res.send({ msg: "Nao foi encontrado nenhum projeto vinculado" });
    }
  });
});


app.post("/abrirProjeto", (req, res) => {
  const idLogin = req.body.idLogin;

  db.query("SELECT * FROM userProject WHERE idLogin = ?", [idLogin], (err, result) => {
    if (err) {
      console.log("error aqui 5: ", err)
      res.send(err);
    }

    if (result[0].idLogin == idLogin) {
      db.query("SELECT * FROM project WHERE idProject = ?", [result[0].idProject], (err, result) => {
        if (err) {
          console.log("err aqui 6:", err)
          res.send(err);
        }
        db.query("SELECT * FROM task WHERE idProject = ?", [result[0].idProject], (err, taskResults) => {
          if (err) {
            res.send(err);
            return;
          }

          db.query("SELECT * FROM userData WHERE idLogin = ?", [idLogin], (err, resultUser) => {
            if (err) {
              console.log("err aqui 7:", err)
              res.send("user erro in abrirProjeto:", err);
            }

            db.query(
              "SELECT user.name, project.idProject FROM userProject project INNER JOIN userData user ON user.idLogin = project.idLogin WHERE project.idProject = ?",
              [result[0].idProject],
              (err, resultMembers) => {
                if (err) {
                  console.log("Erro na consulta membros:", err);
                  res.send("Erro na consulta membros:", err);
                }
                const members = resultMembers.map(member => member.name);

                const taskNames = taskResults.map((task) => task.name);
                const taskDescription = taskResults.map((task) => task.description);
                const taskStartDate = taskResults.map((task) => task.startDate);
                const taskFinalDate = taskResults.map((task) => task.finalDate);
                const taskDependencies = taskResults.map((task) => task.dependencies);
                const taskStatus = taskResults.map((task) => task.status);
                const taskResponsable = taskResults.map((task) => task.responsable);
                const taskObservation = taskResults.map((task) => task.observation);
                const userName = resultUser[0].name;

                console.log("user e memberr", members, userName)
                res.send({
                  msg: "informacoes obtidas", idProject: result[0].idProject, nameProject: result[0].name, description: result[0].description,
                  members: members, responsable: result[0].responsable, taskName: taskNames, taskDescription: taskDescription,
                  taskStartDate: taskStartDate, taskFinalDate: taskFinalDate, taskDependencies: taskDependencies, taskStatus: taskStatus, taskResponsable: taskResponsable,
                  taskObservation: taskObservation, userName: userName
                });
              });
          });
        });
      });
    } else {
      res.send({ msg: "Nao foi encontrado nenhum projeto vinculado" });
    }
  });
});

app.post("/criarTarefa", (req, res) => {
  const { idProject, taskName, taskResponsable, taskDescription, taskStartDate, taskFinalDate, taskDependencies, taskObservation, taskStatus } = req.body;

  db.query("SELECT * FROM task WHERE idProject = ? AND name = ?", [idProject, taskName], (err, resultNameTask) => {

    if (err) {
      res.send("error criar tarefa:", err);
    }
    if (resultNameTask.length > 0) {
      return res.json({ msg: "task com mesmo nome" });
    } else {
      db.query("INSERT INTO task (idProject, name, description, startDate, finalDate, dependencies, observation, status, responsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [idProject, taskName, taskDescription, taskStartDate, taskFinalDate, taskDependencies, taskObservation, taskStatus, taskResponsable],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.log(insertErr);
            return res.status(500).json({ error: "Erro ao criar tarefa" });
          }
        });
      return res.json({ msg: "task inserida com sucesso" });
    };
  });
});

app.post("/excluirTarefa", (req, res) => {
  const { taskName, idProject } = req.body;

  db.query("DELETE FROM task WHERE idProject = ? AND name = ?", [idProject, taskName], (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.log(deleteErr);
      return res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
    return res.json({ msg: "Tarefa excluída com sucesso" });
  });
});

app.post("/editarTarefa", (req, res) => {
  const { idProject, updatedTask, originalTask } = req.body;
  const { name: originalTaskName, responsable: originalResponsable, description: originalDescription, status: originalStatus } = originalTask;

  const { name: taskName, responsable, description, status } = updatedTask;

  db.query(
    "UPDATE task SET name = ?, responsable = ?, description = ?, status = ? WHERE idProject = ? AND name = ?",
    [taskName, responsable, description, status, idProject, originalTaskName],
    (updateErr, updateResult) => {
      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json({ error: "Erro ao editar tarefa" });
      }

      return res.json({ msg: "Tarefa editada com sucesso" });
    }
  );
});

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3002, () => {
  console.log("Servidor Socket.io e Express rodando nas portas 3001 e 3002");
});