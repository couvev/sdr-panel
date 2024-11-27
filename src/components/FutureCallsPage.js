// src/components/FutureCallsPage.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CallResultModal from "./CallResultModal";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import ScheduleFutureCallModal from "./ScheduleFutureCallModal";
import styles from "./FutureCallsPage.module.css";

function FutureCallsPage({ token, username, onClose }) {
  const [futureCalls, setFutureCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showFutureCallModal, setShowFutureCallModal] = useState(false);

  const [assessors, setAssessors] = useState([]);

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

  const fetchFutureCalls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/future_calls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFutureCalls(response.data.future_calls);
    } catch (error) {
      console.error("Erro ao obter ligações futuras:", error);
      alert("Erro ao obter ligações futuras.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFutureCalls();
  }, [fetchFutureCalls]);

  const handleDone = (call) => {
    setSelectedCall(call);
  };

  const handleResultSubmit = async (result) => {
    if (selectedCall) {
      try {
        if (result === "Ligar no futuro") {
          console.log(
            "Excluindo ligação futura original com ID:",
            selectedCall._id
          );
          // Excluir a ligação futura original
          const deleteResponse = await axios.post(
            "http://localhost:5000/future_calls/delete",
            { future_call_id: selectedCall._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Resposta da exclusão:", deleteResponse.data);

          if (deleteResponse.data.error) {
            alert(
              "Erro ao excluir ligação futura: " + deleteResponse.data.error
            );
            return;
          }

          // Abrir o modal para agendar nova ligação futura
          setShowFutureCallModal(true);
        } else if (result === "Reunião Marcada") {
          // Abrir o modal para agendar reunião
          setShowMeetingModal(true);
        } else {
          // Registrar a ligação normalmente
          console.log("Registrando ligação com resultado:", result);
          const logResponse = await axios.post(
            "http://localhost:5000/calls/log",
            {
              contact_id: selectedCall.contact_id,
              result,
              phone_number: selectedCall.contact_info.MOBILE_PHONE,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Resposta do registro de ligação:", logResponse.data);

          if (logResponse.data.error) {
            alert("Erro ao registrar ligação: " + logResponse.data.error);
            return;
          }

          alert("Ligação registrada com sucesso!");
          setSelectedCall(null);
          fetchFutureCalls(); // Atualiza a lista de ligações futuras
        }
      } catch (error) {
        console.error("Erro ao processar resultado da ligação:", error);
        alert("Erro ao processar resultado da ligação.");
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedCall(null);
  };

  const handleScheduleMeeting = () => {
    setShowMeetingModal(true);
  };

  const handleScheduleFutureCall = () => {
    setShowFutureCallModal(true);
  };

  const handleAfterSchedule = () => {
    setShowMeetingModal(false);
    setShowFutureCallModal(false);
    setSelectedCall(null);
    fetchFutureCalls();
  };

  // Helper functions for formatting
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "Número indisponível";

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(
        3,
        7
      )}-${cleaned.slice(7)}`;
    }

    return phone;
  };

  return (
    <div className={styles.futureCallsContainer}>
      <h2>Ligações Futuras</h2>
      <button onClick={onClose} className={styles.backButton}>
        Voltar
      </button>
      {loading ? (
        <p>Carregando...</p>
      ) : futureCalls.length === 0 ? (
        <p>Nenhuma ligação futura agendada.</p>
      ) : (
        futureCalls.map((call) => (
          <div key={call._id} className={styles.contactCard}>
            <h3>{call.contact_info.NAME}</h3>
            <p>
              <strong>Telefone:</strong>{" "}
              {formatPhoneNumber(call.contact_info.MOBILE_PHONE)}
            </p>
            <p>
              <strong>Empresa:</strong> {call.contact_info.COMPANY}
            </p>
            <p>
              <strong>Cidade:</strong> {call.contact_info.ADDRESSES_1_CITY}
            </p>
            <p>
              <strong>Data e Hora Agendada:</strong>{" "}
              {formatDateTime(call.scheduled_time)}
            </p>
            <button
              onClick={() => handleDone(call)}
              className={styles.doneButton}
            >
              Feito
            </button>
          </div>
        ))
      )}
      {selectedCall && (
        <CallResultModal
          token={token}
          contact={selectedCall.contact_info}
          onClose={handleCloseModal}
          onSubmit={handleResultSubmit}
          onScheduleMeeting={handleScheduleMeeting}
          onScheduleFutureCall={handleScheduleFutureCall}
        />
      )}
      {showMeetingModal && (
        <ScheduleMeetingModal
          contact={selectedCall.contact_info}
          token={token}
          assessors={assessors}
          onClose={() => setShowMeetingModal(false)}
          onScheduled={handleAfterSchedule}
        />
      )}
      {showFutureCallModal && (
        <ScheduleFutureCallModal
          contact={selectedCall.contact_info}
          token={token}
          onClose={() => setShowFutureCallModal(false)}
          onScheduled={handleAfterSchedule}
        />
      )}
    </div>
  );
}

export default FutureCallsPage;
