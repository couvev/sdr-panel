import React, { useState } from "react";
import axios from "axios";

function ScheduleMeetingModal({
  contact,
  token,
  assessors,
  onClose,
  onScheduled,
}) {
  const [scheduledTime, setScheduledTime] = useState("");
  const [assessor, setAssessor] = useState("");
  const [investmentValue, setInvestmentValue] = useState("");
  const [observations, setObservations] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/meetings/schedule",
        {
          contact_id: contact._id,
          scheduled_time: scheduledTime,
          assessor,
          investment_value: investmentValue,
          observations,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Reunião agendada com sucesso!");
      onScheduled();
    } catch (error) {
      console.error("Erro ao agendar reunião:", error);
      alert(error.response?.data?.error || "Erro ao agendar reunião");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agendar Reunião</h3>
        <form onSubmit={handleSubmit}>
          <label>Data e Hora:</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
          <label>Assessor:</label>
          <select
            value={assessor}
            onChange={(e) => setAssessor(e.target.value)}
            required
          >
            <option value="">Selecione um assessor</option>
            {assessors.map((assessorName, index) => (
              <option key={index} value={assessorName}>
                {assessorName}
              </option>
            ))}
          </select>
          <label>Valor Disponível para Investimentos:</label>
          <input
            type="text"
            value={investmentValue}
            onChange={(e) => setInvestmentValue(e.target.value)}
          />
          <label>Observações:</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          ></textarea>
          <button type="submit">Agendar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleMeetingModal;