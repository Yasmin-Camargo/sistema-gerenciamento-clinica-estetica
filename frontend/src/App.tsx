import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EstheticianForm } from './components/esteticista/new';
import { StandardPage } from './components/listPadrao';
import { ConsultasPage } from './components/consultas/list';
import { NewConsultasPage } from './components/consultas/new';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/estheticians" element={<EstheticianForm />} />
      <Route path="/standard" element={<StandardPage title="Título" buttonLabel="Ação" onButtonClick={() => {}} />} />
      <Route path="/consultas" element={<ConsultasPage />} />
      <Route path="/consultas/new" element={<NewConsultasPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App