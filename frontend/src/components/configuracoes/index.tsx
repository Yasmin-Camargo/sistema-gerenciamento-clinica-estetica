import React, { useState, useEffect } from 'react';
import { StandardPage } from '../listPadrao';  
import { dashboardService } from '../../services/dashboardService';
import { clientService } from '../../services/clientService';
import { productService } from '../../services/productService';
import { procedureService } from '../../services/procedureService';
import { estheticianService } from '../../services/esthetianService';
import { appointmentService } from '../../services/appointmentService';
import { ClientDTO, ProductDTO, ProcedimentoDTO } from '../../types';
import { SettingsStyles } from './styles';
import { EstheticianFormData } from '../esteticista/new';
import { RemoveModal } from '../removeModal';

export const SettingsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [procedures, setProcedures] = useState<ProcedimentoDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [appointments] = useState<any[]>([]);
  const [esthetician, setEsthetician] = useState<EstheticianFormData | null>(null);
  const [, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EstheticianFormData | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setLoading(true);
    try {
      const [ , clientsRes, procsRes, prodsRes, esthetiansRes] = await Promise.all([
        dashboardService.getHomePageData(),
        clientService.getAllClients(),
        procedureService.getAllProcedimentos(),
        productService.getAllProducts(),
        estheticianService.listEstheticians()
      ]);

      setClients(clientsRes);
      setProcedures(procsRes);
      setProducts(prodsRes);

      if (esthetiansRes.length > 0) {
        setEsthetician(esthetiansRes[0]);
        setFormData(esthetiansRes[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers desnecessários removidos (uso inline no JSX)
  
  const handleRemoveClinic = async () => {
    if (!esthetician) return;

    try {
      // Deleta produtos (usa listagem geral; ajuste de filtro por clínica não disponível no service)
      const products = await productService.getAllProducts();
      for (const p of products) {
        await productService.delete(p.id);
      }

      // Deleta procedimentos
      const procedures = await procedureService.getAllProcedimentos();
      for (const proc of procedures) {
        await procedureService.delete(proc.name);
      }

      // Deleta consultas
      const appointments = await appointmentService.listAll();
      for (const app of appointments) {
        await appointmentService.delete(app.esthetician.cpf, app.client.cpf, app.dateTime);
      }

      // Deleta clientes
      const clients = await clientService.getAllClients();
      for (const client of clients) {
        await clientService.delete(client.cpf);
      }

      await estheticianService.deleteEsthetician(esthetician.cpf);

      setEsthetician(null);
      alert('Clínica removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover clínica:', error);
      alert('Não foi possível remover a clínica.');
    }
  };

    const clinicInfos = (
     <StandardPage title="">
      <div className="clinicInfos">
        <h3>Informações da Clínica</h3>
          <div className="infos">
              <p>Clientes: {clients.length}</p>
              <p>Procedimentos: {procedures.length}</p>
              <p>Consultas: {appointments.length}</p>
              <p>Produtos: {products.length}</p>
          </div>
      </div>
    </StandardPage>
    )

  const estheticianInfo = esthetician ? (
    <StandardPage title="">
      <div className="esthetician-header">
      <h3>Informações do Esteticista</h3>
      <button className="action-button" onClick={() => setIsEditing(true)}>
        <img src="/IconEdit.png" alt="Editar" />
      </button>
      </div>
      <div className="infos">
        {esthetician.name && <p>Nome: {esthetician.name}</p>}
        {esthetician.cpf && <p>CPF: {esthetician.cpf}</p>}
        {esthetician.email && <p>Email: {esthetician.email}</p>}
        {esthetician.phone && <p>Telefone: {esthetician.phone}</p>}
      </div>
      <div className="infos">
        {esthetician.birthDate && <p>Data de Nascimento: {esthetician.birthDate}</p>}
        {esthetician.address && <p>Endereço: {esthetician.address}</p>}
        {esthetician.professionalRegistrationNumber && (
          <p>Registro Profissional: {esthetician.professionalRegistrationNumber}</p>
        )}
        {esthetician.specializations && <p>Especialização: {esthetician.specializations}</p>}
      </div>
    </StandardPage>
  ) : null;

  const fieldLabels: Record<string, string> = {
    cpf: 'CPF',
    name: 'Nome',
    phone: 'Telefone',
    birthDate: 'Data de Nascimento',
    email: 'Email',
    address: 'Endereço',
    professionalRegistrationNumber: 'Número do Registro Profissional',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    specializations: 'Especializações',
  };

  const editEsthetician = formData ? (
    <StandardPage title="">
      <div className="esthetician-header">
        <h3>Editando Esteticista</h3>
      </div>
      <div className="form">
        {Object.keys(formData).map((key) => (
          <div className="field" key={key}>
            <input
              name={key}
              value={(formData as any)[key] || ''}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              placeholder={fieldLabels[key] || key}
              disabled={key === 'cpf'}
              style={key === 'cpf' ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
              title={key === 'cpf' ? 'O CPF não pode ser alterado pois é a chave primária' : ''}
            />
          </div>
        ))}
      <div className="esthetician-buttons actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => {
            setFormData(esthetician);
            setIsEditing(false);
          }}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn-submit"
          onClick={async () => {
            if (!esthetician || !formData) return;
            const updated = await estheticianService.updateEsthetician(
              esthetician.cpf!,
              formData
            );
            setEsthetician(updated);
            setFormData(updated);
            setIsEditing(false);
          }}
        >
          Salvar
        </button>
      </div>
      </div>
    </StandardPage>
  ) : null;


  const logout = (
    <StandardPage title="">
      <div className="esthetician-header">
        <h3>Excluir clínica</h3>
        <button
          className="action-button"
          onClick={() => setShowRemoveModal(true)}
        >
          <img src="/IconLixo.png" alt="Excluir clínica" />
        </button>
      </div>

      {showRemoveModal && esthetician && (
        <RemoveModal
          isOpen={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          onConfirm={async () => {
            await handleRemoveClinic();
            setShowRemoveModal(false);
          }}
          title="Excluir clínica"
          message={`Tem certeza que deseja excluir a clínica de ${esthetician.name}? Esta ação não pode ser desfeita.`}
        />
      )}
    </StandardPage>
  );


    return (
      <SettingsStyles>
        <div className="settings-page">
            {clinicInfos}
        </div>
        <div className="settings-page">
            {isEditing ? editEsthetician : estheticianInfo}
        </div>
        <div className="settings-page">
            {logout}
        </div>
      </SettingsStyles>
    )

  }