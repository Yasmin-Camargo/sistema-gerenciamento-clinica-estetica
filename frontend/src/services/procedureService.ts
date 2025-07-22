import api from '../api/api';
import { Procedimento } from '../types';

export const procedureService = {
  // Lista todos os procedimentos
  listAll: async (): Promise<Procedimento[]> => {
    const response = await api.get('/procedures');
    return response.data;
  },

  // Busca procedimento por nome
  findByName: async (name: string): Promise<Procedimento> => {
    const response = await api.get(`/procedures/${name}`);
    return response.data;
  },

  // Cria novo procedimento
  create: async (procedure: Procedimento): Promise<Procedimento> => {
    const response = await api.post('/procedures', procedure);
    return response.data;
  },

  // Atualiza procedimento
  update: async (name: string, procedure: Procedimento): Promise<Procedimento> => {
    const response = await api.put(`/procedures/${name}`, procedure);
    return response.data;
  },

  // Deleta procedimento
  delete: async (name: string): Promise<void> => {
    await api.delete(`/procedures/${name}`);
  }
};
