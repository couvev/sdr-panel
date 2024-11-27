// src/components/ScheduleFutureCallModal.js

import React, { useState } from "react";
import axios from "axios";
import styles from "./ScheduleFutureCallModal.module.css";

function ScheduleFutureCallModal({ contact, token, onClose, onScheduled }) {
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scheduledTime) {
      alert("Por favor, selecione uma data e hora para a próxima ligação.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/future_calls/schedule",
        {
          contact_id: contact._id,
          scheduled_time: scheduledTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        alert("Erro ao agendar a próxima ligação: " + response.data.error);
      } else {
        alert("Próxima ligação agendada com sucesso!");
        onScheduled();
      }
    } catch (error) {
      console.error("Erro ao agendar a próxima ligação:", error);
      alert("Erro ao agendar a próxima ligação.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Agendar Próxima Ligação</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Data e Hora da Próxima Ligação:
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit">Agendar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleFutureCallModal;
