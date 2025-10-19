import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
//import Agenda from "../pages/Agenda/Agenda";
import Dashboard from "../pages/Dashboard";
//import Perfil from "../pages/Perfil/Perfil";
//import Pomodoro from "../pages/Pomodoro/Pomodoro";
//import Resumo from "../pages/Resumo/Resumo";
//import SobreNos from "../pages/SobreNos/SobreNos";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
//import Flashcard from "../pages/Flashcard/Flashcard";
import AccountLayout from "../layout/AccountLayout";

export function AppRoutes() {
  return (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route element={<AccountLayout />}>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    /*
        <Route path="/Resumo" element={<Resumo />} />
        <Route path="/Agenda" element={<Agenda />} />
        <Route path="/Pomodoro" element={<Pomodoro />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Flashcard" element={<Flashcard />} />
        <Route path="/Sobrenos" element={<SobreNos />} />*/
  );
}
