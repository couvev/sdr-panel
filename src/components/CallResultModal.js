// src/components/CallResultModal.js

import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import styles from "./CallResultModal.module.css";

function CallResultModal({
  token,
  contact,
  futureCallId, // Nova prop para receber o ID da ligação futura
  onClose,
  onSubmit,
  onScheduleMeeting,
  onScheduleFutureCall,
}) {
  const results = [
    "Caixa Postal",
    "Sem interesse",
    "Sem recurso",
    "Contato por Whatsapp",
    "Número errado",
    "Ligar no futuro",
    "Erro de ligação",
    "Desligou",
    "Reunião Marcada",
  ];

  const handleResultClick = async (result) => {
    if (result === "Reunião Marcada") {
      onScheduleMeeting();
    } else if (result === "Ligar no futuro") {
      try {
        // Realiza a exclusão da ligação futura original
        const response = await axios.post(
          "http://localhost:5000/future_calls/delete",
          { future_call_id: futureCallId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.error) {
          alert("Erro ao excluir ligação futura: " + response.data.error);
          return;
        }

        // Após excluir, abre o modal para agendar a próxima ligação
        onScheduleFutureCall();
      } catch (error) {
        console.error("Erro ao excluir ligação futura:", error);
        alert("Erro ao excluir ligação futura.");
      }
    } else {
      onSubmit(result);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Resultado da Ligação</h2>
        <div className={styles.resultButtons}>
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className={styles.resultButton}
            >
              {result}
            </button>
          ))}
        </div>
        <button onClick={onClose} className={styles.cancelButton}>
          Cancelar
        </button>
      </div>
    </div>,
    document.body
  );
}

export default CallResultModal;
