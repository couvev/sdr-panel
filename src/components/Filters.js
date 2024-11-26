// src/components/Filters.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Filters.css"; // Certifique-se de importar o arquivo CSS

function Filters({ token, setFilters }) {
  const [options, setOptions] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/filters/options",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOptions(response.data.options);
      } catch (error) {
        console.error("Erro ao obter opções de filtro:", error);
      }
    };

    fetchFilterOptions();
  }, [token]);

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...selectedFilters, [field]: value };
    setSelectedFilters(updatedFilters);
    setFilters(updatedFilters);
  };

  // Mapeamento para nomes mais amigáveis
  const fieldLabels = {
    ADDRESSES_1_DISTRICT: "Bairro",
    ADDRESSES_1_CITY: "Cidade",
    CAPITAL: "Capital",
    ATIVIDADE: "Atividade",
    FATURAMENTO: "Faturamento",
    FUNCIONARIOS: "Funcionários",
  };

  return (
    <div className="filters-container">
      <h3>Filtros</h3>
      <div className="filters-grid">
        {Object.keys(options).map((field) => (
          <div key={field} className="filter-item">
            <label>{fieldLabels[field] || field}:</label>
            <select
              value={selectedFilters[field] || ""}
              onChange={(e) => handleFilterChange(field, e.target.value)}
            >
              <option value="">Todos</option>
              {options[field].map((optionValue, index) => (
                <option key={index} value={optionValue}>
                  {optionValue}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filters;
