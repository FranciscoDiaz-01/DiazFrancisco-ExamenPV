
export const MEDICOS_INICIALES = [
  { id: 1, nombre: "Dr. Carlos Mamani", email: "carlos@hospital.com", pass: "1234", especialidad: "Cardiología", rol: "medico" },
  { id: 2, nombre: "Dra. Elena Choque", email: "elena@hospital.com", pass: "1234", especialidad: "Pediatría", rol: "medico" },
  { id: 3, nombre: "Dr. Jorge Tolaba", email: "jorge@hospital.com", pass: "1234", especialidad: "Traumatología", rol: "medico" },
  { id: 4, nombre: "Dra. Ana Quispe", email: "ana@hospital.com", pass: "1234", especialidad: "Dermatología", rol: "medico" },
];


export const getHorariosDisponibles = () => {
  const horarios = [];
  let hora = 8;
  let minutos = 0;

  
  while (hora < 12) {
    const timeString = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    horarios.push(timeString);
    minutos += 30;
    if (minutos === 60) {
      minutos = 0;
      hora++;
    }
  }
  return horarios;
};