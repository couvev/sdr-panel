import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  // Inicializa o token e o nome do usuário a partir do localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  // Atualiza o localStorage sempre que o token ou username mudarem
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); // Salva o token no localStorage
      localStorage.setItem("username", username); // Salva o nome do usuário no localStorage
    } else {
      localStorage.removeItem("token"); // Remove o token se for nulo
      localStorage.removeItem("username"); // Remove o nome do usuário se o token for nulo
    }
  }, [token, username]);

  // Verifica se o token ainda é válido ao montar o componente
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/validate-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            setToken(null); // Token inválido, remove-o
            setUsername(""); // Remove o nome do usuário
          }
        } catch (error) {
          console.error("Erro ao validar o token:", error);
          setToken(null);
          setUsername("");
        }
      }
    };

    checkTokenValidity();
  }, [token]);

  // Redireciona para a tela de login se o token não estiver disponível
  if (!token) {
    return <LoginPage setToken={setToken} setUsername={setUsername} />;
  }

  // Renderiza o dashboard se o token estiver válido
  return (
    <Dashboard
      token={token}
      username={username}
      setToken={setToken}
      setUsername={setUsername}
    />
  );
}

export default App;
