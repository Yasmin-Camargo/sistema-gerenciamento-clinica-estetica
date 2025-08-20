import React, { useState, useMemo, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { AppointmentDTO } from '../../../types';
import { appointmentService } from '../../../services/appointmentService';
import { formatAppointmentForDisplay, mapStatusToBackend } from '../../../utils/appointmentUtils';
import { notifyError, notifySuccess } from '../../../utils/errorUtils';

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
  notifyError(error, 'Erro ao carregar consultas.');
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
  notifySuccess('Consulta removida com sucesso!');
      } catch (error: any) {
  notifyError(error, 'Erro ao remover consulta. Tente novamente.');
      }
    } 
    setModalAberto(false);
  };

  const consultasFormatadas = useMemo(() => {
    return appointments.map(formatAppointmentForDisplay);
  }, [appointments]);

  const handleFiltrar = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (busca.trim()) filters.clientName = busca.trim();
      if (procedimentoFiltro.trim()) filters.procedureName = procedimentoFiltro.trim();
      if (statusFiltro) filters.status = mapStatusToBackend(statusFiltro);
      if (dataFiltro) filters.date = dataFiltro; // YYYY-MM-DD

      const data = await appointmentService.filter(filters);
      setAppointments(data);
    } catch (error) {
  notifyError(error, 'Erro ao filtrar consultas.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = async () => {
    setBusca('');
    setDataFiltro('');
    setProcedimentoFiltro('');
    setStatusFiltro('');
    await loadAppointments();
  };

  const filtros = (
    <div className="filters">
      <input
        placeholder="Busca (cliente)"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleFiltrar(); }}
      />

      <input
        type="date"
        value={dataFiltro}
        onChange={(e) => setDataFiltro(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleFiltrar(); }}
      />

      <input
        placeholder="Procedimento"
        value={procedimentoFiltro}
        onChange={(e) => setProcedimentoFiltro(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleFiltrar(); }}
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

      <button className="btn-submit" type="button" onClick={handleFiltrar}>
        Filtrar
      </button>
      <button className="btn-cancel" type="button" onClick={handleLimpar}>
        Limpar
      </button>
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
            ) : consultasFormatadas.length === 0 ? (
              <tr>
                <td colSpan={7}>Nenhuma consulta encontrada.</td>
              </tr>
            ) : (
              consultasFormatadas.map((consulta) => (
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
