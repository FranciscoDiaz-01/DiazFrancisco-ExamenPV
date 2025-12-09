import { createContext, useState, useContext, useEffect } from 'react';
import { MEDICOS_INICIALES } from '../data/dataInicial';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) setUser(storedUser);

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
      // Devolvemos el usuario encontrado 
      return { success: true, user: foundUser };
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
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedData) => {
    const usersDb = JSON.parse(localStorage.getItem('users_db')) || [];
    const userIndex = usersDb.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Validar que el email no esté en uso por otro usuario
    const emailInUse = usersDb.some(u => u.email === updatedData.email && u.id !== user.id);
    if (emailInUse) {
      return { success: false, message: 'El correo ya está en uso' };
    }

    const updatedUser = { ...usersDb[userIndex], ...updatedData };
    usersDb[userIndex] = updatedUser;
    
    localStorage.setItem('users_db', JSON.stringify(usersDb));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    return { success: true, user: updatedUser };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};