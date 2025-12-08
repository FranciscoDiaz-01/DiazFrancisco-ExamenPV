import { createContext, useContext, useState, useEffect } from 'react';

const TurnosContext = createContext();

export const useTurnos = () => useContext(TurnosContext);

export const TurnosProvider = ({ children }) => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const storedTurnos = JSON.parse(localStorage.getItem('turnos_db')) || [];
    setTurnos(storedTurnos);
  }, []);

  const reservarTurno = (nuevoTurno) => {

    const ocupado = turnos.some(
      t => t.medicoId === nuevoTurno.medicoId && t.hora === nuevoTurno.hora
    );

    if (ocupado) return { success: false, message: 'Este turno ya ha sido reservado.' };

    const listaActualizada = [...turnos, { ...nuevoTurno, id: Date.now() }];
    setTurnos(listaActualizada);
    localStorage.setItem('turnos_db', JSON.stringify(listaActualizada));
    return { success: true, id: listaActualizada[listaActualizada.length - 1].id };
  };

  const getTurnoById = (id) => turnos.find(t => t.id === Number(id));

  const getTurnosOcupados = (medicoId) => {
    return turnos.filter(t => t.medicoId === medicoId).map(t => t.hora);
  };

  return (
    <TurnosContext.Provider value={{ turnos, reservarTurno, getTurnoById, getTurnosOcupados }}>
      {children}
    </TurnosContext.Provider>
  );
};