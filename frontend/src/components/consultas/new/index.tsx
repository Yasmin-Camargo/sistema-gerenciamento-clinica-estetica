import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardPage } from '../../listPadrao'; // ajuste o caminho
import api from '../../../api/api'; // ajuste o caminho

export interface ConsultaFormData {
  data: string;
  cliente: string;
  status: 'Pendente' | 'Concluída' | 'Cancelada' | string;
  procedimento: string;
  valor: string;
}

export const NewConsultasPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ConsultaFormData>({
    data: '',
    cliente: '',
    status: '',
    procedimento: '',
    valor: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/consultations', formData);
      console.log('Consulta criada com sucesso:', response.data);
      alert('Consulta cadastrada com sucesso!');
      navigate('/consultas'); // Redireciona para a lista de consultas
    } catch (error: any) {
      console.error('Erro ao cadastrar consulta:', error);
      alert('Erro ao cadastrar consulta. Verifique os dados e tente novamente.');
    }
  };

  return (
    <StandardPage
      title="Nova Consulta"
    >
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Data*</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Cliente*</label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            placeholder="Nome do cliente"
            required
          />
        </div>

        <div className="field">
          <label>Procedimento*</label>
          <input
            type="text"
            name="procedimento"
            value={formData.procedimento}
            onChange={handleChange}
            placeholder="Procedimento"
            required
         />
        </div>

        <div className="field">
          <label>Status*</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="field">
          <label>Valor (R$)*</label>
          <input
            type="number"
            step="0.01"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="0,00"
            required
          />
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
