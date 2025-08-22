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
  data: string;       
  cliente: string;
  status: 'Pendente' | 'Concluída' | 'Cancelada' | string;
  procedimentos: string;
  valor: string;
}

export interface ProductReferenceDTO {
  id: number;
  name: string;
}

export interface ProcedimentoDTO {
  name: string;
  description: string;
  estimatedDuration: number;
  cost: number;
  products?: ProductReferenceDTO[];
}

export interface ClientDTO {
  cpf: string;
  name: string;
  phone: string;
  birthDate?: string;
  email: string;
  address?: string;
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface HealthRecordDTO {
  clientCPF: string;
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
  // Prefer lastUpdated; offSetDataTime kept for backward compat with older code
  lastUpdated?: string;
  offSetDataTime?: string;
}

export interface ClinicInfoDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}
