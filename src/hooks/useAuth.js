import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Iniciando - verificando autenticação...');
    
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      console.log('✅ Usuário já autenticado encontrado');
      setUser(JSON.parse(userData));
    } else {
      console.log('❌ Nenhum usuário autenticado encontrado');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Iniciando processo de login...');
    try {
      const data = await AuthService.login(email, password);
      setUser(data.user);
      console.log('🎉 Login realizado com sucesso!');
      return { success: true, data };
    } catch (error) {
      console.error('💥 Erro no login:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const data = await AuthService.register(userData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}