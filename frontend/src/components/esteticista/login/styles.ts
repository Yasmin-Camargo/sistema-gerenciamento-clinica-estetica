import styled from 'styled-components'

export const LoginPageContainer = styled.div`

.login-container {
  background-color: #b35e04;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background-color: #f7f1ed;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 280px;
  max-width: 360px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

input {
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #c87624;
}

button {
  background-color: #a75d16;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #6f3a08;
}


`;