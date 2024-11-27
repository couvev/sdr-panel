// src/components/Dashboard.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ContactCard from "./ContactCard";
import ResultButtons from "./ResultButtons";
import Filters from "./Filters";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import ScheduleFutureCallModal from "./ScheduleFutureCallModal";
import LoadingOverlay from "./LoadingOverlay";
import HistoryPage from "./HistoryPage";
import FutureCallsPage from "./FutureCallsPage"; // Novo componente
import styles from "./Dashboard.module.css"; // Importa o arquivo CSS para estilização

function Dashboard({ token, username, setToken, setUsername }) {
  const [contact, setContact] = useState(null);
  const [filters, setFilters] = useState({});
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showFutureCallModal, setShowFutureCallModal] = useState(false);
  const [assessors, setAssessors] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [currentTime, setCurrentTime] = useState(""); // Estado para o horário atual
  const [showHistory, setShowHistory] = useState(false);
  const [showFutureCalls, setShowFutureCalls] = useState(false); // Novo estado

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

  // Atualiza o horário a cada segundo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
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

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

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
          setShowMeetingModal(true);
        } else if (result === "Ligar no futuro") {
          setShowFutureCallModal(true);
        } else {
          await fetchContact(); // Carrega o próximo contato
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
    setShowMeetingModal(false);
    fetchContact();
  };

  const handleFutureCallScheduled = () => {
    setShowFutureCallModal(false);
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

  const handleFutureCalls = () => {
    setShowFutureCalls(true);
  };

  const handleCloseFutureCalls = () => {
    setShowFutureCalls(false);
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
      ) : showFutureCalls ? (
        <FutureCallsPage
          token={token}
          username={username}
          onClose={handleCloseFutureCalls}
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
              <button
                onClick={handleFutureCalls}
                className={styles.futureCallsButton}
              >
                Ligações Futuras
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
              <ResultButtons handleResult={handleResult} token={token} />
            </>
          ) : (
            <p>Nenhum contato disponível com os filtros atuais.</p>
          )}
          {showMeetingModal && (
            <ScheduleMeetingModal
              contact={contact}
              token={token}
              assessors={assessors}
              onClose={() => setShowMeetingModal(false)}
              onScheduled={handleMeetingScheduled}
            />
          )}
          {showFutureCallModal && (
            <ScheduleFutureCallModal
              contact={contact}
              token={token}
              onClose={() => setShowFutureCallModal(false)}
              onScheduled={handleFutureCallScheduled}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
