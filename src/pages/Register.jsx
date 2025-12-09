import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [rol, setRol] = useState('paciente');
  
  const [genero, setGenero] = useState('masculino'); 
  
  const [formData, setFormData] = useState({
    nombre: '', email: '', pass: '', dni: '', telefono: '', especialidad: '', obraSocial: '', numeroAsociado: ''
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // prefijos
    let nombreFinal = formData.nombre;
    
    
    if (rol === 'medico') {
      const prefijo = genero === 'masculino' ? 'Dr.' : 'Dra.';
      
      const nombreCapitalizado = formData.nombre.charAt(0).toUpperCase() + formData.nombre.slice(1);
      nombreFinal = `${prefijo} ${nombreCapitalizado}`;
    }

    const datosUsuario = {
      rol,
      nombre: nombreFinal, // Enviamos el nombre ya con el prefijo
      email: formData.email,
      pass: formData.pass,
      genero: rol === 'medico' ? genero : null, 
      
      // Campos específicos según rol
      ...(rol === 'paciente' 
        ? { dni: formData.dni, telefono: formData.telefono, obraSocial: formData.obraSocial, numeroAsociado: formData.numeroAsociado } 
        : { dni: formData.dni, especialidad: formData.especialidad })
    };

    const res = register(datosUsuario);
    
    if (res.success) {
      alert("Registro exitoso");
      // Si es médico, lo manda a inicializar su agenda 
      
      navigate(rol === 'paciente' ? '/paciente/turnos' : '/medico/agenda');
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Registro de Usuario</h2>
      
      {/* Selector de ROL */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setRol('paciente')} 
          disabled={rol === 'paciente'}
          style={{ flex: 1, padding: '8px', cursor: rol === 'paciente' ? 'default' : 'pointer' }}
        >
          Soy Paciente
        </button>
        <button 
          onClick={() => setRol('medico')} 
          disabled={rol === 'medico'}
          style={{ flex: 1, padding: '8px', cursor: rol === 'medico' ? 'default' : 'pointer' }}
        >
          Soy Médico
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Selector de Género (Solo visible para médicos) */}
        {rol === 'medico' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>Género (para título):</label>
            <select 
              value={genero} 
              onChange={(e) => setGenero(e.target.value)}
              style={{ padding: '8px' }}
            >
              <option value="masculino">Masculino (Dr.)</option>
              <option value="femenino">Femenino (Dra.)</option>
            </select>
          </div>
        )}

        <input 
          name="nombre" 
          placeholder={rol === 'medico' ? "Nombre (ej: Juan Pérez)" : "Nombre Completo"} 
          required 
          onChange={handleChange} 
        />
        
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
        <input name="pass" type="password" placeholder="Contraseña" required onChange={handleChange} />

        {rol === 'paciente' && (
          <>
            <input name="dni" placeholder="DNI" required onChange={handleChange} />
            <input name="telefono" placeholder="Teléfono" required onChange={handleChange} />
            <select name="obraSocial" required onChange={handleChange} style={{ padding: '8px' }}>
              <option value="">Seleccionar Obra Social</option>
              <option value="OSDE">OSDE</option>
              <option value="OSPE">OSPE</option>
              <option value="OSDOP">OSDOP</option>
              <option value="PAMI">PAMI</option>
              <option value="ISJ">ISJ</option>
              <option value="Mutual AyE">Mutual AyE</option>
            </select>
            <input name="numeroAsociado" placeholder="Número de Asociado" required onChange={handleChange} />
          </>
        )}

        {rol === 'medico' && (
          <>
            <input name="dni" placeholder="DNI" required onChange={handleChange} />
            <input name="especialidad" placeholder="Especialidad (ej: Cardiología)" required onChange={handleChange} />
          </>
        )}

        <button type="submit" style={{ marginTop: '10px', padding: '10px', fontWeight: 'bold' }}>
          Registrarse
        </button>
      </form>
      
      <p style={{ marginTop: '15px' }}>
        ¿Ya tienes cuenta? <Link to="/login">Ingresa aquí</Link>
      </p>
    </div>
  );
}