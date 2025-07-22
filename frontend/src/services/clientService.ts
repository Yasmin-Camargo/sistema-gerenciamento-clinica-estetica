import api from '../api/api';
import { ClientDTO } from '../types';

export const clientService = {
  // Lista todos os clientes
  listAll: async (): Promise<ClientDTO[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  // Busca cliente por CPF
  findByCpf: async (cpf: string): Promise<ClientDTO> => {
    const response = await api.get(`/clients/${cpf}`);
    return response.data;
  },

  // Cria novo cliente
  create: async (client: ClientDTO): Promise<ClientDTO> => {
    const response = await api.post('/clients', client);
    return response.data;
  },

  // Atualiza cliente
  update: async (cpf: string, client: ClientDTO): Promise<ClientDTO> => {
    const response = await api.put(`/clients/${cpf}`, client);
    return response.data;
  },

  // Deleta cliente
  delete: async (cpf: string): Promise<void> => {
    await api.delete(`/clients/${cpf}`);
  }
};
