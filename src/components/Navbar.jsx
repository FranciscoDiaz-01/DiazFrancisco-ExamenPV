import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🏥</span>
        <strong style={{ fontSize: '1.2rem' }}>Turnos Norte</strong>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <span style={{ opacity: 0.9 }}>{user.nombre}</span>
            <Link to="/perfil" className="nav-link" title="Ver perfil">
              👤
            </Link>
            <button onClick={handleLogout} className="nav-btn-logout">Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}