import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarContainer } from './styles';

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const base = process.env.PUBLIC_URL;

  const items = [
    { label: 'Início',            icon: `${base}/logo_inicio.png`,        path: '/home' },
    { label: 'Consultas',         icon: `${base}/logo_consulta.png`,      path: '/consultas' },
    { label: 'Clientes',          icon: `${base}/logo_clientes.png`,      path: '/clients' },
    { label: 'Produtos',          icon: `${base}/logo_produtos.png`,      path: '/products' },
    { label: 'Procedimentos',     icon: `${base}/logo_procedimentos.png`, path: '/procedure' },
    { label: 'Configurações',     icon: `${base}/logo_configuracoes.png`, path: '/settings' },
    { label: 'Sair',              icon: `${base}/logo_sair.png`,          path: '/logout' },
  ];

  return (
    <SidebarContainer open={open}>
      <button className="toggle" onClick={() => setOpen(!open)}>
        {open ? '←' : '→'}
      </button>

      {items.map(({ label, icon, path }) => (
        <div
          className="menuItem"
          key={label}
          onClick={() => navigate(path)}
          style={{ cursor: 'pointer' }}
        >
          <img src={icon} alt={label} className="icon" />
          <span className="menuLabel">{label}</span>
        </div>
      ))}
    </SidebarContainer>
  );
};
