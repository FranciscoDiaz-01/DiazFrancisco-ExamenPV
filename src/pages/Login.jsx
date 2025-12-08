import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHorarios } from '../context/HorariosContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // <--- IMPORTANTE: Importamos los estilos aquí

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  
  const { login } = useAuth();
  const { inicializarMedicoNuevo } = useHorarios();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, pass);
    
    if (res.success) {
      const usuarioLogueado = res.user;

      if (usuarioLogueado.rol === 'medico') {
        // Inicializamos la agenda del medico si es nuevo
        inicializarMedicoNuevo(usuarioLogueado.id);
        navigate('/medico/agenda');
      } else {
        navigate('/paciente/turnos');
      }
    } else {
      alert(res.message);
    }
  };

  return (
    // Usamos las clases del CSS que creamos
    <div className="login-page">
      
      <div className="login-card">
        
        {/* Logo y Nombre (Opcional pero recomendado) */}
        <div className="brand-header">
           <span style={{ fontSize: '1.5rem' }}>🏥</span>
           <h3>Turnos Norte</h3>
        </div>

        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="login-input" 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={pass} 
            onChange={e => setPass(e.target.value)} 
            required 
            className="login-input" 
          />
          
          <button type="submit" className="login-btn">
            Ingresar
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta? <Link to="/registro" className="login-link">Regístrate</Link>
        </p>
      </div>

    </div>
  );
}