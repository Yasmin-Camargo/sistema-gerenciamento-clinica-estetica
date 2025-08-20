import api from '../api/api';
import { HealthRecordDTO } from '../types';

type ApiHealthRecordPayload = {
  clientCpf: string;
  allergies?: string;
  medications?: string;
  bloodType?: string;
  chronicDiseases?: string;
  skinType?: string;
  observations?: string;
  height?: number;
  weight?: number;
  imc?: number;
  previousProcedures?: string;
  phototype?: string;
  lastUpdated?: string;
};

const mapToApiPayload = (record: HealthRecordDTO): ApiHealthRecordPayload => ({
  clientCpf: record.clientCPF || '',
  allergies: (record.allergies || []).join(', '),
  medications: (record.medications || []).join(', '),
  bloodType: record.bloodType,
  chronicDiseases: (record.chronicDiseases || []).join(', '),
  skinType: record.skinType,
  observations: record.observations,
  height: record.height,
  weight: record.weight,
  imc: record.imc,
  previousProcedures: (record.previousProcedures || []).join(', '),
  phototype: record.phototype,
  lastUpdated: record.offSetDataTime || new Date().toISOString(),
});

export const healthRecordService = {
  // Lista todos os registros de saúde
  listAll: async (): Promise<HealthRecordDTO[]> => {
    const response = await api.get<HealthRecordDTO[]>('/health-records');
    return response.data;
  },

  // Busca um registro por CPF do cliente
  getByClientCPF: async (cpf: string): Promise<HealthRecordDTO> => {
    const response = await api.get<HealthRecordDTO>(`/health-records/${cpf}`);
    return response.data;
  },

  // Cria/atualiza um registro de saúde (PUT com CPF na rota)
  create: async (cpf: string, record: HealthRecordDTO): Promise<HealthRecordDTO> => {
    const payload = mapToApiPayload(record);
    const response = await api.put<HealthRecordDTO>(`/health-records/${cpf}`, payload);
    return response.data;
  },

  // Atualiza um registro de saúde existente
  update: async (cpf: string, record: HealthRecordDTO): Promise<HealthRecordDTO> => {
    const payload = mapToApiPayload(record);
    const response = await api.put<HealthRecordDTO>(`/health-records/${cpf}`, payload);
    return response.data;
  },

  // Deleta um registro por CPF
  remove: async (cpf: string): Promise<void> => {
    await api.delete(`/health-records/${cpf}`);
  },
};
