import api from '../api/api';
import { HealthRecordDTO } from '../types';

export const healthRecordService = {
  // Lista todos os registros de saúde
  listAll: async (): Promise<HealthRecordDTO[]> => {
    const response = await api.get<HealthRecordDTO[]>('/health-records');
    return response.data;
  },

  // Busca um registro por CPF do cliente
  getByClientCPF: async (cpf: string): Promise<HealthRecordDTO> => {
    const response = await api.get<HealthRecordDTO>(`/health-records/client/${cpf}`);
    return response.data;
  },

  // Cria um novo registro de saúde
  create: async (record: HealthRecordDTO): Promise<HealthRecordDTO> => {
    const response = await api.post<HealthRecordDTO>('/health-records', record);
    return response.data;
  },

  // Atualiza um registro de saúde existente
  update: async (cpf: string, record: HealthRecordDTO): Promise<HealthRecordDTO> => {
    const response = await api.put<HealthRecordDTO>(`/health-records/${cpf}`, record);
    return response.data;
  },

  // Deleta um registro por CPF
  remove: async (cpf: string): Promise<void> => {
    await api.delete(`/health-records/${cpf}`);
  },
};
