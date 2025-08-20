import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StandardPage } from '../../listPadrao';
import { appointmentService } from '../../../services/appointmentService';
import { clientService } from '../../../services/clientService';
import { procedureService } from '../../../services/procedureService';
import { useAuth } from '../../../Auth/AuthContext';
import { AppointmentDTO, ClientDTO, ProcedimentoDTO } from '../../../types';
import { mapStatusToBackend } from '../../../utils/appointmentUtils';

export interface EditConsultaFormData {
  date: string;
  time: string;
  clientCpf: string;
  status: string;
  proceduresName: string[];
  value: string;
  clinicalNotes: string;
}

export const EditConsultasPage: React.FC = () => {
  const navigate = useNavigate();
  const { cpf, dateTime } = useParams<{ cpf: string; dateTime: string }>();
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [procedures, setProcedures] = useState<ProcedimentoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<AppointmentDTO | null>(null);
  
  const [formData, setFormData] = useState<EditConsultaFormData>({
    date: '',
    time: '',
    clientCpf: '',
    status: '',
    proceduresName: [],
    value: '',
    clinicalNotes: '',
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [clientsData, proceduresData] = await Promise.all([
          clientService.listAll(),
          procedureService.listAll()
        ]);
        setClients(clientsData);
        setProcedures(proceduresData);

        // Carregar dados da consulta
        if (user && cpf && dateTime) {
          const appointmentData = await appointmentService.findById(
            user.cpf,
            cpf,
            dateTime
          );
          setAppointment(appointmentData);
          
          // Preencher formulário com dados existentes
          const appointmentDate = new Date(appointmentData.dateTime);
          const date = appointmentDate.toISOString().split('T')[0];
          const time = appointmentDate.toTimeString().slice(0, 5);
          
          setFormData({
            date,
            time,
            clientCpf: appointmentData.client.cpf,
            status: mapStatusToPortuguese(appointmentData.status),
            proceduresName: appointmentData.proceduresName,
            value: appointmentData.value.toString(),
            clinicalNotes: appointmentData.clinicalNotes || '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados da consulta');
        navigate('/consultas');
      } finally {
        setLoading(false);
      }
    };

    if (cpf && dateTime && user) {
      loadInitialData();
    }
  }, [cpf, dateTime, user, navigate]);

  // Função auxiliar para mapear status do backend para português
  const mapStatusToPortuguese = (status: any): string => {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'Pendente',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada'
    };
    return statusMap[status] || 'Pendente';
  };

  // Função para normalizar data/hora para comparação
  const normalizeDateTimeForComparison = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toISOString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProcedureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, proceduresName: selectedOptions }));
    
    const totalValue = selectedOptions.reduce((total, procedureName) => {
      const procedure = procedures.find(p => p.name === procedureName);
      return total + (procedure?.cost || 0);
    }, 0);
    
    setFormData(prev => ({ ...prev, value: totalValue.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !cpf || !dateTime) {
      alert('Dados insuficientes para atualizar a consulta');
      return;
    }

    if (formData.proceduresName.length === 0) {
      alert('Selecione pelo menos um procedimento');
      return;
    }

    if (!formData.date || !formData.time) {
      alert('Data e hora são obrigatórios');
      return;
    }

    if (!formData.status) {
      alert('Selecione um status');
      return;
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      alert('Valor deve ser maior que zero');
      return;
    }

    try {
      const newDateTimeString = `${formData.date}T${formData.time}:00-03:00`;
      const originalDateTime = appointment?.dateTime;
      
      const selectedClient = clients.find(client => client.cpf === formData.clientCpf);
      if (!selectedClient) {
        alert('Cliente não encontrado');
        return;
      }

      const statusMapped = mapStatusToBackend(formData.status);

      const appointmentData: AppointmentDTO = {
        esthetician: {
          cpf: user.cpf,
          name: user.name
        },
        client: {
          cpf: selectedClient.cpf,
          name: selectedClient.name
        },
        dateTime: newDateTimeString,
        clinicalNotes: formData.clinicalNotes || '',
        value: parseFloat(formData.value),
        status: statusMapped,
        proceduresName: formData.proceduresName
      };

      // Comparar datas normalizadas para detectar mudanças reais
      const originalDateTimeNormalized = originalDateTime ? normalizeDateTimeForComparison(originalDateTime) : '';
      const newDateTimeNormalized = normalizeDateTimeForComparison(newDateTimeString);
      
      // Verificar se houve mudanças nas chaves primárias
      const dateTimeChanged = originalDateTime && originalDateTimeNormalized !== newDateTimeNormalized;
      const clientChanged = appointment?.client.cpf !== formData.clientCpf;
      const needsRecreation = dateTimeChanged || clientChanged;
      
      // Log temporário para debug
      if (!needsRecreation) {
        console.log('✅ UPDATE SIMPLES - Nenhuma chave primária foi alterada');
        console.log('- Data original:', originalDateTimeNormalized);
        console.log('- Data nova:', newDateTimeNormalized);
        console.log('- Cliente original:', appointment?.client.cpf);
        console.log('- Cliente novo:', formData.clientCpf);
      } else {
        console.log('⚠️ DELETE+CREATE - Chave primária alterada');
        console.log('- Data mudou:', dateTimeChanged);
        console.log('- Cliente mudou:', clientChanged);
      }
      
      if (needsRecreation) {
        let confirmMessage = '';
        
        if (dateTimeChanged && clientChanged) {
          confirmMessage = `Você está alterando a data/hora E o cliente desta consulta.\n\n` +
            `Data/Hora Original: ${appointment ? new Date(appointment.dateTime).toLocaleString('pt-BR') : ''}\n` +
            `Nova Data/Hora: ${new Date(newDateTimeString).toLocaleString('pt-BR')}\n\n` +
            `Cliente Original: ${appointment?.client.name} (${appointment?.client.cpf})\n` +
            `Novo Cliente: ${selectedClient.name} (${selectedClient.cpf})\n\n` +
            `Deseja continuar?`;
        } else if (dateTimeChanged) {
          confirmMessage = `Você está reagendando esta consulta.\n\n` +
            `Data/Hora Original: ${appointment ? new Date(appointment.dateTime).toLocaleString('pt-BR') : ''}\n` +
            `Nova Data/Hora: ${new Date(newDateTimeString).toLocaleString('pt-BR')}\n\n` +
            `Deseja continuar?`;
        } else if (clientChanged) {
          confirmMessage = `Você está alterando o cliente desta consulta.\n\n` +
            `Cliente Original: ${appointment?.client.name} (${appointment?.client.cpf})\n` +
            `Novo Cliente: ${selectedClient.name} (${selectedClient.cpf})\n\n` +
            `Deseja continuar?`;
        }
        
        const confirmChange = window.confirm(confirmMessage);
        
        if (!confirmChange) {
          return;
        }

        try {
          // Verificar se já existe uma consulta na nova data/hora com o novo cliente
          await appointmentService.findById(user.cpf, selectedClient.cpf, newDateTimeString);
          // Se chegou aqui, significa que já existe uma consulta nessa data/hora
          alert('Já existe uma consulta agendada para esta data e hora com este cliente!');
          return;
        } catch (error: any) {
          // Se deu erro 404, significa que não existe consulta na nova data/hora (isso é bom)
          if (error.response?.status !== 404) {
            // Se não foi erro 404, é um erro real
            throw error;
          }
        }
        
        // Primeiro remove a consulta antiga
        await appointmentService.delete(user.cpf, cpf, dateTime);
        // Depois cria a nova consulta com os novos dados
        await appointmentService.create(appointmentData);
        
        if (dateTimeChanged && clientChanged) {
          alert('Consulta reagendada e cliente alterado com sucesso!');
        } else if (dateTimeChanged) {
          alert('Consulta reagendada com sucesso!');
        } else {
          alert('Cliente da consulta alterado com sucesso!');
        }
      } else {
        // UPDATE SIMPLES: Apenas atualiza campos não relacionados à chave primária
        // (status, procedimentos, valor, observações clínicas)
        await appointmentService.update(user.cpf, cpf, dateTime, appointmentData);
        alert('Consulta atualizada com sucesso!');
      }
      
      navigate('/consultas');
    } catch (error: any) {
      console.error('Erro ao atualizar consulta:', error);
      
      if (error.response?.data?.message) {
        alert(`Erro: ${error.response.data.message}`);
      } else {
        alert('Erro ao atualizar consulta. Verifique os dados e tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <StandardPage title="Editar Consulta">
        <div>Carregando...</div>
      </StandardPage>
    );
  }

  return (
    <StandardPage title="Editar Consulta">
      <form className="form" onSubmit={handleSubmit}>
        {/* Dados da chave primária - não editáveis */}
        <div className="field">
          <label>CPF do Esteticista (Chave Primária)</label>
          <input
            type="text"
            value={user?.cpf || ''}
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            title="O CPF do esteticista não pode ser alterado pois é parte da chave primária"
          />
        </div>

        <div className="field">
          <label>CPF do Cliente Original (Referência)</label>
          <input
            type="text"
            value={appointment?.client.cpf || ''}
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            title="CPF do cliente original (apenas para referência)"
          />
        </div>

        <div className="field">
          <label>Data e Hora Original</label>
          <input
            type="text"
            value={appointment ? new Date(appointment.dateTime).toLocaleString('pt-BR') : ''}
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            title="Data e hora original da consulta (apenas para referência)"
          />
        </div>

        {/* Campos editáveis */}
        <div className="field">
          <label>Data*</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Hora*</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Cliente*</label>
          <select
            name="clientCpf"
            value={formData.clientCpf}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.cpf} value={client.cpf}>
                {client.name} - {client.cpf}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Procedimentos*</label>
          <select
            name="proceduresName"
            multiple
            value={formData.proceduresName}
            onChange={handleProcedureChange}
            required
            style={{ minHeight: '100px' }}
          >
            {procedures.map((procedure) => (
              <option key={procedure.name} value={procedure.name}>
                {procedure.name} - R$ {procedure.cost.toFixed(2).replace('.', ',')}
              </option>
            ))}
          </select>
          <small>Mantenha Ctrl pressionado para selecionar múltiplos procedimentos</small>
        </div>

        <div className="field">
          <label>Status*</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="field">
          <label>Valor Total (R$)*</label>
          <input
            type="number"
            step="0.01"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="0,00"
            required
            readOnly
            style={{ backgroundColor: '#f5f5f5' }}
            title="Valor calculado automaticamente baseado nos procedimentos selecionados"
          />
          <small>Valor calculado automaticamente baseado nos procedimentos selecionados</small>
        </div>

        <div className="field">
          <label>Observações Clínicas</label>
          <textarea
            name="clinicalNotes"
            value={formData.clinicalNotes}
            onChange={handleChange}
            placeholder="Observações sobre o atendimento..."
            rows={4}
          />
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Salvar
          </button>
        </div>
      </form>
    </StandardPage>
  );
};
