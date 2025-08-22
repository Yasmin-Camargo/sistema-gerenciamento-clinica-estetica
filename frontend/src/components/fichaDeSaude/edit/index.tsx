import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StandardPage } from '../../listPadrao';
import { healthRecordService } from '../../../services/healthRecordService';
import { HealthRecordDTO } from '../../../types';
import { notifyError, notifySuccess } from '../../../utils/errorUtils';
import { RemoveModal } from '../../removeModal';

export const EditHealthRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const { cpf } = useParams<{ cpf: string }>();

  const [record, setRecord] = useState<HealthRecordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);

  const emptyRecord: HealthRecordDTO = useMemo(
    () => ({
      clientCPF: cpf ?? '',
      allergies: '',
      medications: '',
      bloodType: '',
      chronicDiseases: '',
      skinType: '',
      observations: '',
      height: 0,
      weight: 0,
      imc: 0,
      previousProcedures: '',
      phototype: '',
  lastUpdated: new Date().toISOString(),
    }),
    [cpf]
  );

  useEffect(() => {
    const fetchRecord = async () => {
      if (!cpf) {
        setError('CPF não informado.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await healthRecordService.getByClientCPF(cpf);
        const normalized: HealthRecordDTO = {
          clientCPF: data.clientCPF || cpf,
          allergies: (data.allergies || ''),
          medications: (data.medications || ''),
          bloodType: data.bloodType || '',
          chronicDiseases: (data.chronicDiseases || ''),
          skinType: data.skinType || '',
          observations: data.observations || '',
          height: data.height ?? 0,
          weight: data.weight ?? 0,
          imc: data.imc ?? 0,
          previousProcedures: (data.previousProcedures || ''),
          phototype: data.phototype || '',
          lastUpdated: (data as any).lastUpdated || data.offSetDataTime || new Date().toISOString(),
        };
        setRecord(normalized);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // Se não existe, prepara para criar
          setRecord(emptyRecord);
        } else {
          setError('Erro ao carregar ficha de saúde.');
          notifyError(err, 'Erro ao carregar ficha de saúde.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [cpf, emptyRecord]);

  const handleChange = (key: keyof HealthRecordDTO, value: any) => {
    setRecord(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  // text inputs are controlled; user can separate itens com vírgula

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record || !record.clientCPF) {
      notifyError(null, 'CPF do cliente é obrigatório.');
      return;
    }
    const round2 = (n: number | undefined) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);
    const height = round2(record.height || 0) as number;
    const weight = round2(record.weight || 0) as number;
    if (height <= 0 || height >= 3) {
      notifyError(null, 'Altura inválida. Informe em metros (ex.: 1.70) e menor que 3.00.');
      return;
    }
    if (weight <= 0 || weight > 200) {
      notifyError(null, 'Peso inválido. Informe um valor entre 0.01 kg e 200.00 kg.');
      return;
    }
    const imc = (weight && height) ? round2(weight / (height * height)) as number : 0;
  const payload: HealthRecordDTO = { ...record, height, weight, imc, lastUpdated: new Date().toISOString() };
    try {
      await healthRecordService.update(payload.clientCPF, payload);
      notifySuccess('Ficha de saúde salva com sucesso!');
      navigate('/clients');
    } catch (err) {
      notifyError(err, 'Erro ao salvar ficha de saúde.');
    }
  };

  const confirmRemove = async () => {
    if (!cpf) return;
    try {
      await healthRecordService.remove(cpf);
      notifySuccess('Ficha de saúde removida com sucesso!');
      navigate('/clients');
    } catch (err) {
      notifyError(err, 'Erro ao remover ficha de saúde.');
      throw err; // para o modal exibir erro
    }
  };

  if (loading) return <StandardPage title="Ficha de Saúde"><div>Carregando...</div></StandardPage>;
  if (error) return <StandardPage title="Ficha de Saúde"><div style={{color:'red'}}>{error}</div></StandardPage>;
  if (!record) return <StandardPage title="Ficha de Saúde"><div>Registro não disponível.</div></StandardPage>;

  return (
    <StandardPage title={`Cliente ${record.clientCPF} > Ficha de Saúde`}>
      <form className="form" onSubmit={save}>
        <div className="field">
          <label>CPF do Cliente</label>
          <input type="text" value={record.clientCPF} disabled />
        </div>

        <div className="field">
          <label>Alergias</label>
          <input
            type="text"
            value={record.allergies}
            onChange={e => handleChange('allergies', e.target.value)}
            placeholder="Separe múltiplos itens por vírgula"
          />
        </div>

        <div className="field">
          <label>Tipo Sanguíneo</label>
          <select value={record.bloodType} onChange={e => handleChange('bloodType', e.target.value)}>
            <option value="">Selecione</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="field">
          <label>Medicamentos</label>
          <input
            type="text"
            value={record.medications}
            onChange={e => handleChange('medications', e.target.value)}
            placeholder="Separe múltiplos itens por vírgula"
          />
        </div>

        <div className="field">
          <label>Doenças Crônicas</label>
          <input
            type="text"
            value={record.chronicDiseases}
            onChange={e => handleChange('chronicDiseases', e.target.value)}
            placeholder="Separe múltiplos itens por vírgula"
          />
        </div>

        <div className="field">
          <label>Tipo de Pele</label>
          <select value={record.skinType} onChange={e => handleChange('skinType', e.target.value)}>
            <option value="">Selecione</option>
            <option value="normal">Normal</option>
            <option value="mista">Mista</option>
            <option value="oleosa">Oleosa</option>
            <option value="seca">Seca</option>
          </select>
        </div>

        <div className="field">
          <label>Observações</label>
          <textarea
            value={record.observations}
            onChange={e => handleChange('observations', e.target.value)}
            placeholder="Ex: histórico de saúde, comentários adicionais"
          />
        </div>

        <div className="field">
          <label>Procedimentos Anteriores</label>
          <input
            type="text"
            value={record.previousProcedures}
            onChange={e => handleChange('previousProcedures', e.target.value)}
            placeholder="Separe múltiplos itens por vírgula"
          />
        </div>

        <div className="field">
          <label>Fototipo</label>
          <select value={record.phototype} onChange={e => handleChange('phototype', e.target.value)}>
            <option value="">Selecione</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
          </select>
        </div>

        <div className="field">
          <label>Altura (m)*</label>
          <input
            type="number"
            step="0.01"
            value={record.height}
            onChange={e => handleChange('height', parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="field">
          <label>Peso (kg)*</label>
          <input
            type="number"
            step="any"
            min={0.01}
            max={200}
            value={record.weight}
            onChange={e => handleChange('weight', parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="button" className="btn-cancel" onClick={() => setRemoveOpen(true)}>Excluir</button>
          <button type="submit" className="btn-submit">Salvar</button>
        </div>
      </form>

      <RemoveModal
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={confirmRemove}
        title="Excluir Ficha de Saúde"
        message={`Tem certeza que deseja excluir a ficha do cliente "${record.clientCPF}"?`}
      />
    </StandardPage>
  );
};
