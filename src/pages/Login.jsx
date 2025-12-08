import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHorarios } from '../context/HorariosContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  
  const { login } = useAuth();
  // Extraemos la función para inicializar horarios (por si es un médico nuevo)
  const { inicializarMedicoNuevo } = useHorarios();
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, pass);
    
    if (res.success) {
      const usuarioLogueado = res.user;

      
      if (usuarioLogueado.rol === 'medico') {
        // inicializamos la agenda del medico si es nuevo
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
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={pass} 
          onChange={e => setPass(e.target.value)} 
          required 
        />
        <button type="submit">Ingresar</button>
      </form>
      <p>No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </div>
  );
}