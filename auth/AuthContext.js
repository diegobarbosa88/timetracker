import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde almacenamiento al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de inicio de sesión
  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // En una aplicación real, aquí se haría una llamada a la API
      // Simulación de autenticación
      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos');
      }
      
      // Determinar rol basado en el nombre de usuario (solo para demostración)
      const isAdmin = username.toLowerCase().includes('admin');
      const role = isAdmin ? 'admin' : 'employee';
      
      // Crear objeto de usuario
      const userData = {
        id: isAdmin ? 1 : 2,
        username,
        name: isAdmin ? 'Administrador' : 'Empleado',
        email: `${username}@magneticplace.com`,
        role,
        token: 'jwt-token-simulado-' + Math.random().toString(36).substring(2),
      };
      
      // Guardar en almacenamiento local
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función de cierre de sesión
  const logout = async () => {
    try {
      setLoading(true);
      
      // Eliminar datos de usuario del almacenamiento
      await AsyncStorage.removeItem('user');
      
      // Limpiar estado
      setUser(null);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Valores proporcionados por el contexto
  const authContextValue = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    isAdmin: () => hasRole('admin'),
    isEmployee: () => hasRole('employee'),
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
