import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate, useParams } from 'react-router-dom';
import { clientService } from '../../../services/clientService';
import { ClientDTO } from '../../../types';

export const EditClientPage: React.FC = () => {
  const navigate = useNavigate();
  const { cpf } = useParams<{ cpf: string }>();
  const [formData, setFormData] = useState<ClientDTO>({
    cpf: '',
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cpf) return;
    const fetchClient = async () => {
      try {
        const client = await clientService.findByCpf(cpf);
        setFormData({
          ...client,
          birthDate: client.birthDate || '',
          address: client.address || '',
        });
      } catch (error) {
        alert('Erro ao carregar dados do cliente.');
        navigate('/clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [cpf, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await clientService.update(cpf!, formData);
      alert('Cliente atualizado com sucesso!');
      navigate('/clients');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      alert('Erro ao atualizar cliente. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return (
      <StandardPage title="Editar Cliente">
        <p>Carregando dados...</p>
      </StandardPage>
    );
  }

  return (
    <StandardPage title="Editar Cliente">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>CPF*</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            disabled
          />
        </div>

        <div className="field">
          <label>Nome*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome completo"
            required
          />
        </div>

        <div className="field">
          <label>Telefone*</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefone"
            required
          />
        </div>

        <div className="field">
          <label>Data de nascimento</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>E-mail*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            required
          />
        </div>

        <div className="field">
          <label>Endereço</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Endereço"
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
