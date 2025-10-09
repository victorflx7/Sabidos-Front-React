cat > src/services/authService.js
import api from './Api';

class AuthService {
  async login(email, password) {
    try {
      console.log('📨 Enviando dados para o backend...');
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('Resposta do Backend:', response.data);

        if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        
        console.log('🔐 Token salvo com sucesso!');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  }

  logout() {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    console.log('👋 Logout realizado!');
  }

  isAuthenticated() {
    const token = localStorage.getItem('userToken');
    const hasToken = !!token;
    console.log('🔍 Verificando autenticação:', hasToken);
    return hasToken;
  }

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }

  async register(userData) {
    try {
      console.log('📝 Registrando novo usuário...');
      const response = await api.post('/auth/register', userData);
      console.log('✅ Usuário registrado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
      throw new Error(errorMessage);
    }
  }
}

export default new AuthService();