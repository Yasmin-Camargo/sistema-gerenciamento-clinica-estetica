import React, { useState } from 'react';
import { EstheticianFormContainer } from './styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export interface EstheticianFormData {
  cpf: string;
  name: string;
  phone: string;
  birthDate?: string;
  email: string;
  address?: string;
  professionalRegistrationNumber: string;
  password: string;
  confirmPassword?: string;
  specializations?: string;
}

export function EstheticianForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EstheticianFormData>({
    cpf: '',
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    address: '',
    professionalRegistrationNumber: '',
    password: '',
    confirmPassword: '',
    specializations: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/estheticians', formData);
      console.log('Esteticista criado com sucesso:', response.data);
      alert('Esteticista cadastrado com sucesso!');
      navigate('/home'); 
    } catch (error: any) {
      console.error('Erro ao cadastrar esteticista:', error);
      alert('Erro ao cadastrar esteticista. Verifique os dados e tente novamente.');
    }
  };

  return (
    <EstheticianFormContainer>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <h2>Nome Completo*</h2>
            <input
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <h2>CPF*</h2>
            <input
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className="linha">
            <div className="input">
              <h2>Data de Nascimento</h2>
              <input
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="input">
              <h2>Email*</h2>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input">
            <h2>Endereço</h2>
            <input
              name="address"
              placeholder="Endereço"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            <h2>Número de Registro Profissional*</h2>
            <input
              name="professionalRegistrationNumber"
              placeholder="Registro Profissional"
              value={formData.professionalRegistrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <h2>Especializações</h2>
            <textarea
              name="specializations"
              placeholder="Especializações"
              value={formData.specializations}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            <h2>Senha*</h2>
            <input
              name="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <h2>Confirmar senha*</h2>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </EstheticianFormContainer>
  );
}
