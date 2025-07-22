import React, { useState, useEffect, useMemo } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { ClientDTO } from '../../../types';
import { clientService } from '../../../services/clientService';

  export const ClientPage: React.FC = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
  const navigate = useNavigate();

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

  const navigateToNewClient = () => {
    navigate('/clients/new');
  };

  const navigateToEditClient = (client: ClientDTO) => {
    navigate(`/clients/edit/${client.cpf}`);
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
      await fetchClients();
    } catch (err) {
      alert('Erro ao remover cliente.');
      console.error(err);
    } finally {
      setModalOpen(false);
      setSelectedClient(null);
    }
  };

  return (
    <StandardPage
      title="Clientes"
      buttonLabel="Novo Cliente"
      onButtonClick={navigateToNewClient}
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