import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });

    return () => unsub();
  }, []);

  // Dados de exemplo (substituir futuramente por Firebase)
  const totalResumos = 17;
  const totalFlashcards = 6;
  const totalEventos = 20;
  const totalTrabalho = "2H";

  return (
    <div className="min-h-screen bg-[#171621] text-white flex flex-col items-center py-3 px-4 relative overflow-hidden">
      {/* TOPO */}
      <div className="w-full max-w-6xl flex items-center mb-10">
        <div className="w-10 h-10"></div>

        <div className="flex-1 text-center">
          <h1 className="text-3xl font-semibold text-[#FBCB4E]">Dashboard</h1>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#3B2868] border-1 border-[#7763B3] flex items-center justify-center ">
          <img src="IconesSVG/sabidosOutline.svg" alt="Icone" className="w-8 h-8" />
        </div>
      </div>

      {/* MENSAGEM DO SABIDO */}
      <div className="w-full max-w-6xl flex items-center gap-5 mb-15">
        <img src="/sabidoOlhosFechados.svg" alt="Sabido" className="w-24" />

        <div className="bg-[#292535] px-5 py-4 rounded-xl shadow-md">
          <p className="font-semibold">
            Opa sabido! Já checou suas notas hoje?
          </p>

          <p className="text-gray-300 text-sm">
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

          {/* --- Esferas menores orbitando na base --- */}
          {[
            { to: "/Pomodoro", label: "🍅", angle: 5 },
            { to: "/Flashcards", label: "🃏", angle: 50 },
            { to: "/SobreNos", label: "👥", angle: 90 },
            { to: "/Resumos", label: "📝", angle: 130 },
            { to: "/Agenda", label: "📅", angle: 170 },
          ].map((item, index) => {
            // Cálculo trigonométrico para circular a base da esfera

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

        <div className="w-full max-w-sm bg-[#292535] rounded-2xl p-6 shadow-lg space-y-8">
          <div className="bg-[#423E51] rounded-xl w-full p-5 flex flex-col items-center relative">
            <div className="absolute -top-6 w-15 h-15 bg-[#3B2868] rounded-lg border-2 border-[#7A67B6] flex items-center justify-center">
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
                <div className="absolute -top-6 w-12 h-12 bg-[#3B2868] rounded-lg border-2 border-[#7A67B6] flex items-center justify-center">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                
                <p className="font-semibold text-sm mb-2">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
