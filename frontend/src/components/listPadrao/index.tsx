import React, { useState } from 'react';
import { PageWrapper, Content } from './styles';
import { Sidebar } from '../menuLateral';

interface StandardPageProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
  filters?: React.ReactNode;
}

export const StandardPage: React.FC<StandardPageProps> = ({
  title,
  buttonLabel,
  onButtonClick,
  children,
  filters,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PageWrapper>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <Content $sidebarOpen={sidebarOpen}>
        {/* cabeçalho */}
        <div className="header">
          <h1 className="title">{title}</h1>

          {/* botão só aparece se houver label (ou callback) */}
          {buttonLabel && (
            <button
              className="action-button"
              onClick={onButtonClick}
              type="button"
            >
              {buttonLabel}
            </button>
          )}
        </div>

        <div className="content">
          {/* filtros opcionais */}
          {filters && <div className="filters">{filters}</div>}

          {/* conteúdo principal */}
          {children}
        </div>
      </Content>
    </PageWrapper>
  );
};
