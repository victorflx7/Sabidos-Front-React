// context/AuthContexts.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { validateLogin, syncUserToBackend } from "../services/Api";

// -------------------------------------------------------------
// 1. Definição do Contexto
// -------------------------------------------------------------
const AuthContext = createContext({
  currentUser: null,
  backendUser: null, // Dados do SQL
  loading: true,
  loginError: null,
  logout: () => {},
  revalidate: () => {},
});

export const useAuth = () => useContext(AuthContext);

// -------------------------------------------------------------
// 2. Provedor de Autenticação
// -------------------------------------------------------------
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null); // Usuário no SQL
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  // --------------------------------------------------
  // Funções Auxiliares (Para evitar repetição de código)
  // --------------------------------------------------

  /**
   * Limpa o estado local e força o logout do Firebase.
   * @param {string} message - Mensagem de erro.
   */
  const handleAuthFailure = async (message) => {
    setLoginError(message);
    setBackendUser(null);
    localStorage.removeItem("userAuthenticated");
    localStorage.removeItem("userData");
    // Desloga do Firebase (que acionará o onAuthStateChanged(null) limpando o estado final)
    await signOut(auth); 
  };
    
  /**
   * Tenta sincronizar (cadastrar) o usuário no backend e trata a falha.
   * @param {object} user - Objeto user do Firebase.
   */
  const syncUserAndHandleFailure = async (user) => {
    try {
      // Tenta cadastrar o usuário no backend (endpoint /sync)
      const syncResult = await syncUserToBackend(user); 
      
      // Se a sincronização for bem-sucedida
      if (syncResult && syncResult.user) {
        setBackendUser(syncResult.user);
        localStorage.setItem("userAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(syncResult.user));
        console.log("✅ Usuário sincronizado e autenticado com sucesso!");
      } else {
         throw new Error("Sincronização falhou sem retornar dados do usuário.");
      }

    } catch (syncError) {
      // Falha na sincronização: Desloga e exibe o erro
      console.error("❌ Falha crítica na sincronização/cadastro:", syncError);
      handleAuthFailure(syncError.message);
    }
  }

  // --------------------------------------------------
  // 🔐 Função principal de validação/sincronização
  // --------------------------------------------------

  /**
   * Valida o usuário no backend e, se não existir, tenta sincronizá-lo.
   * @param {object} user - Objeto user do Firebase.
   */
  const validateUserInBackend = async (user) => {
    try {
      setLoginError(null);
      
      // 1. Tenta validar se o usuário JÁ existe
      const result = await validateLogin(user.uid, user.email);
      
      if (result.success) {
        // ✅ Usuário encontrado e validado
        setBackendUser(result.user);
        localStorage.setItem("userAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(result.user));
        console.log("✅ Usuário validado no backend com sucesso");
      } else {
        // ⚠️ Usuário não encontrado no SQL, TENTA SINCRONIZAR
        console.log("Usuário não encontrado no SQL. Tentando sincronizar...");
        await syncUserAndHandleFailure(user); 
      }

    } catch (error) {
      // ❌ Erro de Rede ou da API durante a validação
      console.error("❌ Erro de rede ou validação no backend:", error);
      handleAuthFailure(error.message); // Desloga se houver erro de rede/servidor
    }
  };


  // --------------------------------------------------
  // Efeito principal: Escutando o estado do Firebase
  // --------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoginError(null);

      if (user) {
        // Usuário autenticado no Firebase - iniciar fluxo de validação/sincronização
        await validateUserInBackend(user);
      } else {
        // Logout - limpar tudo
        setBackendUser(null);
        setLoginError(null);
        localStorage.removeItem("userAuthenticated");
        localStorage.removeItem("userData");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --------------------------------------------------
  // Valor do Contexto
  // --------------------------------------------------
  const value = {
    currentUser,
    backendUser, // Dados do SQL
    loading,
    loginError,
    logout: async () => {
      try {
        await signOut(auth);
        console.log("Logout bem-sucedido.");
      } catch (error) {
        console.error("Erro durante o logout:", error);
      }
    },
    // 🔁 Função para forçar revalidação
    revalidate: async () => {
      if (currentUser) {
        await validateUserInBackend(currentUser);
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};