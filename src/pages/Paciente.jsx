import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTurnos } from '../context/TurnosContext';
import { useHorarios } from '../context/HorariosContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPaciente() {
  const { user } = useAuth();
  const { reservarTurno, getTurnosOcupados } = useTurnos();
  const { getHorariosMedico } = useHorarios();
  const navigate = useNavigate();
  
  const [medicos, setMedicos] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  
  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('users_db')) || [];
    setMedicos(db.filter(u => u.rol === 'medico'));
  }, []);

  const getFechaManana = () => {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    return manana.toLocaleDateString();
  };

  const fechaTurno = getFechaManana();
  const horarios = medicoSeleccionado ? getHorariosMedico(medicoSeleccionado.id) : [];

  const handleReservar = (hora) => {
    if (!confirm(`¿Confirmar turno con ${medicoSeleccionado.nombre} para MAÑANA (${fechaTurno}) a las ${hora}?`)) return;

    const turnoData = {
      fecha: fechaTurno,
      hora,
      medicoId: medicoSeleccionado.id,
      medicoNombre: medicoSeleccionado.nombre,
      pacienteId: user.id,
      pacienteNombre: user.nombre,
      pacienteDNI: user.dni,
      pacienteEmail: user.email
    };

    const resultado = reservarTurno(turnoData);
    if (resultado.success) {
      navigate(`/turno/${resultado.id}`);
    } else {
      alert(resultado.message);
    }
  };

  const turnosOcupados = medicoSeleccionado ? getTurnosOcupados(medicoSeleccionado.id) : [];

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Hola, {user.nombre} 👋</h1>
        <p className="subtitle">Gestiona tus turnos de salud de manera fácil.</p>
      </header>
      
      {!medicoSeleccionado ? (
        <div className="card">
          <h3>📅 Seleccione un Profesional</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Turnos disponibles para MAÑANA ({fechaTurno})</p>
          
          <div className="medicos-grid">
            {medicos.map(med => (
              <div key={med.id} onClick={() => setMedicoSeleccionado(med)} className="medico-card">
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🩺</div>
                <h4>{med.nombre}</h4>
                <p>{med.especialidad}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <button className="btn-secondary" onClick={() => setMedicoSeleccionado(null)} style={{marginBottom:'20px'}}>
            ← Volver a la lista
          </button>
          
          <h2>Agenda de {medicoSeleccionado.nombre}</h2>
          <p style={{ marginBottom: '1rem' }}>Especialidad: <strong>{medicoSeleccionado.especialidad}</strong> | Fecha: <strong>{fechaTurno}</strong></p>
          
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }}/>

          {horarios.length === 0 ? (
            <p className="alert-box">Este médico no tiene horarios configurados para mañana.</p>
          ) : (
            <div className="horarios-grid">
              {horarios.map(hora => {
                const ocupado = turnosOcupados.includes(hora);
                return (
                  <button
                    key={hora}
                    disabled={ocupado}
                    onClick={() => handleReservar(hora)}
                    className={`btn-hora ${ocupado ? 'ocupado' : 'libre'}`}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}