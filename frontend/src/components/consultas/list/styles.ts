import styled from 'styled-components';

export const ConsultaStyles = styled.div`
  .status {
    font-weight: 600;
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
