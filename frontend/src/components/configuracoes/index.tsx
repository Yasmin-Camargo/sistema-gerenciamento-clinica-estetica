import React, { useState, useEffect } from 'react';
import { StandardPage } from '../listPadrao';  
import { dashboardService } from '../../services/dashboardService';
import { clientService } from '../../services/clientService';
import { productService } from '../../services/productService';
import { procedureService } from '../../services/procedureService';
import { ClientDTO, ProductDTO, ProcedimentoDTO } from '../../types';
import { SettingsStyles } from './styles';

export const SettingsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [procedures, setProcedures] = useState<ProcedimentoDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]); // tipar se tiver DTO

  const [loading, setLoading] = useState(true);
  const [estheticianData, setEstheticianData] = useState<string>('');

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, clientsRes, procsRes, prodsRes] = await Promise.all([
        dashboardService.getHomePageData(),
        clientService.getAllClients(),
        procedureService.getAllProcedimentos(),
        productService.getAllProducts(),
      ]);

      setClients(clientsRes);
      setProcedures(procsRes);
      setProducts(prodsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstheticianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstheticianData(e.target.value);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }


    const clinicInfos = (
     <StandardPage title="">
          <h3>Informações da Clínica</h3>
        <div className="caixas">
            <p>Clientes: {clients.length}</p>
            <p>Procedimentos: {procedures.length}</p>
            <p>Consultas: {appointments.length}</p>
            <p>Produtos: {products.length}</p>
        </div>
        </StandardPage>
    )

    const estheticianInfo = (
        <StandardPage title="">
            <h3>Informações do Esteticista</h3>
            <input
                type="text"
                value={estheticianData}
                onChange={handleEstheticianChange}
                placeholder="Digite o CPF do esteticista"
            />
        </StandardPage>
    );
    
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