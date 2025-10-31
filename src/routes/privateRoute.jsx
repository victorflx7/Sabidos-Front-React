// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContexts";

export default function PrivateRoute({ children }) {
  const { backendUser, loading, loginError } = useAuth();

  if (loading) return <p>Carregando...</p>;

  // 🔐 Só permite acesso se usuário existe no SQL
  if (!backendUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}