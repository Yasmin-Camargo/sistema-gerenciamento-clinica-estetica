import React, { useState, useEffect, useMemo } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { ProcedimentoDTO } from '../../../types';
import { procedureService } from '../../../services/procedureService';
import api from '../../../api/api';

export const ProcedurePage: React.FC = () => {
  const [procedimentos, setProcedimentos] = useState<ProcedimentoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<ProcedimentoDTO | null>(null);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await procedureService.listAll();
      setProcedimentos(data);
    } catch (err) {
      setError('Erro ao carregar procedimentos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const truncate = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.slice(0, maxLength) + '...';

  const navigateToNewProcedure = () => {
    navigate('/procedure/new');
  };

  const editarProcedimento = (proc: ProcedimentoDTO) => {
    navigate(`/procedure/edit/${proc.name}`);
  };

  const excluirProcedimento = (proc: ProcedimentoDTO) => {
    setProcedimentoSelecionado(proc);
    setModalAberto(true);
  };
  
    const handleConfirmRemove = async () => {
      if (!procedimentoSelecionado) return;
  
      try {
        await procedureService.delete(procedimentoSelecionado.name);
        setModalAberto(false);
        setProcedimentos((prev) => prev.filter((p) => p.name !== procedimentoSelecionado.name));
      } catch (error: any) {
        console.error('Erro ao remover procedimento:', error);
        if (error.response?.data?.message) {
          alert(`Erro ao remover procedimento: ${error.response.data.message}`);
        } else {
          alert('Erro ao remover procedimento. Tente novamente.');
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
  };

  const handleBusca = async () => {
    if (!busca.trim()) {
      fetchProcedures();
      return;
    }

    try {
      setLoading(true);
      const encontrado = await procedureService.findByName(busca.trim());
      setProcedimentos([encontrado]);
    } catch {
      setProcedimentos([]);
      alert('Procedimento não encontrado.');
    } finally {
      setLoading(false);
    }
  };


  const filtros = ( 
    <div className="filtros">
      <input
        placeholder="Busca procedimento"
        value={busca}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleBusca();
      }}
      />
    </div>
  );

  return (
    <StandardPage
      title="Procedimentos"
      buttonLabel="Novo Procedimento"
      onButtonClick={navigateToNewProcedure}
      filters={filtros}
    >
      <TableStyles>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Duração Estimada (min)</th>
              <th>Custo (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Carregando procedimentos...</td>
              </tr>
            ) : procedimentos.length > 0 ? (
              procedimentos.map((proc) => (
                <tr key={proc.name}>
                  <td>{proc.name}</td>
                  <td>{truncate(proc.description, 50)}</td>
                  <td>{proc.estimatedDuration}</td>
                  <td>{proc.cost.toFixed(2)}</td>
                  <td className="action-cell">
                    <button
                      className="action-button"
                      onClick={() => editarProcedimento(proc)}
                    >
                      <img src="/IconEdit.png" alt="Editar" />
                    </button>
                    <button
                      className="action-button"
                      onClick={() => excluirProcedimento(proc)}
                    >
                      <img src="/IconLixo.png" alt="Excluir" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Nenhum procedimento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </TableStyles>

    <RemoveModal
      isOpen={modalAberto}
      onClose={() => setModalAberto(false)}
      onConfirm={handleConfirmRemove}
      title="Excluir Procedimento"
      message={`Tem certeza que deseja excluir o procedimento "${procedimentoSelecionado?.name}"?`}
    />
    </StandardPage>
  );
};
