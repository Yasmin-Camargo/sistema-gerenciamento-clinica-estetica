import React, { useState, useMemo, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { AppointmentDTO } from '../../../types';
import { appointmentService } from '../../../services/appointmentService';
import { formatAppointmentForDisplay, extractDateFromDateTime } from '../../../utils/appointmentUtils';

export const ConsultasPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  const [procedimentoFiltro, setProcedimentoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<ReturnType<typeof formatAppointmentForDisplay> | null>(null);

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

  const excluirConsulta = (consultaFormatada: ReturnType<typeof formatAppointmentForDisplay>) => {
    setConsultaSelecionada(consultaFormatada);
    setModalAberto(true);
  };

  const editarConsulta = (appointment: AppointmentDTO) => {
    navigate(`/consultas/${appointment.client.cpf}/${appointment.dateTime}`);
  };  
  
  const confirmarRemocao = async () => {
    if (consultaSelecionada?.original) {
      try {
        const appointment = consultaSelecionada.original;
      
        await appointmentService.delete(
          appointment.esthetician.cpf,
          appointment.client.cpf,
          appointment.dateTime
        );
        
        await loadAppointments();
        alert('Consulta removida com sucesso!');
      } catch (error: any) {
        console.error('Erro ao remover consulta:', error);
        if (error.response?.data?.message) {
          alert(`Erro ao remover consulta: ${error.response.data.message}`);
        } else {
          alert('Erro ao remover consulta. Tente novamente.');
        }
      }
    } 
    setModalAberto(false);
  };

  const consultasFiltradas = useMemo(() => {
    const formattedAppointments = appointments.map(formatAppointmentForDisplay);
    
    return formattedAppointments.filter((c) => {
      const matchBusca =
        !busca || c.cliente.toLowerCase().includes(busca.toLowerCase());
      const matchData = !dataFiltro || extractDateFromDateTime(c.original.dateTime) === dataFiltro;
      const matchProc =
        !procedimentoFiltro ||
        c.procedimentos.toLowerCase().includes(procedimentoFiltro.toLowerCase());
      const matchStatus = !statusFiltro || c.status === statusFiltro;
      return matchBusca && matchData && matchProc && matchStatus;
    });
  }, [busca, dataFiltro, procedimentoFiltro, statusFiltro, appointments]);

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
        onChange={(e) => setStatusFiltro(e.target.value)}
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
      <TableStyles>
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Procedimento</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>Carregando consultas...</td>
              </tr>
            ) : consultasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7}>Nenhuma consulta encontrada.</td>
              </tr>
            ) : (
              consultasFiltradas.map((consulta) => (
                <tr key={`${consulta.original.client.cpf}-${consulta.original.dateTime}`}>
                  <td>{consulta.cliente}</td>
                  <td>{consulta.data}</td>
                  <td>{consulta.hora}</td>
                  <td>{consulta.procedimentos}</td>
                  <td>{consulta.valor}</td>
                  <td className={`status ${consulta.status.toLowerCase()}`}>
                    {consulta.status}
                  </td>
                  <td className="action-cell">
                    <button 
                      onClick={() => editarConsulta(consulta.original)}
                      className="action-button"
                    >
                      <img src="/IconEdit.png" alt="Editar" />
                    </button>
                    <button 
                      onClick={() => excluirConsulta(consulta)} 
                      className="action-button"
                    >
                      <img src="/IconLixo.png" alt="Excluir" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableStyles>

      <RemoveModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarRemocao}
        title="Excluir consulta"
        message={`Tem certeza que deseja excluir a consulta de ${consultaSelecionada?.original?.client?.name || 'cliente selecionado'}?`}
      />

    </StandardPage>
  );
};
