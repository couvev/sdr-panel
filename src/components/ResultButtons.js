// src/components/ResultButtons.js

import React from "react";
import styles from "./ResultButtons.module.css";

function ResultButtons({ handleResult }) {
  const results = [
    "Caixa Postal",
    "Sem interesse",
    "Sem recurso",
    "Contato por Whatsapp",
    "Número errado",
    "Retorno em outro horário",
    "Ligar no futuro",
    "Erro de ligação",
    "Desligou",
    "Reunião Marcada",
  ];

  return (
    <div className={styles.resultButtons}>
      {results.map((result, index) => (
        <button
          key={index}
          onClick={() => handleResult(result)}
          className={styles.resultButton}
        >
          {result}
        </button>
      ))}
    </div>
  );
}

export default ResultButtons;
