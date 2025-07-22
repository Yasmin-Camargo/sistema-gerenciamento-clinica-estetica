import React, { useMemo, useState, useEffect } from 'react';
import { StandardPage } from '../../components/listPadrao';
import { ConsultaStyles } from '../consultas/list/styles';
import { HomeStyles } from './styles';
import { useAuth } from '../../Auth/AuthContext';
import { formatAppointmentForDisplay, extractDateFromDateTime } from '../../utils/appointmentUtils';
import { dashboardService, HomePageDTO } from '../../services/dashboardService';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [dataFiltro, setDataFiltro] = useState('');
  const [dashboardData, setDashboardData] = useState<HomePageDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getHomePageData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultasFiltradas = useMemo(() => {
    if (!dashboardData) return [];
    if (!dataFiltro) return dashboardData.nextAppointments.map(formatAppointmentForDisplay);

    return dashboardData.nextAppointments
      .filter((appointment) => {
        const appointmentDate = extractDateFromDateTime(appointment.dateTime);
        return appointmentDate === dataFiltro;
      })
      .map(formatAppointmentForDisplay);
  }, [dataFiltro, dashboardData]);

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
              {loading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    Carregando consultas...
                  </td>
                </tr>
              ) : consultasFiltradas.length === 0 ? (
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
          {dashboardData?.popularProcedures.map((p, i) => (
            <p key={i}>{p.count} {p.name}</p>
          ))}
        </div>

        <h3>Faturamento</h3>
        <div className="caixas">
          <p>R$ {dashboardData?.totalRevenue?.toFixed(2).replace('.', ',')}</p>
        </div>
      </HomeStyles>
    </StandardPage>
  );
};
