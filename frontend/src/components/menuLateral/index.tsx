import React from 'react';
import { SidebarContainer } from './styles';

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const base = process.env.PUBLIC_URL; // pasta /public

  const items = [
    { label: 'Início',            icon: `${base}/logo_inicio.png` },
    { label: 'Consultas',         icon: `${base}/logo_consulta.png` },
    { label: 'Clientes',          icon: `${base}/logo_clientes.png` },
    { label: 'Produtos',          icon: `${base}/logo_produtos.png` },
    { label: 'Procedimentos',     icon: `${base}/logo_procedimentos.png` },
    { label: 'Configurações',     icon: `${base}/logo_configuracoes.png` },
    { label: 'Sair',              icon: `${base}/logo_sair.png` },
  ];

  return (
    <SidebarContainer open={open}>
      <button className="toggle" onClick={() => setOpen(!open)}>
        {open ? '←' : '→'}
      </button>

      {items.map(({ label, icon }) => (
        <div className="menuItem" key={label}>
          <img src={icon} alt={label} className="icon" />
          <span className="menuLabel">{label}</span>
        </div>
      ))}
    </SidebarContainer>
  );
};
