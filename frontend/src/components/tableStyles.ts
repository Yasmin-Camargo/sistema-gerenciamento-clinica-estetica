import styled from 'styled-components';

export const TableStyles = styled.div`
  .status {
    font-weight: 600;
  }

  .action-cell {
  display: flex;
  align-items: center;
  gap: 8px; /* espaçamento entre os botões */
}

.action-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;

  img {
    width: 18px;
    height: 18px;
    display: block;
  }

  &:hover {
    opacity: 0.8;
  }
}

  .status.pendente {
    color: #c87624;
  }
  .status.concluida {
    color: #28a745;
  }
  .status.cancelada {
    color: #d9534f;
  }
`;
