import React, { useState } from 'react';
import { ModalOverlay, ModalContent } from './styles';

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;  // Agora espera uma Promise
  title?: string;
  message?: string;
}

export const RemoveModal: React.FC<RemoveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Remover item',
  message = 'Tem certeza que deseja remover este item?',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch {
      setError('Erro ao remover. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{title}</h2>
        <p>{message}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="actions">
          <button className="cancel" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="confirm" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};
