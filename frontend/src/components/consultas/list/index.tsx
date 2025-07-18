import React, { useState, useMemo } from 'react';
import { StandardPage } from '../../listPadrao';  
import { ConsultaStyles } from './styles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';

export interface Consulta {
  data: string;    
  cliente: string;
  status: 'Pendente' | 'Concluída' | 'Cancelada';
  procedimentos: string;
  valor: string;
}

export const ConsultasPage: React.FC = () => {
  const consultas: Consulta[] = [
    {
      data: '10/08/2025',
      cliente: 'Ana Souza',
      status: 'Pendente',
      procedimentos: 'Limpeza de Pele',
      valor: 'R$ 150,00',
    },
    {
      data: '09/08/2025',
      cliente: 'João Silva',
      status: 'Concluída',
      procedimentos: 'Microagulhamento',
      valor: 'R$ 300,00',
    },
  ];

  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  const [procedimentoFiltro, setProcedimentoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);

const excluirConsulta = (consulta: Consulta) => {
  setConsultaSelecionada(consulta);
  setModalAberto(true);
};

const confirmarRemocao = () => {
  if (consultaSelecionada) {
    // Aqui você pode fazer a lógica de remover (ex: via API)
    console.log('Remover:', consultaSelecionada);
  }
  setModalAberto(false);
};

  const consultasFiltradas = useMemo(() => {
    return consultas.filter((c) => {
      const matchBusca =
        !busca || c.cliente.toLowerCase().includes(busca.toLowerCase());
      const matchData = !dataFiltro || c.data === dataFiltro;
      const matchProc =
        !procedimentoFiltro ||
        c.procedimentos.toLowerCase().includes(procedimentoFiltro.toLowerCase());
      const matchStatus = !statusFiltro || c.status === statusFiltro;
      return matchBusca && matchData && matchProc && matchStatus;
    });
  }, [busca, dataFiltro, procedimentoFiltro, statusFiltro]);

  const filtros = (
    <div className="filtros">
      <input
        placeholder="Busca (cliente)"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <input
        type="date"
        value={dataFiltro}
        onChange={(e) => setDataFiltro(e.target.value)}
      />

      <input
        placeholder="Procedimento"
        value={procedimentoFiltro}
        onChange={(e) => setProcedimentoFiltro(e.target.value)}
      />

      <select
        value={statusFiltro}
        onChange={(e) => setStatusFiltro(e.target.value as Consulta['status'] | '')}
      >
        <option value="">Status</option>
        <option value="Pendente">Pendente</option>
        <option value="Concluída">Concluída</option>
        <option value="Cancelada">Cancelada</option>
      </select>
    </div>
  );

  const navigateNovaConsulta = () => {
    navigate('/consultas/new');
  };

  return (
    <StandardPage
      title="Consultas"
      buttonLabel="Nova Consulta"
      onButtonClick={navigateNovaConsulta}
      filters={filtros}
    >
      <ConsultaStyles>
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Procedimentos</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {consultasFiltradas.map((c) => (
              <tr key={`${c.data}-${c.cliente}`}>
                <td>{c.data}</td>
                <td>{c.cliente}</td>
                <td className={`status ${c.status.toLowerCase()}`}>{c.status}</td>
                <td>{c.procedimentos}</td>
                <td>{c.valor}</td>
                <td className="action-cell">
                  <button className="action-button">
                    <img src="/IconEdit.png" alt="Editar" />
                  </button>
                  <button onClick={() => excluirConsulta(c)} className="action-button">
                    <img src="/IconLixo.png" alt="Excluir" />
                  </button>
                </td>
              </tr>
            ))}
            {consultasFiltradas.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhuma consulta encontrada.</td>
              </tr>
            )}
            
          </tbody>
        </table>
      </ConsultaStyles>

      <RemoveModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarRemocao}
        title="Excluir consulta"
        message={`Tem certeza que deseja excluir a consulta de ${consultaSelecionada?.cliente}?`}
      />

    </StandardPage>
  );
};