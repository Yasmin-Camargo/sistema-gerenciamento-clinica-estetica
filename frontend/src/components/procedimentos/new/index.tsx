import React, { useState } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

export interface ProcedureFormData {
  name: string;
  description: string;
  estimatedDuration: number;
  cost: number;
}

export const NewProcedurePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProcedureFormData>({
    name: '',
    description: '',
    estimatedDuration: 0,
    cost: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: name === 'estimatedDuration' || name === 'cost' ? Number(value) : value
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/procedures', formData);
      console.log('Procedimento criado com sucesso:', response.data);
      alert('Procedimento cadastrado com sucesso!');
      navigate('/procedure');
    } catch (error: any) {
      console.error('Erro ao cadastrar procedimento:', error);
      alert('Erro ao cadastrar procedimento. Verifique os dados e tente novamente.');
    }
  };

  return (
    <StandardPage
      title="Novo Procedimento"
>
  <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Nome*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome do procedimento"
          required
        />
      </div>

      <div className="field">
        <label>Descrição*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição do procedimento"
          required
        />
      </div>

      <div className="field">
        <label>Duração Estimada (minutos)*</label>
        <input
          type="number"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          placeholder="Duração em minutos"
          required
        />
      </div>

      <div className="field">
        <label>Custo (R$)*</label>
        <input
          type="number"
          step="0.01"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          placeholder="Custo do procedimento"
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
  )
}