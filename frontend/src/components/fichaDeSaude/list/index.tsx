import React, { useState, useEffect, useCallback } from 'react';
import { StandardPage } from '../../listPadrao';  
import { HealthRecordDTO } from '../../../types';
import { RemoveModal } from '../../removeModal';
import { useNavigate, useParams } from 'react-router-dom';
import { healthRecordService } from '../../../services/healthRecordService';
import { notifyError, notifySuccess } from '../../../utils/errorUtils';

export const ListHealthRecordPage: React.FC = () => {
  const { cpf } = useParams<{ cpf: string }>();
  const [record, setRecord] = useState<HealthRecordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchRecord = useCallback(async (cpf: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthRecordService.getByClientCPF(cpf);
      setRecord(data);
    } catch (err) {
      const status = (err as any)?.response?.status;
      if (status === 404) {
        navigate(`/health-records/new/${cpf}`);
        return;
      }
      setError('Erro ao carregar a ficha de saúde.');
      notifyError(err, 'Erro ao carregar a ficha de saúde.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (cpf) fetchRecord(cpf);
  }, [cpf, fetchRecord]);

  const openRemoveModal = () => {
    setModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!cpf) return;
    try {
      await healthRecordService.remove(cpf);
  notifySuccess('Ficha de saúde removida com sucesso!');
      navigate(-1);
    } catch (err) {
  notifyError(err, 'Erro ao remover a ficha de saúde.');
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <StandardPage
      title="Ficha de Saúde"
      buttonLabel="Voltar"
      onButtonClick={() => navigate(-1)}
    >
      {loading && <p>Carregando ficha de saúde...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {record && (
        <div className="health-record-card">
          <label>CPF do Cliente:</label>
          <input type="text" value={record.clientCPF} disabled />

          <label>Altura:</label>
          <input type="text" value={record.height} disabled />

          <label>Peso:</label>
          <input type="text" value={record.weight} disabled />

          <label>Observações:</label>
          <textarea value={record.observations} disabled />

          <div className="actions">
            <button onClick={openRemoveModal}>Excluir Ficha</button>
          </div>
        </div>
      )}

      <RemoveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmRemove}
        title="Excluir Ficha de Saúde"
        message="Tem certeza que deseja excluir esta ficha de saúde?"
      />
    </StandardPage>
  );
};