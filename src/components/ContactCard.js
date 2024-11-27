// src/components/ContactCard.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ContactCard.module.css";

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

function ContactCard({ contact, token }) {
  const [observations, setObservations] = useState("");

  // Atualiza o estado das observações quando o contato é carregado
  useEffect(() => {
    setObservations(contact.observations || "");
  }, [contact]);

  const handleSave = async () => {
    try {
      // Envia a requisição para salvar as observações
      const response = await axios.post(
        "http://localhost:5000/contacts/observations",
        {
          contact_id: contact._id,
          observations: observations,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        alert("Erro ao salvar observações: " + response.data.error);
      } else {
        alert("Observações salvas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar observações:", error);
      alert("Erro ao salvar observações.");
    }
  };

  return (
    <div className={styles.contactCard}>
      <div className={styles.contactInfoObservations}>
        <div className={styles.contactInfo}>
          <h3>
            Informações do Contato{" "}
            {contact.CALLS !== undefined && (
              <span>- {contact.CALLS}° Ciclo</span>
            )}
          </h3>
          <p>
            <strong>Nome:</strong> {contact.NAME}
          </p>
          <p>
            <strong>Telefone:</strong> {formatPhoneNumber(contact.MOBILE_PHONE)}
          </p>
          <p>
            <strong>Empresa:</strong> {contact.COMPANY}
          </p>
          <p>
            <strong>Cidade:</strong> {contact.ADDRESSES_1_CITY}
          </p>
          <p>
            <strong>Distrito:</strong> {contact.ADDRESSES_1_DISTRICT}
          </p>
          {/* Adicione mais campos conforme necessário */}
        </div>
        <div className={styles.observationsContainer}>
          <label htmlFor="observations">Observações:</label>
          <textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          ></textarea>
          <button
            className={styles.observationsContainerButton}
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactCard;
