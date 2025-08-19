import api from '../api/api';

export interface PopularProceduresDTO {
  name: string;
  count: number;
}

export interface HomePageDTO {
  nextAppointments: any[];
  popularProcedures: PopularProceduresDTO[];
  totalRevenue: number;
}

export const dashboardService = {
  getHomePageData: async (): Promise<HomePageDTO> => {
    const response = await api.get('/dashboard/home');
    return response.data;
  }
  
};
