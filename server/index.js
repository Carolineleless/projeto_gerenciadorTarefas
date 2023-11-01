const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
  host: "localhost", // ALTERAR PARA 127.0.0.1 PARA ERRO DE CONEXAO
  user: "root",
  password: "root",
  database: "gerenciadorTarefas"
});

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
                  console.log(error);
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
          res.send({ msg: "Senha incorreta" });
        }
      });
    } else {
      res.json({ msg: "Usuário não registrado!" });
    }
  });
});

app.post("/criarprojeto", (req, res) => {
  const { name, type, company, startDate, finalDate, restriction, description, team, responsable } = req.body;

  db.query(
    "INSERT INTO project (name, type, company, startDate, finalDate, restriction, description, team, responsable) VALUES (?,?,?,?,?,?,?,?,?)",
    [name, type, company, startDate, finalDate, restriction, description, team, responsable],
    (error, response) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar o projeto" });
      } else {
        res.status(200).json({ msg: "Projeto criado com sucesso" });
      }
    }
  );
});

app.post("/vincularAoProjeto", (req, res) => {
  const idProject = req.body.idProject;
  const name = req.body.name;
  const responsable = req.body.responsable
  const email = req.body.email


  db.query("SELECT * FROM project WHERE idProject = ? AND name = ? AND responsable = ? ", [idProject, name, responsable], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao vincular ao projeto" });
    }

    if (result.length !== 0) {
      const project = result[0];

      // Recuperar o idProject
      const idProject = project.idProject;

      db.query("SELECT idLogin FROM user WHERE email = ?", [email], (err, userResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar o ID do usuário" });
        }

        if (userResult.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const idLogin = userResult[0].idLogin;

        db.query("INSERT INTO userProject (idLogin, idProject, nameProject) VALUES (?, ?, ?)", [idLogin, idProject, name], (insertErr, insertResult) => {
          if (insertErr) {
            console.log(insertErr);
            return res.status(500).json({ error: "Erro ao inserir dados na tabela userData" });
          }

          res.send({ msg: "Vinculado com sucesso", idLogin: idLogin });
        });
      })
    } else {
      res.json({ msg: "Dados incorretos." });
    }
  });
});

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});

app.post("/verProjeto", (req, res) => {
  const idLogin = req.body.idLogin;

  db.query("SELECT * FROM userProject WHERE idLogin = ?", [idLogin], (err, result) => {
    if (err) {
      res.send(err);
    }

    if (result[0].idLogin == idLogin) {
      res.send({ msg: "Vinculado com sucesso", nameProject: result[0].nameProject });
    } else {
      res.send({ msg: "Nao foi encontrado nenhum projeto vinculado" });
    }
  });
});