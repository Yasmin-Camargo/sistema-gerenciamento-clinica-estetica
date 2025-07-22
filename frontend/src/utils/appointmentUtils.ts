import { AppointmentDTO, AppointmentStatus } from '../types';

// Converte AppointmentDTO do backend para formato de exibição
export const formatAppointmentForDisplay = (appointment: AppointmentDTO) => {
  return {
    data: formatDateToDisplay(appointment.dateTime),
    hora: formatTimeToDisplay(appointment.dateTime),
    cliente: appointment.client.name,
    status: mapStatusToPortuguese(appointment.status),
    procedimentos: appointment.proceduresName.join(', '),
    valor: `R$ ${appointment.value.toFixed(2).replace('.', ',')}`,
    original: appointment
  };
};

// Formata OffsetDateTime para exibição (dd/MM/yyyy HH:mm)
export const formatDateTimeToDisplay = (dateTime: string): string => {
  try {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTime;
  }
};

// Formata apenas a hora para exibição (HH:mm)
export const formatTimeToDisplay = (dateTime: string): string => {
  try {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTime;
  }
};

// Formata apenas a data para exibição (dd/MM/yyyy)
export const formatDateToDisplay = (dateTime: string): string => {
  try {
    const date = new Date(dateTime);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateTime;
  }
};

// Converte data do filtro (YYYY-MM-DD) para formato do backend
export const formatDateForAPI = (dateString: string): string => {
  return dateString; // Já está no formato correto
};

// Mapeia status do backend para português
export const mapStatusToPortuguese = (status: AppointmentStatus): string => {
  const statusMap = {
    [AppointmentStatus.SCHEDULED]: 'Pendente',
    [AppointmentStatus.COMPLETED]: 'Concluída',
    [AppointmentStatus.CANCELLED]: 'Cancelada'
  };
  return statusMap[status] || status;
};

// Mapeia status do português para backend
export const mapStatusToBackend = (status: string): AppointmentStatus => {
  const statusMap: { [key: string]: AppointmentStatus } = {
    'Pendente': AppointmentStatus.SCHEDULED,
    'Concluída': AppointmentStatus.COMPLETED,
    'Cancelada': AppointmentStatus.CANCELLED
  };
  return statusMap[status] || AppointmentStatus.SCHEDULED;
};

// Extrai data (YYYY-MM-DD) de um OffsetDateTime
export const extractDateFromDateTime = (dateTime: string): string => {
  try {
    const date = new Date(dateTime);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return '';
  }
};

// Formata dateTime para o backend (URL encoding necessário para caracteres especiais)
export const formatDateTimeForBackend = (dateTime: string): string => {
  try {
    // Certifica que está no formato ISO e faz URL encoding
    const date = new Date(dateTime);
    return encodeURIComponent(date.toISOString());
  } catch {
    return encodeURIComponent(dateTime);
  }
};
