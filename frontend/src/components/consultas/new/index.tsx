import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardPage } from '../../listPadrao';
import { appointmentService } from '../../../services/appointmentService';
import { clientService } from '../../../services/clientService';
import { procedureService } from '../../../services/procedureService';
import { useAuth } from '../../../Auth/AuthContext';
import { AppointmentDTO, ClientDTO, ProcedimentoDTO } from '../../../types';
import { mapStatusToBackend } from '../../../utils/appointmentUtils';

export interface ConsultaFormData {
  date: string;
  time: string;
  clientCpf: string;
  status: string;
  proceduresName: string[];
  value: string;
  clinicalNotes: string;
}

export const NewConsultasPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [procedures, setProcedures] = useState<ProcedimentoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<ConsultaFormData>({
    date: '',
    time: '',
    clientCpf: '',
    status: '',
    proceduresName: [],
    value: '',
    clinicalNotes: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [clientsData, proceduresData] = await Promise.all([
        clientService.listAll(),
        procedureService.listAll()
      ]);
      setClients(clientsData);
      setProcedures(proceduresData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar clientes e procedimentos');
    } finally {
      setLoading(false);
    }
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

    if (!user) {
      alert('Usuário não autenticado');
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

    if (!formData.clientCpf) {
      alert('Selecione um cliente');
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
      const dateTimeString = `${formData.date}T${formData.time}:00-03:00`;
      
      const selectedClient = clients.find(client => client.cpf === formData.clientCpf);
      if (!selectedClient) {
        alert('Cliente não encontrado');
        return;
      }

      const statusMapped = mapStatusToBackend(formData.status);
      console.log('Status mapeado:', formData.status, '->', statusMapped);

      const appointmentData: AppointmentDTO = {
        esthetician: {
          cpf: user.cpf,
          name: user.name
        },
        client: {
          cpf: selectedClient.cpf,
          name: selectedClient.name
        },
        dateTime: dateTimeString,
        clinicalNotes: formData.clinicalNotes || '',
        value: parseFloat(formData.value),
        status: statusMapped,
        proceduresName: formData.proceduresName
      };

      console.log('Dados da consulta sendo enviados:', appointmentData);

      const response = await appointmentService.create(appointmentData);
      console.log('Consulta criada com sucesso:', response);
      alert('Consulta cadastrada com sucesso!');
      navigate('/consultas');
    } catch (error: any) {
      console.error('Erro completo ao cadastrar consulta:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.data?.message) {
        alert(`Erro: ${error.response.data.message}`);
      } else if (error.response?.data) {
        alert(`Erro: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Erro ao cadastrar consulta. Verifique os dados e tente novamente.');
      }
    }
  };

  return (
    <StandardPage title="Nova Consulta">
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
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
      )}
    </StandardPage>
  );
};
