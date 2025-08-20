import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { ClientDTO } from '../../../types';
import { clientService } from '../../../services/clientService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const ClientPage: React.FC = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
  const navigate = useNavigate();

  // Estados para filtros
  const [filterCpf, setFilterCpf] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDateRange, setFilterDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [filterIsActive, setFilterIsActive] = useState<string>(''); 


  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.listAll();
      setClients(data);
    } catch (err) {
      setError('Erro ao carregar clientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchClientsFiltered = async () => {
    setLoading(true);
    setError(null);

    const [startDate, endDate] = filterDateRange;
    const startISO = startDate ? startDate.toISOString() : undefined;
    const endISO = endDate ? endDate.toISOString() : undefined;

    try {
      const data = await clientService.filterClients(
        filterCpf || undefined,
        filterName || undefined,
        startISO,
        endISO,
        filterIsActive === '' ? undefined : filterIsActive === 'true'
      );
      setClients(data);
    } catch (err) {
      setError('Erro ao filtrar clientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToNewClient = () => {
    navigate('/clients/new');
  };

  const navigateToEditClient = (client: ClientDTO) => {
    navigate(`/clients/edit/${client.cpf}`);
  };

  const navigateToHealthRecords = (client: ClientDTO) => {
    navigate(`/health-records/${client.cpf}`);
  };

  const openRemoveModal = (client: ClientDTO) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const confirmRemove = async () => {
      if (!selectedClient) return;
      try {
        await clientService.delete(selectedClient.cpf);
        alert('Cliente removido com sucesso!');
        await fetchClientsFiltered(); 
      } catch (err) {
        alert('Erro ao remover cliente.');
        console.error(err);
      } finally {
        setModalOpen(false);
        setSelectedClient(null);
      }
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      fetchClientsFiltered();
    }
  };

  const filtros = (
    <div className="filtros">
         <input
          type="text"
          placeholder="CPF"
          value={filterCpf}
          onChange={(e) => setFilterCpf(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          placeholder="Nome"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      <div>
        <DatePicker
          selectsRange
          startDate={filterDateRange[0]}
          endDate={filterDateRange[1]}
          onChange={(dates) => setFilterDateRange(dates as [Date | null, Date | null])}
          isClearable={true}
          placeholderText="Selecione o intervalo de datas"
          onKeyDown={handleKeyDown}
          dateFormat="yyyy-MM-dd"
        />
      </div>
        <select
          value={filterIsActive}
          onChange={(e) => setFilterIsActive(e.target.value)}
          onKeyDown={handleKeyDown}
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <button className="btn-submit" type="button" onClick={fetchClientsFiltered}>
          Filtrar
        </button>
        <button
          className="btn-cancel"
          type="button"
          onClick={() => {
            setFilterCpf('');
            setFilterName('');
            setFilterDateRange([null, null]);
            setFilterIsActive('');
            fetchClients();
          }}
        >
          Limpar
        </button>
        </div>
    )


  return (
    <StandardPage
      title="Clientes"
      buttonLabel="Novo Cliente"
      onButtonClick={navigateToNewClient}
      filters={filtros}
    >
      <TableStyles>
        <table className="table">
          <thead>
            <tr>
              <th>CPF</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Carregando clientes...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} style={{ color: 'red' }}>{error}</td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={5}>Nenhum cliente encontrado.</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.cpf}>
                  <td>{client.cpf}</td>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.email}</td>
                  <td className="action-cell">
                    <button
                      className="action-button"
                      onClick={() => navigateToHealthRecords(client)}
                    >
                      <img src="/IconFicha.png" alt="Ficha de Saúde" />
                    </button>
                    <button
                      className="action-button"
                      onClick={() => navigateToEditClient(client)}
                    >
                      <img src="/IconEdit.png" alt="Editar" />
                    </button>
                    <button
                      className="action-button"
                      onClick={() => openRemoveModal(client)}
                    >
                      <img src="/IconLixo.png" alt="Excluir" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableStyles>

      <RemoveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmRemove}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${selectedClient?.name}"?`}
      />
    </StandardPage>
  );
};