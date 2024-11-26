import React from "react";

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

function ContactCard({ contact }) {
  return (
    <div className="contact-card">
      <h3>Informações do Contato</h3>
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
  );
}

export default ContactCard;
