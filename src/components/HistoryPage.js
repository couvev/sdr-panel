import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./HistoryPage.module.css";

function HistoryPage({ token, username, onClose }) {
  const [calls, setCalls] = useState([]);
  const [stats, setStats] = useState({});
  const [dateRange, setDateRange] = useState("today"); // 'today', '7days', '30days', 'all'

  // Memoize fetchCallHistory
  const fetchCallHistory = useCallback(async () => {
    try {
      let startDate, endDate;
      const today = new Date();

      if (dateRange === "today") {
        startDate = formatDate(today);
        endDate = formatDate(today);
      } else if (dateRange === "7days") {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 6); // Últimos 7 dias incluindo hoje
        startDate = formatDate(pastDate);
        endDate = formatDate(today);
      } else if (dateRange === "30days") {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 29); // Últimos 30 dias incluindo hoje
        startDate = formatDate(pastDate);
        endDate = formatDate(today);
      } else {
        // 'all' or any other value
        startDate = "";
        endDate = "";
      }

      const params = {};
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }

      const response = await axios.get("http://localhost:5000/calls/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      setCalls(response.data.calls);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Erro ao obter histórico de ligações:", error);
      alert("Erro ao obter histórico de ligações.");
    }
  }, [dateRange, token]);

  // Include fetchCallHistory in the dependency array
  useEffect(() => {
    fetchCallHistory();
  }, [fetchCallHistory]);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  // Função para formatar o telefone no formato desejado
  const formatPhoneNumber = (phone) => {
    if (!phone) return "Número indisponível";

    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "");

    // Formata no padrão (00) 9 9999-9999
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(
        3,
        7
      )}-${cleaned.slice(7)}`;
    }

    return phone; // Retorna o número original caso não esteja no formato esperado
  };

  return (
    <div className={styles.historyContainer}>
      <h2>Histórico de Ligações</h2>
      <div className={styles.buttonGroup}>
        <button
          className={dateRange === "today" ? styles.active : ""}
          onClick={() => setDateRange("today")}
        >
          Hoje
        </button>
        <button
          className={dateRange === "7days" ? styles.active : ""}
          onClick={() => setDateRange("7days")}
        >
          Últimos 7 Dias
        </button>
        <button
          className={dateRange === "30days" ? styles.active : ""}
          onClick={() => setDateRange("30days")}
        >
          Últimos 30 Dias
        </button>
        <button
          className={dateRange === "all" ? styles.active : ""}
          onClick={() => setDateRange("all")}
        >
          Total
        </button>
        <button onClick={onClose} className={styles.backButton}>
          Voltar
        </button>
      </div>
      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <h3>Total de Ligações</h3>
          <p>{stats.total_calls || 0}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>Ligações Atendidas</h3>
          <p>{stats.total_answered || 0}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>Reuniões Marcadas</h3>
          <p>{stats.total_meetings || 0}</p>
        </div>
      </div>
      <table className={styles.callsTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Data e Hora</th>
            <th>Ciclo</th>
            <th>Resultado</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call._id}>
              <td>{call.contact_name}</td>
              <td>{formatPhoneNumber(call.phone_number)}</td>
              <td>{formatDateTime(call.call_time)}</td>
              <td>{call.call_cycle}</td>
              <td>{call.result}</td>
              <td>{call.contact_observations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;
