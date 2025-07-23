import api from '../api/api';
import { ProcedimentoDTO } from '../types';

export const procedureService = {
  // Lista todos os procedimentos
  listAll: async (): Promise<ProcedimentoDTO[]> => {
    const response = await api.get('/procedures');
    return response.data;
  },

  // Busca procedimento por nome
  findByName: async (name: string): Promise<ProcedimentoDTO> => {
    const response = await api.get(`/procedures/${name}`);
    return response.data;
  },

  // Cria novo procedimento
  create: async (procedure: ProcedimentoDTO): Promise<ProcedimentoDTO> => {
    const response = await api.post('/procedures', procedure);
    return response.data;
  },

  // Atualiza ProcedimentoDTO
  update: async (name: string, procedure: ProcedimentoDTO): Promise<ProcedimentoDTO> => {
    const response = await api.put(`/procedures/${name}`, procedure);
    return response.data;
  },

  // Deleta ProcedimentoDTO
  delete: async (name: string): Promise<void> => {
    await api.delete(`/procedures/${name}`);
  }
};
