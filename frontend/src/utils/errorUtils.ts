import { AxiosError } from 'axios';

const httpStatusMessages: Record<number, string> = {
  400: 'Dados inválidos. Verifique as informações informadas.',
  401: 'Sessão expirada ou não autenticado.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito ao processar a solicitação.',
  422: 'Erro de validação nos dados enviados.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.'
};

export function getErrorMessage(error: any, fallback = 'Ocorreu um erro. Tente novamente.'): string {
  try {
    const axiosErr = error as AxiosError<any>;
    const status = axiosErr?.response?.status;
    const data = axiosErr?.response?.data;

    // Mensagem direta vinda do backend
    if (data) {
      if (typeof data === 'string') return data;
      if (data.message && typeof data.message === 'string') return data.message;
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        // Une mensagens de validação
        return data.errors.map((e: any) => (typeof e === 'string' ? e : e?.message || '')).filter(Boolean).join('\n');
      }
      if (data.error && typeof data.error === 'string') return data.error;
      if (data.detail && typeof data.detail === 'string') return data.detail;
    }

    // Fallback por status HTTP
    if (status && httpStatusMessages[status]) {
      return httpStatusMessages[status];
    }

    // Erro genérico com message
    if (error?.message) return error.message;
  } catch {
    // no-op
  }
  return fallback;
}

export function notifyError(error: any, fallback = 'Ocorreu um erro. Tente novamente.'): void {
  const msg = getErrorMessage(error, fallback);
  alert(msg);
}

export function notifySuccess(message: string): void {
  alert(message);
}
