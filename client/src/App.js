import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import RecoverPasswordPage from "./view/RecoverPasswordPage";
import "./App.css";
import ProjetosPage from "./view/ProjetosPage";
import CreateProjectPage from "./view/CreateProjectPage";
import LinkProjectPage from "./view/LinkProjectPage";
import OpenProjectPage from "./view/OpenProjectPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover_password" element={<RecoverPasswordPage />} />
        <Route path="/projetos/:idLogin" element={<ProjetosPage />} />
        <Route path="/criar_projeto/:idLogin" element={<CreateProjectPage />} />
        <Route path="/vincular_projeto/:idLogin" element={<LinkProjectPage />} />
        <Route path="/abrir_projeto/:idLogin" element={<OpenProjectPage />} />


        <Route path="/" element={<h1>caindo aqui</h1>} />
      </Routes>
      {/* <NavigationLinks /> */}
    </Router>
  );
}

export default App;
