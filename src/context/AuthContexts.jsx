// context/AuthContexts.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { validateLogin, syncUserToBackend } from "../services/Api";

// ✅ CONTEXT COM VALOR PADRÃO MELHORADO
const AuthContext = createContext({
  currentUser: null,
  backendUser: null,
  loading: true,
  loginError: null,
  logout: () => {},
  revalidate: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  console.log("🔄 AuthContext - Estado atual:", {
    currentUser: currentUser?.uid,
    backendUser: !!backendUser,
    loading,
    loginError
  });

  // 🔐 Função para validar usuário no backend
  const validateUserInBackend = async (user) => {
    console.log("🎯 validateUserInBackend INICIADO para:", user.uid);
    
    try {
      setLoginError(null);
      console.log("📤 Enviando validação para API...");
      
      const result = await validateLogin(user.uid, user.email);
      console.log("📥 Resposta da API recebida:", result);
      
      if (result.success) {
        console.log("✅ Validação bem-sucedida, definindo backendUser...");
        setBackendUser(result.user);
        localStorage.setItem("userAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(result.user));
        console.log("✅ Usuário validado no backend com sucesso");
      } else {
        console.warn("⚠️ Validação falhou:", result.message);
        throw new Error(result.message || "Falha na validação");
      }
    } catch (error) {
      console.error("❌ Erro na validação do backend:", error);
      setLoginError(error.message);
      setBackendUser(null);
      localStorage.removeItem("userAuthenticated");
      localStorage.removeItem("userData");
      
      // ❌ REMOVI o signOut automático - pode estar causando o problema
      // await signOut(auth);
    }
  };

  useEffect(() => {
    console.log("🔥 AuthContext useEffect INICIADO");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🎯 onAuthStateChanged DISPARADO:", user ? `Usuário: ${user.uid}` : "NULL");
      
      setCurrentUser(user);
      setLoginError(null);

      if (user) {
        console.log("👤 Usuário Firebase detectado, validando backend...");
        await validateUserInBackend(user);
      } else {
        console.log("🚪 Nenhum usuário, limpando estado...");
        setBackendUser(null);
        localStorage.removeItem("userAuthenticated");
        localStorage.removeItem("userData");
      }

      console.log("🏁 AuthStateChanged FINALIZADO, loading: false");
      setLoading(false);
    });

    return () => {
      console.log("🧹 Cleanup AuthContext");
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    backendUser,
    loading,
    loginError,
    logout: async () => {
      try {
        console.log("🚪 Iniciando logout...");
        await signOut(auth);
        console.log("✅ Logout bem-sucedido.");
      } catch (error) {
        console.error("❌ Erro durante o logout:", error);
      }
    },
    revalidate: async () => {
      if (currentUser) {
        console.log("🔄 Revalidação manual solicitada");
        await validateUserInBackend(currentUser);
      }
    }
  };

  console.log("🎨 AuthProvider renderizando com:", value);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};