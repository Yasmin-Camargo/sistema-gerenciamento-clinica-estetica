import React, { useMemo, useState, useEffect } from 'react';
import { StandardPage } from '../../components/listPadrao'; // ajuste o caminho
import { ConsultaStyles } from '../consultas/list/styles';
import { HomeStyles } from './styles';
import { useAuth } from '../../Auth/AuthContext';
import { AppointmentDTO } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import { formatAppointmentForDisplay, extractDateFromDateTime } from '../../utils/appointmentUtils';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [dataFiltro, setDataFiltro] = useState('');
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.listAll();
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultasFiltradas = useMemo(() => {
    if (!dataFiltro) return appointments.map(formatAppointmentForDisplay);

    return appointments
      .filter((appointment) => {
        const appointmentDate = extractDateFromDateTime(appointment.dateTime);
        return appointmentDate === dataFiltro;
      })
      .map(formatAppointmentForDisplay);
  }, [dataFiltro, appointments]);

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
