import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardPage } from '../../components/listPadrao'; // ajuste o caminho
import { ConsultaStyles } from '../consultas/list/styles';
import { HomeStyles } from './styles';
import { useAuth } from '../../Auth/AuthContext';
import { Consulta } from '../../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dataFiltro, setDataFiltro] = useState('');

  const consultas: Consulta[] = [
    {
      data: '10/08/2025',
      cliente: 'Ana Souza',
      status: 'Pendente',
      procedimentos: 'Limpeza de Pele',
      valor: 'R$ 150,00',
    },
    {
      data: '09/08/2025',
      cliente: 'João Silva',
      status: 'Concluída',
      procedimentos: 'Microagulhamento',
      valor: 'R$ 300,00',
    },
  ];

  // Função para converter 'dd/MM/yyyy' para 'yyyy-MM-dd'
  const formatarDataParaISO = (dataBR: string) => {
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };

  const consultasFiltradas = useMemo(() => {
    if (!dataFiltro) return consultas;

    return consultas.filter((c) => {
      const dataISO = formatarDataParaISO(c.data);
      return dataISO === dataFiltro;
    });
  }, [dataFiltro, consultas]);

  return (
    <StandardPage title="Clínica">
      <h2>Boas vindas, {user?.name || 'Esteticista'}</h2>

    <HomeStyles>
      <div className="header-prox-consultas">
          <h3>Próximas consultas</h3>
          <div className="filtros" style={{ marginBottom: '1rem' }}>
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                />
          </div>
      </div>

      <ConsultaStyles>
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Procedimento</th>
            </tr>
          </thead>
          <tbody>
            {consultasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  Nenhuma consulta encontrada.
                </td>
              </tr>
            ) : (
              consultasFiltradas.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.data}</td>
                  <td>{c.cliente}</td>
                  <td>{c.procedimentos}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ConsultaStyles>

      <h3>Procedimentos populares</h3>
        <div className="caixas">
              <p> 8 Botox</p>
              <p> 12 procedimentos</p>
        </div>

        <h3>Faturamento </h3>
        <div className="caixas">
              <p> R$ 2.500,00</p>
        </div>

    </HomeStyles>
    </StandardPage>
  );
};
