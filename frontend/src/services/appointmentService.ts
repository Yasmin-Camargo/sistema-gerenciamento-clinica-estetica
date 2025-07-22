import api from '../api/api';
import { AppointmentDTO, AppointmentStatus } from '../types';
import { formatDateTimeForBackend } from '../utils/appointmentUtils';

export interface AppointmentFilters {
  clientName?: string;
  procedureName?: string;
  status?: AppointmentStatus;
  date?: string; // YYYY-MM-DD format
}

export const appointmentService = {
  // Lista todas as consultas
  listAll: async (): Promise<AppointmentDTO[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Filtra consultas
  filter: async (filters: AppointmentFilters): Promise<AppointmentDTO[]> => {
    const params = new URLSearchParams();
    
    if (filters.clientName) params.append('clientName', filters.clientName);
    if (filters.procedureName) params.append('procedureName', filters.procedureName);
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);

    const response = await api.get(`/appointments/filter?${params.toString()}`);
    return response.data;
  },

  // Busca consulta específica
  findById: async (estheticianCpf: string, clientCpf: string, dateTime: string): Promise<AppointmentDTO> => {
    const formattedDateTime = formatDateTimeForBackend(dateTime);
    const response = await api.get(`/appointments/${estheticianCpf}/${clientCpf}/${formattedDateTime}`);
    return response.data;
  },

  // Cria nova consulta
  create: async (appointment: AppointmentDTO): Promise<AppointmentDTO> => {
    const response = await api.post('/appointments', appointment);
    return response.data;
  },

  // Atualiza consulta
  update: async (estheticianCpf: string, clientCpf: string, dateTime: string, appointment: AppointmentDTO): Promise<AppointmentDTO> => {
    const formattedDateTime = formatDateTimeForBackend(dateTime);
    const response = await api.put(`/appointments/${estheticianCpf}/${clientCpf}/${formattedDateTime}`, appointment);
    return response.data;
  },

  // Deleta consulta
  delete: async (estheticianCpf: string, clientCpf: string, dateTime: string): Promise<void> => {
    
    const formattedDateTime = formatDateTimeForBackend(dateTime);
    const deleteUrl = `/appointments/${estheticianCpf}/${clientCpf}/${formattedDateTime}`;
    
    try {
      const response = await api.delete(deleteUrl);
    } catch (error: any) {
      console.error('Erro no delete do appointmentService:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
};
