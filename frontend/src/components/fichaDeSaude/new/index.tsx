import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { healthRecordService } from '../../../services/healthRecordService';
import { HealthRecordDTO } from '../../../types';
import { StandardPage } from '../../listPadrao';

export const NewHealthRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const { cpf } = useParams<{ cpf: string }>();

  const [record, setRecord] = useState<HealthRecordDTO>({
    clientCPF: cpf ?? '',
    allergies: [],
    medications: [],
    bloodType: '',
    chronicDiseases: [],
    skinType: '',
    observations: '',
    height: 0,
    weight: 0,
    imc: 0,
    previousProcedures: [],
    phototype: '',
    offSetDataTime: new Date().toISOString(),
  });

  // Sem estados de loading/erro por enquanto; podemos adicionar feedback visual depois.

  useEffect(() => {
    if (cpf && cpf !== record.clientCPF) {
      setRecord(prev => ({ ...prev, clientCPF: cpf }));
    }
  }, [cpf, record.clientCPF]);

  const addItem = (key: 'allergies' | 'medications' | 'previousProcedures' | 'chronicDiseases', value: string) => {
    if (!value.trim()) return;
    setRecord(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), value.trim()],
    }));
  };

  const handleChange = (key: keyof HealthRecordDTO, value: any) => {
    setRecord(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record.clientCPF) {
      alert('CPF do cliente é obrigatório para criar a ficha de saúde.');
      return;
    }
    try {
      await healthRecordService.create(record.clientCPF, record);
      navigate('/clients');
    } catch (err) {
      console.error('Erro ao salvar registro de saúde', err);
    } finally {
    }
  };

  return (
    <StandardPage title="Nova Cliente > Nova Ficha de Saúde">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>CPF do Cliente</label>
          <input type="text" value={record.clientCPF} disabled />
        </div>
        
        {/* Alergias */}
        <div className="field">
          <label>Alergias</label>
          <input
            type="text"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  addItem('allergies', value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <div>
            {(record.allergies || []).map(a => <span key={a}>{a}</span>)}
          </div>
        </div>

        {/* Tipo Sanguíneo */}
        <div className="field">
          <label>Tipo Sanguíneo</label>
          <select
            value={record.bloodType}
            onChange={e => handleChange('bloodType', e.target.value)}
          >
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

        {/* Medicamentos */}
        <div className="field">
          <label>Medicamentos</label>
          <input
            type="text"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  addItem('medications', value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <div>
            {(record.medications || []).map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Doenças Crônicas */}
        <div className="field">
          <label>Doenças Crônicas</label>
          <input
            type="text"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('chronicDiseases', (e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <div>
            {record.chronicDiseases?.map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Tipo de Pele */}
        <div className="field">
          <label>Tipo de Pele</label>
          <select
            value={record.skinType}
            onChange={e => handleChange('skinType', e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="normal">Normal</option>
            <option value="mista">Mista</option>
            <option value="oleosa">Oleosa</option>
            <option value="seca">Seca</option>
          </select>
        </div>

        
        {/* Observações */}
        <div className="field">
          <label>Observações</label>
          <textarea
            value={record.observations}
            onChange={e => handleChange('observations', e.target.value)}
            placeholder="Ex: histórico de saúde, comentários adicionais"
          />
        </div>

        {/* Procedimentos Anteriores */}
        <div className="field">
          <label>Procedimentos Anteriores</label>
          <input
            type="text"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  addItem('previousProcedures', value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <div>
            {(record.previousProcedures || []).map(p => <span key={p}>{p}</span>)}
          </div>
        </div>

               {/* Fototipo */}
        <div className="field">
          <label>Fototipo</label>
          <select
            value={record.phototype}
            onChange={e => handleChange('phototype', e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
          </select>
        </div>

              {/* Altura */}
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

        {/* Peso */}
        <div className="field">
          <label>Peso (kg)*</label>
          <input
            type="number"
            step="0.1"
            value={record.weight}
            onChange={e => handleChange('weight', parseFloat(e.target.value))}
            required
          />
        </div>

           <div className="actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Salvar
          </button>
        </div>
      </form>
    </StandardPage>
  );
};