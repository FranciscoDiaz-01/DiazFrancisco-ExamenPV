import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHorarios } from '../context/HorariosContext';
import { useTurnos } from '../context/TurnosContext';

export default function Medico() {
  const { user } = useAuth();
  const { getHorariosMedico, agregarHorario, eliminarHorario } = useHorarios();
  const { turnos } = useTurnos(); // Necesitamos ver las reservas para mostrar info

  const [nuevaHora, setNuevaHora] = useState('');

  const horarios = getHorariosMedico(user.id);

  // Filtrar los turnos que pertenecen a este médico para hoy
  const misTurnosReservados = turnos.filter(t => t.medicoId === user.id);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevaHora) return;
    
    const res = agregarHorario(user.id, nuevaHora);
    if (res.success) {
      setNuevaHora('');
    } else {
      alert(res.message);
    }
  };

  const handleEliminar = (hora) => {
    // Validar si ya tiene paciente
    const turnoOcupado = misTurnosReservados.find(t => t.hora === hora);
    if (turnoOcupado) {
      alert(`No puedes eliminar este horario, ya tienes un turno con ${turnoOcupado.pacienteNombre}.`);
      return;
    }
    
    if (confirm(`¿Eliminar el horario de las ${hora}?`)) {
      eliminarHorario(user.id, hora);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1>Panel de Gestión - Dr/a. {user.nombre}</h1>
      
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Crear Nuevo Horario</h3>
        <form onSubmit={handleAgregar} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="time" 
            value={nuevaHora} 
            onChange={(e) => setNuevaHora(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 15px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
            + Agregar Turno
          </button>
        </form>
      </div>

      <h3>Mis Horarios Disponibles (Hoy)</h3>
      {horarios.length === 0 ? (
        <p>No tienes horarios configurados.</p>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {horarios.map(hora => {
            const turno = misTurnosReservados.find(t => t.hora === hora);
            
            return (
              <div key={hora} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: turno ? '#e3f2fd' : 'white'
              }}>
                <div>
                  <strong style={{ fontSize: '1.2em' }}>{hora} hs</strong>
                  {turno ? (
                    <span style={{ color: '#d32f2f', marginLeft: '15px' }}>
                       📅 Reservado por: <strong>{turno.pacienteNombre}</strong> (DNI: {turno.pacienteDNI})
                    </span>
                  ) : (
                    <span style={{ color: 'green', marginLeft: '15px' }}>✓ Disponible</span>
                  )}
                </div>
                
                <button 
                  onClick={() => handleEliminar(hora)}
                  style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}