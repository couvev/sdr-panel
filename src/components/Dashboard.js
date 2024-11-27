// src/components/Dashboard.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ContactCard from "./ContactCard";
import ResultButtons from "./ResultButtons";
import Filters from "./Filters";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import LoadingOverlay from "./LoadingOverlay";
import HistoryPage from "./HistoryPage";
import styles from "./Dashboard.module.css"; // Importa o arquivo CSS para estilização

function Dashboard({ token, username, setToken, setUsername }) {
  const [contact, setContact] = useState(null);
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [assessors, setAssessors] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [currentTime, setCurrentTime] = useState(""); // Estado para o horário atual
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchAssessors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/assessors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssessors(response.data.assessors);
      } catch (error) {
        console.error("Erro ao obter assessores:", error);
      }
    };
    fetchAssessors();
  }, [token]);

  const fetchContact = useCallback(async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const response = await axios.post(
        "http://localhost:5000/contacts/next",
        { filters: filters },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Contato obtido:", response.data.contact);
      if (response.data.contact) {
        setContact(response.data.contact);
      } else {
        setContact(null);
      }
    } catch (error) {
      setContact(null);
      console.error("Erro ao obter contato:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }, [filters, token]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  // Adicionar o useEffect para atualizar o horário a cada segundo
  useEffect(() => {
    // Função para atualizar o horário
    const updateTime = () => {
      const now = new Date();
      // Converter o horário para o fuso horário de Brasília (-03:00)
      const options = {
        timeZone: "America/Sao_Paulo",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formatter = new Intl.DateTimeFormat("pt-BR", options);
      const formattedTime = formatter.format(now);
      setCurrentTime(formattedTime);
    };

    // Atualizar o horário imediatamente ao montar o componente
    updateTime();
    // Atualizar o horário a cada segundo
    const intervalId = setInterval(updateTime, 1000);

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);

  const handleResult = async (result) => {
    if (contact) {
      try {
        setLoading(true); // Inicia o carregamento
        const response = await axios.post(
          "http://localhost:5000/calls/log",
          {
            contact_id: contact._id,
            result,
            phone_number: contact.MOBILE_PHONE,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.error) {
          console.error("Erro ao registrar ligação:", response.data.error);
          alert("Erro ao registrar ligação: " + response.data.error);
          setLoading(false); // Finaliza o carregamento
          return;
        }

        if (result === "Reunião Marcada") {
          setShowModal(true);
        } else {
          await fetchContact(); // Aguarda o próximo contato ser carregado
        }
      } catch (error) {
        console.error("Erro ao registrar ligação:", error);
        alert("Erro ao registrar ligação.");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }
  };

  const handleMeetingScheduled = () => {
    setShowModal(false);
    fetchContact();
  };

  const handleLogout = () => {
    setToken(null);
    setUsername("");
  };

  const handleHistory = () => {
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      {loading && <LoadingOverlay />}
      {showHistory ? (
        <HistoryPage
          token={token}
          username={username}
          onClose={handleCloseHistory}
        />
      ) : (
        <>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.username}>Bem-vindo, {username}</h2>
            <div className={styles.timeContainer}>
              <span className={styles.currentTime}>{currentTime}</span>
            </div>
            <div className={styles.headerButtons}>
              <button onClick={handleHistory} className={styles.historyButton}>
                Histórico
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Sair
              </button>
            </div>
          </div>
          <Filters token={token} setFilters={setFilters} />
          {contact ? (
            <>
              <ContactCard contact={contact} token={token} />
              <ResultButtons handleResult={handleResult} />
            </>
          ) : (
            <p>Nenhum contato disponível com os filtros atuais.</p>
          )}
          {showModal && (
            <ScheduleMeetingModal
              contact={contact}
              token={token}
              assessors={assessors}
              onClose={() => setShowModal(false)}
              onScheduled={handleMeetingScheduled}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
