import styled from 'styled-components';

export const LoginPageContainer = styled.div`
  background-color: #b35e04;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    background-color: #f7f1ed;
    padding: 2rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #4a1c01;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  label {
    color: #4a1c01;
    font-weight: bold;
    font-size: 0.95rem;
  }

  input {
    padding: 0.7rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #c87624;
    font-size: 1rem;
  }

  button {
    background-color: #c87624;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 0.5rem;
  }

  button:hover {
    background-color: #a75d16;
  }

  p {
    font-size: 0.9rem;
    color: #4a1c01;
    text-align: center;
    margin-top: 0.5rem;

    span {
      color: #a75d16;
      cursor: pointer;
      font-weight: bold;
    }
  }
`;
