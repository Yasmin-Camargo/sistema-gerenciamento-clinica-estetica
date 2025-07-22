import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EstheticianForm } from './components/esteticista/new';
import { StandardPage } from './components/listPadrao';
import { ConsultasPage } from './components/consultas/list';
import { NewConsultasPage } from './components/consultas/new';
import { HomePage } from './components/home';
import { LoginPage } from './components/esteticista/login';
import { Logout } from './components/esteticista/logout';
import { PrivateRoute } from './Auth/PrivateRoute';
import { NewProcedurePage } from './components/procedimentos/new';
import { ProcedurePage } from './components/procedimentos/list';
import { EditProcedurePage } from './components/procedimentos/edit';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/estheticians" element={<EstheticianForm />} />
      <Route path="/procedure" element={
        <PrivateRoute>
          <ProcedurePage />
        </PrivateRoute>
      } />
      <Route path="/procedure/edit" element={
        <PrivateRoute>
          <EditProcedurePage />
        </PrivateRoute>
      } />
      <Route path="/procedure/new" element={
        <PrivateRoute>
          <NewProcedurePage />
        </PrivateRoute>
      } />
      <Route path="/standard" element={
        <PrivateRoute>
          <StandardPage title="Título"/>
        </PrivateRoute>
      } />
      <Route path="/consultas" element={
        <PrivateRoute>
          <ConsultasPage />
        </PrivateRoute>
      } />
      <Route path="/consultas/new" element={
        <PrivateRoute>
          <NewConsultasPage />
        </PrivateRoute>
      } />
      <Route path="/home" element={
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      } />
    </Routes>
    </BrowserRouter>
  )
}

export default App