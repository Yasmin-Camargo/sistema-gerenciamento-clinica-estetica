import React, { useState, useEffect } from 'react';
import { StandardPage } from '../listPadrao';  
import { dashboardService, HomePageDTO } from '../../services/dashboardService';
import { SettingsStyles } from './styles';

export const SettingsPage: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<HomePageDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [estheticianData, setEstheticianData] = useState<string>('');

    useEffect(() => {
        loadSettingsData();
    }, []);

    const loadSettingsData = async () => {
        setLoading(true);
        try {
            const data = await dashboardService.getHomePageData();
            setDashboardData(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEstheticianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEstheticianData(e.target.value);
    };

    const clinicInfo = (
        <StandardPage title="Clínica">
                <h3>Informações da Clínica</h3>
               
        </StandardPage>
    )

    const estheticianInfo = (
        <StandardPage title="Esteticista">
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
        <StandardPage title="Sair">
            <button onClick={() => window.location.href = '/logout'}>Sair</button>
        </StandardPage>
    );


    return (
      <SettingsStyles>
        <div className="settings-page">
            {clinicInfo}
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