import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { validateLogin, syncUserToBackend } from "../services/Api";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOGOUT CORRETO
  const logout = async () => {
    setBackendUser(null);
    await signOut(auth);
  };

  const handleAuthFailure = async () => {
    setBackendUser(null);
    await signOut(auth);
  };

  const validateUserInBackend = async (user) => {
    try {
      const result = await validateLogin(user.uid, user.email);

      if (result.success) {
        setBackendUser(result.user);
      } else {
        const syncedUser = await syncUserToBackend(
          user,
          user.displayName || "Usuário"
        );
        setBackendUser(syncedUser);
      }
    } catch (error) {
      console.error("Erro backend:", error);
      await handleAuthFailure();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await validateUserInBackend(user);
      } else {
        setBackendUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        backendUser,
        loading,
        logout, // ✅ AGORA ESTÁ DISPONÍVEL
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
