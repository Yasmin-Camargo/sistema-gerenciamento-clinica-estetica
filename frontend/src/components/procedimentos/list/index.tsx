import React, { useState, useMemo, use, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';  
import { ConsultaStyles } from '../../consultas/list/styles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { Procedimento } from '../../../types';
import api from '../../../api/api';

export const ProcedurePage: React.FC = () => {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProcedimentos = async () => {
      try {
        const response = await api.get('/procedures');
        setProcedimentos(response.data);
      } catch (err) {
        setError('Erro ao carregar procedimentos');
      } finally {
        setLoading(false);
      }
    };

    fetchProcedimentos();
  }, []);

  function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

  const navigateToNewProcedure = () => {
    navigate('/procedure/new');
  };

    return (
  <StandardPage title="Procedimentos"
  buttonLabel='Novo Procedimento'
  onButtonClick={navigateToNewProcedure}
  >
    <ConsultaStyles>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Duração Estimada (min)</th>
            <th>Custo (R$)</th>
          </tr>
        </thead>
          <tbody>
            {procedimentos.length > 0 ? (
              procedimentos.map((proc, index) => (
                <tr key={index}>
                  <td>{proc.name}</td>
                  <td>{truncate(proc.description, 50)}</td> {/* descrição truncada */}
                  <td>{proc.estimatedDuration}</td>
                  <td>{proc.cost.toFixed(2)}</td>
                  <td className="action-cell">
                    <button className="action-button" onClick={() => navigate(`/procedure/edit/`)}>
                      <img src="/IconEdit.png" alt="Editar" />
                    </button>
                    {/* <button className="action-button" onClick={() => excluirProcedimento}>
                      <img src="/IconLixo.png" alt="Excluir" />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Nenhum procedimento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </ConsultaStyles>
    </StandardPage>
  );

}; 