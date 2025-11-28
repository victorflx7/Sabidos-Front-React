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
import Pomodoro from "../pages/Pomodoro"
import SobreNosPage from "../pages/SobreNos";
import PerfilPage from "../pages/Perfil"
import Footer from "../components/Footer/Footer";

export function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobrenos" element={<SobreNosPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
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
      <Footer />
    </>
  );
}
