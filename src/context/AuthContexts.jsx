// src/context/AuthContexts.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { fetchWithAuth, API_BASE_URL } from "../services/Api"; 

// Função de sincronização (copiada do Login/Cadastro)
const syncUserToBackend = async (user) => {
    try {
        const syncDto = {
            FirebaseUid: user.uid,
            Email: user.email,
            Name: user.displayName || null
        };

        const res = await fetch(`${API_BASE_URL}/user/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(syncDto)
        });

        if (!res.ok) {
            console.warn(`Aviso: Falha na sincronização inicial do usuário no SQL: ${res.status}`);
        }
    } catch (apiError) {
        console.warn("Erro na sincronização com a API (SQL):", apiError);
    }
};

// 🌟 CORREÇÃO APLICADA AQUI: Adicionado valor padrão para evitar desestruturação de 'undefined'
const AuthContext = createContext({
    currentUser: null,
    me: null,
    loading: true, // Garante que PrivateRoute não falhe imediatamente
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [me, setMe] = useState(null); // Dados do usuário no backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // 1. Pega o token para rotas PROTEGIDAS
          const token = await user.getIdToken();
          localStorage.setItem("token", token);
          
          // 2. Sincronização: garante a linha no SQL (rota anônima /sync)
          await syncUserToBackend(user); 
          
          // 3. Busca Dados (rota protegida /me que usa o token)
          const data = await fetchWithAuth("user/me"); 
          setMe(data);
          
        } catch (err) {
          console.error("Erro ao carregar dados do usuário no backend:", err);
          setMe(null);
        }
      } else {
        // 🚨 FLUXO DE LOGOUT E LIMPEZA
        localStorage.removeItem("token");
        setMe(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    me,          // Dados do backend (/me)
    loading,
    // 🌟 LOGOUT ROBUSTO
    logout: async () => {
      try {
        await signOut(auth); // Desloga do Firebase
        // O onAuthStateChanged (acima) cuida do resto (limpar local storage e states)
        console.log("Logout bem-sucedido.");
      } catch (error) {
        console.error("Erro durante o logout:", error);
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};