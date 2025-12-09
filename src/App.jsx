import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TurnosProvider } from './context/TurnosContext';
import { HorariosProvider } from './context/HorariosContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPaciente from './pages/Paciente';
import DashboardMedico from './pages/Medico'; 
import DetalleTurno from './pages/DetalleTurno';
import Profile from './pages/Profile';
import './index.css';
function App() {
  return (
    <AuthProvider>
      <TurnosProvider>
       
        <HorariosProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              
              {/* Ruta Protegida para Perfil */}
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Ruta Protegida para Pacientes */}
              <Route path="/paciente/turnos" element={
                <ProtectedRoute>
                  <DashboardPaciente />
                </ProtectedRoute>
              } />

              {/* Ruta Protegida para Médicos */}
              <Route path="/medico/agenda" element={
                <ProtectedRoute>
                  <DashboardMedico />
                </ProtectedRoute>
              } />
              
              <Route path="/turno/:id" element={
                <ProtectedRoute>
                  <DetalleTurno />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </HorariosProvider>
      </TurnosProvider>
    </AuthProvider>
  );
}

export default App;