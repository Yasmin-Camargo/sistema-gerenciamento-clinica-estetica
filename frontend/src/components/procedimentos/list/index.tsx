import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { ProcedimentoDTO } from '../../../types';
import { procedureService } from '../../../services/procedureService';
import { notifyError, notifySuccess } from '../../../utils/errorUtils';

export const ProcedurePage: React.FC = () => {
  const [procedimentos, setProcedimentos] = useState<ProcedimentoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<ProcedimentoDTO | null>(null);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    setLoading(true);
    try {
      const data = await procedureService.listAll();
      setProcedimentos(data);
    } catch (err) {
  notifyError(err, 'Erro ao carregar procedimentos.');
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
        notifySuccess('Procedimento removido com sucesso!');
      } catch (error: any) {
        notifyError(error, 'Erro ao remover procedimento. Tente novamente.');
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
  };

  const handleBusca = async () => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      fetchProcedures();
      return;
    }

    try {
      setLoading(true);
      const todos = await procedureService.listAll();
      const filtrados = todos.filter((p) => {
        const byName = p.name?.toLowerCase().includes(termo);
        const byDesc = p.description?.toLowerCase().includes(termo);
        const byProduct = Array.isArray(p.products)
          ? p.products.some((prod) => prod.name?.toLowerCase().includes(termo))
          : false;
        return Boolean(byName || byDesc || byProduct);
      });
      setProcedimentos(filtrados);
    } catch (err) {
      notifyError(err, 'Erro ao filtrar procedimentos.');
      setProcedimentos([]);
    } finally {
      setLoading(false);
    }
  };


  const filtros = ( 
    <div className="filters">
      <input
        placeholder="Busca procedimento"
        value={busca}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleBusca();
      }}
      />
      <button className="btn-submit" type="button" onClick={handleBusca}>
        Filtrar
      </button>
      <button
        className="btn-cancel"
        type="button"
        onClick={() => {
          setBusca('');
          fetchProcedures();
        }}
      >
        Limpar
      </button>
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
              <th>Produtos</th>
              <th>Ações</th>
            </tr>
          </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Carregando procedimentos...</td>
              </tr>
            ) : procedimentos.length > 0 ? (
              procedimentos.map((proc) => (
                <tr key={proc.name}>
                  <td>{proc.name}</td>
                  <td>{truncate(proc.description, 50)}</td>
                  <td>{proc.estimatedDuration}</td>
                  <td>{proc.cost.toFixed(2)}</td>
                  <td>
                    {proc.products && proc.products.length > 0
                      ? proc.products.map(p => p.name).join(', ')
                      : '-'}
                  </td>
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
                <td colSpan={6}>Nenhum procedimento encontrado.</td>
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
