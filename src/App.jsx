import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TurnosProvider } from './context/TurnosContext';
// IMPORTANTE: Importamos el nuevo Provider
import { HorariosProvider } from './context/HorariosContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPaciente from './pages/Paciente';
// Asegúrate de importar el DashboardMedico (debes haber creado el archivo previamente)
import DashboardMedico from './pages/Medico'; 
import DetalleTurno from './pages/DetalleTurno';

function App() {
  return (
    <AuthProvider>
      <TurnosProvider>
        {/* IMPORTANTE: Envolvemos la app con el proveedor de horarios */}
        <HorariosProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              
              {/* Ruta Protegida para Pacientes */}
              <Route path="/paciente/turnos" element={
                <ProtectedRoute>
                  <DashboardPaciente />
                </ProtectedRoute>
              } />

              {/* NUEVA RUTA: Ruta Protegida para Médicos */}
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