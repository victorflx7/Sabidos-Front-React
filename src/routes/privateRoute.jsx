// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContexts";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <p>Carregando...</p>; // opcional: spinner

  if (!currentUser) {
    return <Navigate to="/login" replace />; // redireciona se não estiver logado
  }

  return children;
}