import api from "../api/api";
import { EstheticianFormData } from "../components/esteticista/new";

export const estheticianService = {
  listEstheticians: async (): Promise<EstheticianFormData[]> => {
    const response = await api.get('/estheticians');
    return response.data;
  },
  
  getAllEstheticians: async () => {
    const response = await api.get('/estheticians');
    return response.data;
  },
  createEsthetician: async (data: EstheticianFormData) => {
    const response = await api.post('/estheticians', data);
    return response.data;
  },
  updateEsthetician: async (id: string, data: EstheticianFormData) => {
    const response = await api.put(`/estheticians/${id}`, data);
    return response.data;
  },
  deleteEsthetician: async (id: string) => {
    const response = await api.delete(`/estheticians/${id}`);
    return response.data;
  },
};
