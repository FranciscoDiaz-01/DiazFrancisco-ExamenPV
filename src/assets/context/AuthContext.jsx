import { createContext, useState, useContext, useEffect } from 'react';
import { MEDICOS_INICIALES } from 'src/data/dataInicial';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar sesión activa
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) setUser(storedUser);

    // Inicializa la base de datos de usuarios si no existe
    if (!localStorage.getItem('users_db')) {
      localStorage.setItem('users_db', JSON.stringify([...MEDICOS_INICIALES]));
    }
  }, []);

  const login = (email, password) => {
    const usersDb = JSON.parse(localStorage.getItem('users_db')) || [];
    const foundUser = usersDb.find(u => u.email === email && u.pass === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  const register = (userData) => {
    const usersDb = JSON.parse(localStorage.getItem('users_db')) || [];
    
    if (usersDb.some(u => u.email === userData.email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }

    const newUser = { ...userData, id: Date.now() };
    usersDb.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(usersDb));
    
    // login automatico
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};