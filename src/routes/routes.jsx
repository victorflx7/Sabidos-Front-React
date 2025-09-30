import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
/*import Agenda from "../pages/Agenda/Agenda";
import Dashboard from "../pages/Dashboard/Dashboard";
import Perfil from "../pages/Perfil/Perfil";
import Pomodoro from "../pages/Pomodoro/Pomodoro";
import Resumo from "../pages/Resumo/Resumo";
import SobreNos from "../pages/SobreNos/SobreNos";
import Cadastro from "../pages/Cadastro/Cadastro";
import Login from "../pages/Login/Login";
import Flashcard from "../pages/Flashcard/Flashcard";*/
import AccountLayout from "../layout/AccountLayout";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route element={<AccountLayout />}>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
    /*<Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Resumo" element={<Resumo />} />
        <Route path="/Agenda" element={<Agenda />} />
        <Route path="/Pomodoro" element={<Pomodoro />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Flashcard" element={<Flashcard />} />
        <Route path="/Sobrenos" element={<SobreNos />} />*/
  );
}
