// routes/routes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import PrivateRoute from "./privateRoute";
import Agenda from "../pages/Agenda";
import Header from "../components/Header/Header";
import Resumo from "../pages/Resumo";
import Flashcard from "../pages/Flashcard"

export function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <Agenda />
            </PrivateRoute>
          }
        />
        <Route
          path="/resumo"
          element={
            <PrivateRoute>
              <Resumo />
            </PrivateRoute>
          }
        />
        <Route
          path="/flashcard"
          element={
            <PrivateRoute>
              <Flashcard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
