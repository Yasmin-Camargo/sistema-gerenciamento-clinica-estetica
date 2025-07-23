import styled from 'styled-components';

export const ComingSoonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
`;

export const ComingSoonContent = styled.div`
  text-align: center;
  background: #f8f9fa;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;

  h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: 600;
  }

  p {
    color: #666;
    margin-bottom: 15px;
    font-size: 16px;
    line-height: 1.5;
  }
`;

