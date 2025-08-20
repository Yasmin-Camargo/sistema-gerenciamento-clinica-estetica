import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/api';

export interface ProcedureFormData {
  name: string;
  description: string;
  estimatedDuration: number;
  cost: number;
}

export const EditProcedurePage: React.FC = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [formData, setFormData] = useState<ProcedureFormData>({
    name: '',
    description: '',
    estimatedDuration: 0,
    cost: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      api.get(`/procedures/${encodeURIComponent(name)}`)
        .then(response => {
          setFormData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao carregar procedimento:', error);
          alert('Erro ao carregar procedimento.');
          setLoading(false);
        });
    }
  }, [name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDuration' || name === 'cost' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const response = await api.put(`/procedures/${encodeURIComponent(name)}`, formData);
      console.log('Procedimento atualizado com sucesso:', response.data);
      alert('Procedimento atualizado com sucesso!');
      navigate('/procedure');
    } catch (error: any) {
      console.error('Erro ao atualizar procedimento:', error);
      alert('Erro ao atualizar procedimento. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return <StandardPage title="Editar procedimento"><p>Carregando...</p></StandardPage>;
  }

  return (
    <StandardPage title="Editar Procedimento">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            title="O nome do procedimento não pode ser alterado pois é a chave primária"
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
  );
};
