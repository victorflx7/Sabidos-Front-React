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
import SobreNos from "../pages/SobreNos"
import SobreNosPage from "../pages/SobreNos";

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
            
              <Dashboard />
            
          }
        />
        <Route
          path="/agenda"
          element={
            
              <Agenda />
            
          }
        />
        <Route
          path="/resumo"
          element={
            
              <Resumo />
            
          }
        />
        <Route
          path="/flashcard"
          element={
            
              <Flashcard />
            
          }
        />
      </Routes>
    </>
  );
}
