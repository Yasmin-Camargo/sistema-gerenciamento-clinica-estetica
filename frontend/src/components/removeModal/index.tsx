import React from 'react';
import { ModalOverlay, ModalContent } from './styles';

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="actions">
          <button className="cancel" onClick={onClose}>Cancelar</button>
          <button className="confirm" onClick={onConfirm}>Remover</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};
