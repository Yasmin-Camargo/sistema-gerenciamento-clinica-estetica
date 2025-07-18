import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EstheticianForm } from './components/esteticista/new';
import { StandardPage } from './components/listPadrao';
import { ConsultasPage } from './components/consultas/list';
import { NewConsultasPage } from './components/consultas/new';
import { HomePage } from './components/home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/estheticians" element={<EstheticianForm />} />
      <Route path="/standard" element={<StandardPage title="Título"/>} />
      <Route path="/consultas" element={<ConsultasPage />} />
      <Route path="/consultas/new" element={<NewConsultasPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App