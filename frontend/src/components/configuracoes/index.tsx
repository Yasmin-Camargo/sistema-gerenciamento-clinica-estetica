import React, { useState, useEffect } from 'react';
import { StandardPage } from '../listPadrao';  
import { dashboardService } from '../../services/dashboardService';
import { clientService } from '../../services/clientService';
import { productService } from '../../services/productService';
import { procedureService } from '../../services/procedureService';
import { estheticianService } from '../../services/esthetianService';
import { ClientDTO, ProductDTO, ProcedimentoDTO } from '../../types';
import { SettingsStyles } from './styles';
import { EstheticianFormData } from '../esteticista/new';

export const SettingsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [procedures, setProcedures] = useState<ProcedimentoDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [esthetician, setEsthetician] = useState<EstheticianFormData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, clientsRes, procsRes, prodsRes, esthetiansRes] = await Promise.all([
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
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
      <h3>Informações do Esteticista</h3>
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

    
    const logout = (
        <StandardPage title="">
            <button onClick={() => window.location.href = '/logout'}>Sair</button>
        </StandardPage>
    );


    return (
      <SettingsStyles>
        <div className="settings-page">
            {clinicInfos}
        </div>
        <div className="settings-page">
            {estheticianInfo}
        </div>
        <div className="settings-page">
            {logout}
        </div>
      </SettingsStyles>
    )

  }