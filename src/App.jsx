import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TurnosProvider } from './context/TurnosContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPaciente from './pages/DashboardPaciente';
import DetalleTurno from './pages/DetalleTurno';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <TurnosProvider>
        <BrowserRouter>
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            
            <Route path="/paciente/turnos" element={
              <PrivateRoute>
                <DashboardPaciente />
              </PrivateRoute>
            } />
            
            <Route path="/turno/:id" element={
              <PrivateRoute>
                <DetalleTurno />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </TurnosProvider>
    </AuthProvider>
  );
}

export default App;