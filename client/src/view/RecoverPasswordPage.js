import React from "react";
import "./RecoverPassword.css"

const RecoverPassword = () => {
    return (
        <main>
            <h1>Esqueceu a senha?</h1>
            <h2>Relaxa! Nos informe o seu e-mail:</h2>
            <form action="">
                <label class="label">E-mail</label>
                <input type="email" placeholder="example@email.com" class="field-form"/>
                <input type="submit" value="Enviar e-mail" class="submit-button"/>
            </form>
            <a href="/login">Voltar para o login</a>
        </main>
    );
};

export default RecoverPassword;