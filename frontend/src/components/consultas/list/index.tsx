import React, { useState, useMemo } from 'react';
import { StandardPage } from '../../listPadrao';  
import { ConsultaStyles } from './styles';


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

  const [busca, setBusca] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  const [procedimentoFiltro, setProcedimentoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

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

  const handleNovaConsulta = () => alert('Ir para formulário de Nova Consulta');

  return (
    <StandardPage
      title="Consultas"
      buttonLabel="Nova Consulta"
      onButtonClick={handleNovaConsulta}
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
    </StandardPage>
  );
};