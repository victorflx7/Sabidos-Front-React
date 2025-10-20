import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { fetchWithAuth } from "../api";

const AuthContext = createContext();
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
          const token = await user.getIdToken();
          localStorage.setItem("token", token);

          // 🔹 Chama /me automaticamente
          const data = await fetchWithAuth("user/me");
          setMe(data);
        } catch (err) {
          console.error("Erro ao carregar /me:", err);
          setMe(null);
        }
      } else {
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
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
