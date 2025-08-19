import React, { useState } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../../services/clientService';
import { ClientDTO } from '../../../types';

export interface ClientFormData {
  cpf: string;
  name: string;
  phone: string;
  birthDate?: string;
  email: string;
  address?: string;
}

export const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClientFormData>({
    cpf: '',
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    address: '',
  });
  const [clientSaved, setClientSaved] = useState<ClientDTO | null>(null);

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
      const savedClient = await clientService.create(formData as ClientDTO);
      alert('Cliente cadastrado com sucesso!');
      setClientSaved(savedClient); // guarda cliente cadastrado
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.');
    }
  };

  const navigateToNewHealthRecord = () => {
    if (clientSaved) {
      navigate(`/health-records/new`); 
    }
  };

  return (
    <StandardPage title="Novo Cliente">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>CPF*</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="CPF do cliente"
            required
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

      {clientSaved && (
        <div className="new-health-record">
          <button className="btn-submit" onClick={navigateToNewHealthRecord}>
            + Nova Ficha de Saúde
          </button>
        </div>
      )}
    </StandardPage>
  );
};
