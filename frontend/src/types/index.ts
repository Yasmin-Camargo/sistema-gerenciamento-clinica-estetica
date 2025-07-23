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

export interface ReferenceDTO {
  cpf: string;
  name: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED', 
  CANCELLED = 'CANCELLED'
}

export interface AppointmentDTO {
  esthetician: ReferenceDTO;
  client: ReferenceDTO;
  dateTime: string;
  clinicalNotes?: string;
  value: number;
  status: AppointmentStatus;
  proceduresName: string[];
}
export interface ConsultaDTO {
  data: string;         // poderia ser Date | string dependendo do uso
  cliente: string;
  status: 'Pendente' | 'Concluída' | 'Cancelada' | string;
  procedimentos: string;
  valor: string;
}

export interface ProcedimentoDTO {
  name: string;
  description: string;
  estimatedDuration: number;
  cost: number;
}

export interface ClientDTO {
  cpf: string;
  name: string;
  phone: string;
  birthDate?: string;
  email: string;
  address?: string;
}