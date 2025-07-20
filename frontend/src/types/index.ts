export interface EstheticianDTO {
  cpf: string;
  name: string;
  phone: string;
  birthDate?: string;
  email: string;
  address?: string;
  professionalRegistrationNumber: string;
  specializations?: string;
  password?: string;
}

export interface Consulta {
  data: string;
  cliente: string;
  status: 'Pendente' | 'Concluída' | 'Cancelada' | string;
  procedimentos: string;
  valor: string;
}
