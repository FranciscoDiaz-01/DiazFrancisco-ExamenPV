import { useParams, useNavigate } from 'react-router-dom';
import { useTurnos } from '../context/TurnosContext.jsx';

export default function DetalleTurno() {
  const { id } = useParams();
  const { getTurnoById } = useTurnos();
  const navigate = useNavigate();
  
  const turno = getTurnoById(id);

  if (!turno) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', border: '1px solid #4CAF50', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Turno Confirmado</h2>
      <hr />
      <p><strong>Médico:</strong> {turno.medicoNombre}</p>
      <p><strong>Fecha:</strong> {turno.fecha}</p>
      <p><strong>Hora:</strong> {turno.hora}</p>
      <hr />
      <h3>Datos del Paciente</h3>
      <p><strong>Paciente:</strong> {turno.pacienteNombre}</p>
      <p><strong>DNI:</strong> {turno.pacienteDNI}</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => window.print()}>Imprimir Comprobante</button>
        <button onClick={() => navigate('/paciente/turnos')}>Volver al Inicio</button>
      </div>
    </div>
  );
}