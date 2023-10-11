import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import RecoverPasswordPage from "./view/RecoverPasswordPage"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover_password" element={<RecoverPasswordPage />} />
        <Route path="/" element={<h1>caindo aqui</h1>} />
      </Routes>
      {/* <NavigationLinks /> */}
    </Router>
  );
}

// function NavigationLinks() {
//   const location = useLocation();

//   if (location.pathname === "/register") {
//     return (
//       <Link to="/login">Ir para a página de login</Link>
//     );
//   } else if (location.pathname === "/login") {
//     return (
//       <p>
//         Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
//       </p>
//     );
//   } else {
//     return null;
//   }
// }

export default App;
