import React, { useState } from "react";
import axios from "axios";

function LoginPage({ setToken, setUsername }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username: user,
        password: password,
      });
      setToken(response.data.token);
      setUsername(user);
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="login-container">
      <h2>Fazer Login</h2>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
