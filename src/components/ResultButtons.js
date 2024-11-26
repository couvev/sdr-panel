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
    "Reunião Marcada",
    "Erro de ligação",
    "Desligou",
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
