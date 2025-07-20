import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { LoginPageContainer } from './styles';
import { useAuth } from '../../../Auth/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/login', {
        email,
        password
      });

      await login();
      navigate('/home');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Email ou senha inválidos!');
    }
  };

  return (
    <LoginPageContainer>
      <form onSubmit={handleLogin}>
        <h2>Clínica</h2>
        <input
          type="email"
          placeholder="meuemail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Ainda não é cadastrado?{' '}
          <span onClick={() => navigate('/estheticians')} style={{ cursor: 'pointer', color: 'blue' }}>
            Cadastre-se
          </span>
        </p>
      </form>
    </LoginPageContainer>
  );
}
