import React from "react";

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
    <div className="result-buttons">
      {results.map((result, index) => (
        <button key={index} onClick={() => handleResult(result)}>
          {result}
        </button>
      ))}
    </div>
  );
}

export default ResultButtons;
