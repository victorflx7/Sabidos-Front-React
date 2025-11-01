// pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContexts.jsx"; 

export default function Dashboard() {
  const { backendUser } = useAuth();
  
  // ✅ Agora usa os dados do SQL via backendUser
  const userName = backendUser?.name?.split(' ')[0] || "Sabido";

  // Dados de exemplo
  const totalResumos = 17;
  const totalFlashcards = 6;
  const totalEventos = 20;
  const totalTrabalho = "2H"; 

  return (
    <div className="min-h-screen bg-[#171621] text-white flex flex-col items-center py-3 px-4 relative overflow-hidden">
      {/* MENSAGEM DO SABIDO */}
      <div className="w-full max-w-6xl flex items-center gap-5 mb-15">
        <img src="/sabidoOlhosFechados.svg" alt="Sabido" className="w-24" />

        <div className="bg-[#292535] px-5 py-4 rounded-xl shadow-md text-[#EAEAEA]">
          {/* ✅ USA O NOME DO SQL */}
          <p className="font-semibold">
            Opa {userName}! Já checou suas notas hoje?
          </p>

          <p className="text-[#AFAFAF] text-sm">
            Bons estudos, mantenha o foco.
          </p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-12 w-full max-w-6xl">
        {/* MENU DE ACESSO RÁPIDO */}
        <div className="relative w-[300px] h-[300px] flex items-center justify-center mx-auto">
          {/* esfera central */}
          <div
            className="absolute w-50 h-50 bg-[#3B2868] hover:bg-[#322159] transition-all rounded-full flex items-center justify-center shadow-xl border-4 border-[#7763B3] hover:border-[#5D45A7]"
            style={{ transform: "translateY(-60px)" }}
          >
            <img
              src="IconesSVG/sabidosOutline.svg"
              alt="Estudo"
              className="w-30"
            />
          </div>

          {/* Esferas menores orbitando */}
          {[
            { to: "/Pomodoro", label: "🍅", angle: 5 },
            { to: "/Flashcards", label: "🃏", angle: 50 },
            { to: "/SobreNos", label: "👥", angle: 90 },
            { to: "/Resumo", label: "📝", angle: 130 },
            { to: "/Agenda", label: "📅", angle: 170 },
          ].map((item, index) => {
            const radius = 160;
            const x = radius * Math.cos((item.angle * Math.PI) / 180);
            const y = radius * Math.sin((item.angle * Math.PI) / 180) - 60;

            return (
              <Link
                key={index}
                to={item.to}
                className="absolute w-18 h-18 bg-[#3B2868] border-2 border-[#7763B3] rounded-full flex items-center justify-center hover:bg-[#322159] hover:border-[#5D45A7] transition-all hover:-translate-y-1"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <span className="text-2xl">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* BLOCO DE ESTATÍSTICAS */}
        <div className="w-full max-w-sm bg-[#292535] rounded-2xl p-6 shadow-lg space-y-8 text-[#EAEAEA]">
          <div className="bg-[#423E51] rounded-xl w-full p-5 flex flex-col items-center relative">
            <div className="absolute -top-6 w-15 h-15 bg-[#3B2868] rounded-lg border-2 border-[#7763B3] flex items-center justify-center">
              <span className="text-2xl">🍅</span>
            </div>

            <p className="font-semibold text-sm mt-8">Você estudou por:</p>
            <p className="text-5xl font-extrabold mt-2 tracking-tight">
              {totalTrabalho}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Notas", value: totalResumos, icon: "📝" },
              { label: "Cards", value: totalFlashcards, icon: "🃏" },
              { label: "Eventos", value: totalEventos, icon: "🗓️" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-[#423E51] rounded-xl p-4 pt-10 flex flex-col items-center justify-center"
              >
                <div className="absolute -top-6 w-12 h-12 bg-[#3B2868] rounded-lg border-2 border-[#7763B3] flex items-center justify-center">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                
                <p className="font-semibold text-sm mb-2">
                  {item.label}
                </p>
                <p className="text-2xl font-extrabold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}