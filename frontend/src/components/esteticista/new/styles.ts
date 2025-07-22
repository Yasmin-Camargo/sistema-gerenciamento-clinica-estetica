import styled from 'styled-components';

export const EstheticianFormContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #c87624;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Basic', sans-serif;
  padding: 2rem 0; /* Adiciona espaço no topo e embaixo para evitar ficar grudado */

  .container {
    width: 90%;
    max-width: 420px;
    background-color: #f7f1ed;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-height: 90vh; /* Limita a altura máxima para permitir scroll interno */
    overflow-y: auto;
  }

  .input {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }

  .input h2 {
    font-size: 15px;
    margin-bottom: 0.4rem;
    color: #3b240b;
  }

  input,
  textarea {
    padding: 0.7rem;
    border-radius: 6px;
    border: 1px solid #c87624;
    font-size: 0.95rem;
    color: #333;
  }

  textarea {
    resize: vertical;
    min-height: 60px;
  }

  .linha {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .linha .input {
    flex: 1;
    min-width: 150px;
  }

  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    gap: 1rem;
  }

  .btn-salvar {
    background-color: #a75d16;
    color: white;
    border: none;
    padding: 0.7rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    flex: 1;
  }

  .btn-salvar:hover {
    background-color: #6f3a08;
  }

  .btn-cancelar {
    background-color: white;
    color: #555;
    border: 2px solid #c87624;
    padding: 0.7rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    flex: 1;
  }

  .btn-cancelar:hover {
    background-color: #f3f3f3;
  }
`;
