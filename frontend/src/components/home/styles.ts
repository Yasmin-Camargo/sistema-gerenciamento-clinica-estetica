import styled from 'styled-components';

export const HomeStyles = styled.div`
.header-prox-consultas {
  display: flex;
  align-items: center;  
  justify-content: space-between;
  gap: 1rem;               
  margin-bottom: 1rem;      
  color: #401808; 
}

h3 {
  color: #401808;
  margin-bottom: 0.5rem;
}

.caixas {
  display: flex;
  gap: 12px; /* espaço entre as caixas */
  align-items: center;
  flex-wrap: wrap; }

.caixas p {
  background-color: #f5f5f5;
  padding: 20px 36px;
  border-radius: 8px;
  font-weight: 600;
  margin: 0; /* remover margem padrão do p */
  cursor: default;
  color: #47413E;
  font-size: 1.2rem;
  border: 1px solid #C87624;
  user-select: none;
  white-space: nowrap;
  width: 40%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

`
