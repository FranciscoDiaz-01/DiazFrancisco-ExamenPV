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
    // Mostramos la fecha de mañana en la confirmación
    if (!confirm(`¿Confirmar turno con ${medicoSeleccionado.nombre} para MAÑANA (${fechaTurno}) a las ${hora}?`)) return;

    const turnoData = {
      fecha: fechaTurno, // GUARDAMOS LA FECHA DE MAÑANA
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
    <div style={{ padding: '20px' }}>
      <h1>Panel del Paciente: {user.nombre}</h1>
      
      {!medicoSeleccionado ? (
        <>
          {/* Actualizamos el texto informativo */}
          <h3>Seleccione un Médico para ver sus horarios de MAÑANA ({fechaTurno}):</h3>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {medicos.map(med => (
              <div key={med.id} onClick={() => setMedicoSeleccionado(med)} 
                   style={{ border: '1px solid #ccc', padding: '15px', cursor: 'pointer', borderRadius: '5px' }}>
                <h4>{med.nombre}</h4>
                <p>{med.especialidad}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => setMedicoSeleccionado(null)} style={{marginBottom:'10px'}}>← Volver</button>
          
          
          <h2>Turnos disponibles para MAÑANA ({fechaTurno}) con {medicoSeleccionado.nombre}</h2>
          
          {horarios.length === 0 ? (
            <p>Este médico no tiene horarios disponibles.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {horarios.map(hora => {
                const ocupado = turnosOcupados.includes(hora);
                return (
                  <button
                    key={hora}
                    disabled={ocupado}
                    onClick={() => handleReservar(hora)}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: ocupado ? '#ffcccc' : '#ccffcc',
                      cursor: ocupado ? 'not-allowed' : 'pointer',
                      border: '1px solid #999',
                      borderRadius: '4px'
                    }}
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