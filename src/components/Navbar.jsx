import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <strong>Sistema Turnos Norte</strong>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Hola, {user.nombre}</span>
            <button onClick={handleLogout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}