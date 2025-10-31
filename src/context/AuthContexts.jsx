// context/AuthContexts.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { validateLogin, syncUserToBackend } from "../services/Api";

const AuthContext = createContext({
  currentUser: null,
  backendUser: null, // Dados do SQL
  loading: true,
  loginError: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null); // Usuário no SQL
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  // 🔐 Função para validar usuário no backend
  const validateUserInBackend = async (user) => {
    try {
      setLoginError(null);
      const result = await validateLogin(user.uid, user.email);
      
      if (result.success) {
        setBackendUser(result.user);
        localStorage.setItem("userAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(result.user));
        console.log("✅ Usuário validado no backend com sucesso");
      } else {
        throw new Error(result.message || "Falha na validação");
      }
    } catch (error) {
      console.error("❌ Erro na validação do backend:", error);
      setLoginError(error.message);
      setBackendUser(null);
      localStorage.removeItem("userAuthenticated");
      localStorage.removeItem("userData");
      
      // Desloga do Firebase se não for válido no backend
      await signOut(auth);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoginError(null);

      if (user) {
        // Usuário autenticado no Firebase - validar no backend
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