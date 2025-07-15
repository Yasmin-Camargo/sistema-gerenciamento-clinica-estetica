import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardPage } from '../../listPadrao'; // ajuste o caminho

export const NewConsultasPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Consulta salva!');
    navigate('/consultas'); // volta para lista se quiser
  };

  return (
    <StandardPage
      title="Nova Consulta"
    >
      <form className="form" onSubmit={handleSalvar}>
        <div className="field">
          <label>Data*</label>
          <input type="date" required />
        </div>

        <div className="field">
          <label>Cliente*</label>
          <input type="text" placeholder="Nome do cliente" required />
        </div>

        <div className="field">
          <label>Procedimento*</label>
          <input type="text" placeholder="Procedimento" required />
        </div>

        <div className="field">
          <label>Status*</label>
          <select required>
            <option value="">Selecione</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="field">
          <label>Valor (R$)*</label>
          <input type="number" step="0.01" placeholder="0,00" required />
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Salvar
          </button>
        </div>
      </form>
    </StandardPage>
  );
};
