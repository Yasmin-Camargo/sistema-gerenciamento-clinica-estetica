import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  color: #522504;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 320px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;

  h2 {
    margin-bottom: 1rem;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    font-weight: 400;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .cancel {
      background: #ccc;
    }

    .confirm {
      background: #C87624;
      color: white;
    }
  }
`;
