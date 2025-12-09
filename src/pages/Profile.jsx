import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    especialidad: '',
    obraSocial: '',
    numeroAsociado: '',
    pass: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        dni: user.dni || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || '',
        especialidad: user.especialidad || '',
        obraSocial: user.obraSocial || '',
        numeroAsociado: user.numeroAsociado || '',
        pass: user.pass || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setMessage('El nombre es requerido');
      setMessageType('error');
      return;
    }
    if (!formData.email.trim()) {
      setMessage('El email es requerido');
      setMessageType('error');
      return;
    }
    if (!formData.pass.trim()) {
      setMessage('La contraseña es requerida');
      setMessageType('error');
      return;
    }

    const result = updateUser({
      nombre: formData.nombre,
      email: formData.email,
      dni: formData.dni,
      telefono: formData.telefono,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      especialidad: formData.especialidad,
      obraSocial: formData.obraSocial,
      numeroAsociado: formData.numeroAsociado,
      pass: formData.pass,
    });

    if (result.success) {
      setMessage('Datos actualizados exitosamente');
      setMessageType('success');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    // Recargar datos del usuario
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        dni: user.dni || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || '',
        especialidad: user.especialidad || '',
        obraSocial: user.obraSocial || '',
        numeroAsociado: user.numeroAsociado || '',
        pass: user.pass || '',
      });
    }
  };

  const handleVolver = () => {
    if (user.rol === 'paciente') {
      navigate('/paciente/turnos');
    } else if (user.rol === 'medico') {
      navigate('/medico/agenda');
    }
  };

  if (!user) {
    return <div className="container"><p>Cargando...</p></div>;
  }

  return (
    <div className="container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.rol === 'medico' ? '👨‍⚕️' : '👤'}
        </div>
        <div className="profile-info">
          <h1>{formData.nombre}</h1>
          <p className="profile-role">
            {user.rol === 'medico' ? '👨‍⚕️ Profesional de la Salud' : '👤 Paciente'}
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert ${messageType}`}>
          {messageType === 'success' ? '✓ ' : '✕ '}{message}
        </div>
      )}

      <div className="card profile-card">
        <div className="profile-header-card">
          <h2>Mi Perfil</h2>
          <div className="profile-buttons">
            <button 
              className={isEditing ? 'btn-secondary' : 'btn-primary'}
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            >
              {isEditing ? 'Cancelar' : '✏️ Editar Perfil'}
            </button>
            <button 
              className="btn-secondary"
              onClick={handleVolver}
            >
              ← Volver
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>DNI</label>
                <input 
                  type="text" 
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dirección</label>
                <input 
                  type="text" 
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input 
                  type="text" 
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>
            </div>

            {user.rol === 'medico' && (
              <div className="form-group">
                <label>Especialidad</label>
                <input 
                  type="text" 
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                />
              </div>
            )}

            {user.rol === 'paciente' && (
              <>
                <div className="form-group">
                  <label>Obra Social</label>
                  <select 
                    name="obraSocial"
                    value={formData.obraSocial}
                    onChange={handleChange}
                    style={{ padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  >
                    <option value="">Seleccionar Obra Social</option>
                    <option value="OSDE">OSDE</option>
                    <option value="OSPE">OSPE</option>
                    <option value="OSDOP">OSDOP</option>
                    <option value="PAMI">PAMI</option>
                    <option value="ISJ">ISJ</option>
                    <option value="Mutual AyE">Mutual AyE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número de Asociado</label>
                  <input 
                    type="text" 
                    name="numeroAsociado"
                    value={formData.numeroAsociado}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Contraseña *</label>
              <input 
                type="password" 
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                💾 Guardar Cambios
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-section">
              <h3>Información Personal</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <span className="label">Nombre Completo</span>
                  <span className="value">{formData.nombre}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Email</span>
                  <span className="value">{formData.email}</span>
                </div>
                <div className="profile-item">
                  <span className="label">DNI</span>
                  <span className="value">{formData.dni || 'No especificado'}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Teléfono</span>
                  <span className="value">{formData.telefono || 'No especificado'}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Dirección</span>
                  <span className="value">{formData.direccion || 'No especificado'}</span>
                </div>
                <div className="profile-item">
                  <span className="label">Ciudad</span>
                  <span className="value">{formData.ciudad || 'No especificado'}</span>
                </div>
              </div>
            </div>

            {user.rol === 'medico' && (
              <div className="profile-section">
                <h3>Información Profesional</h3>
                <div className="profile-grid">
                  <div className="profile-item">
                    <span className="label">Especialidad</span>
                    <span className="value">{formData.especialidad || 'No especificado'}</span>
                  </div>
                </div>
              </div>
            )}

            {user.rol === 'paciente' && (
              <div className="profile-section">
                <h3>Información de Obra Social</h3>
                <div className="profile-grid">
                  <div className="profile-item">
                    <span className="label">Obra Social</span>
                    <span className="value">{formData.obraSocial || 'No especificado'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Número de Asociado</span>
                    <span className="value">{formData.numeroAsociado || 'No especificado'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
