import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardPage } from '../listPadrao';
import { ComingSoonContainer, ComingSoonContent } from './styles';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StandardPage title="Produtos">
      <ComingSoonContainer>
        <ComingSoonContent>
          <h2>🚧 Em Breve 🚧</h2>
          <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve.</p>
        </ComingSoonContent>
      </ComingSoonContainer>
    </StandardPage>
  );
};
