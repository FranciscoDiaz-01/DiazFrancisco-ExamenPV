import { createContext, useContext, useState, useEffect } from 'react';
import { MEDICOS_INICIALES, getHorariosDisponibles } from '../data/dataInicial';

const HorariosContext = createContext();

export const useHorarios = () => useContext(HorariosContext);

export const HorariosProvider = ({ children }) => {
  
  const [horariosDb, setHorariosDb] = useState({});

  useEffect(() => {
    const storedHorarios = JSON.parse(localStorage.getItem('horarios_db'));
    
    if (storedHorarios) {
      setHorariosDb(storedHorarios);
    } else {
      // Inicialización medicos iniciales y sus horarios
      const horariosBase = getHorariosDisponibles();
      const iniciales = {};
      MEDICOS_INICIALES.forEach(med => {
        iniciales[med.id] = [...horariosBase];
      });
      setHorariosDb(iniciales);
      localStorage.setItem('horarios_db', JSON.stringify(iniciales));
    }
  }, []);

  
  const guardar = (nuevoEstado) => {
    setHorariosDb(nuevoEstado);
    localStorage.setItem('horarios_db', JSON.stringify(nuevoEstado));
  };

  
  const getHorariosMedico = (medicoId) => {
    return horariosDb[medicoId] || [];
  };

  // crear horario
  const agregarHorario = (medicoId, hora) => {
    const actuales = horariosDb[medicoId] || [];
    if (actuales.includes(hora)) return { success: false, message: 'La hora ya existe' };
    
    
    const nuevos = [...actuales, hora].sort();
  
    const nuevoEstado = { ...horariosDb, [medicoId]: nuevos };
    guardar(nuevoEstado);
    return { success: true };
  };


  const eliminarHorario = (medicoId, hora) => {
    const actuales = horariosDb[medicoId] || [];
    const nuevos = actuales.filter(h => h !== hora);
    
    const nuevoEstado = { ...horariosDb, [medicoId]: nuevos };
    guardar(nuevoEstado);
    return { success: true };
  };

  
  const inicializarMedicoNuevo = (medicoId) => {
    if (!horariosDb[medicoId]) {
      const nuevoEstado = { ...horariosDb, [medicoId]: [] }; // Empieza vacío o con base
      guardar(nuevoEstado);
    }
  };

  return (
    <HorariosContext.Provider value={{ horariosDb, getHorariosMedico, agregarHorario, eliminarHorario, inicializarMedicoNuevo }}>
      {children}
    </HorariosContext.Provider>
  );
};