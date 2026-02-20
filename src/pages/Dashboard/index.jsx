// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContexts.jsx";
import { PomodoroApi } from "../../services/PomodoroApi";
import { EventoApi } from "../../services/EventoApi.js";
import Tooltip from "./tooltip.jsx";
import { getHomeStats } from "../../services/HomeStatsService";

export default function Dashboard() {
  const { backendUser, currentUser } = useAuth();
  const [pomodoroStats, setPomodoroStats] = useState({
    totalStudyTime: 0,
    totalSessions: 0,
    loading: true,
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalEventos: 0,
    totalResumos: 0,
    totalFlashcards: 0,
    loading: true,
  }); // A estrutura baixo é a martualizada pegando os dados Vocês já precisam fazer uma refatorização Devido o lixo do código de variáveis Que está ali nesse comentário
  
  const [stats, setStats] = useState({
    resumos: 0,
    flashcards: 0,
  });
  const [hoverIndex, setHoverIndex] = useState(null);

  // ✅ Buscar dados reais do Pomodoro
  useEffect(() => {
    const loadPomodoroStats = async () => {
      if (!currentUser?.uid) return;

      try {
        const totalTime = await PomodoroApi.getTotalTime(currentUser.uid);

        setPomodoroStats({
          totalStudyTime: totalTime || 0,
          totalSessions: 0,
          loading: false,
        });
      } catch (error) {
        console.error("Erro ao carregar stats do Pomodoro:", error);
        setPomodoroStats((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    loadPomodoroStats();
  }, [currentUser]);

  // ✅ Buscar contagem real de eventos - CORRIGIDO
  useEffect(() => {
    const loadEventosCount = async () => {
      if (!currentUser?.uid) return;

      try {
        const response = await EventoApi.getEventosCount(currentUser.uid);

        // ✅ CORREÇÃO: Extrair o valor numérico do response
        let eventosCount = 0;

        if (response && typeof response === "object") {
          // Se a API retornar { success: true, data: 5 }
          if (response.data !== undefined) {
            eventosCount = response.data;
          }
          // Se a API retornar { count: 5 }
          else if (response.count !== undefined) {
            eventosCount = response.count;
          }
          // Se a API retornar o número diretamente no objeto
          else {
            // Tenta encontrar qualquer valor numérico no objeto
            const numericValues = Object.values(response).filter(
              (val) => typeof val === "number"
            );
            eventosCount = numericValues.length > 0 ? numericValues[0] : 0;
          }
        }
        // Se for diretamente um número
        else if (typeof response === "number") {
          eventosCount = response;
        }

        console.log("✅ Contagem de eventos:", eventosCount);

        setDashboardStats((prev) => ({
          ...prev,
          totalEventos: eventosCount,
          loading: false,
        }));
      } catch (error) {
        console.error("Erro ao carregar contagem de eventos:", error);
        setDashboardStats((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    loadEventosCount();
  }, [currentUser]);


    useEffect(() => {
    async function loadStats() {
      try {
        const data = await getHomeStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    }

    loadStats();
  }, []);

  const userName = backendUser?.name?.split(" ")[0] || "Sabido";

  const formatStudyTime = (seconds) => {
    if (!seconds || seconds === 0) return "0min";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center py-3 px-4 relative overflow-hidden">
      {/* MENSAGEM DO SABIDO */}
      <div className="w-full max-w-6xl flex items-center gap-5 mb-15">
        <img src="/sabidoOlhosFechados.svg" alt="Sabido" className="w-24" />

        <div className="bg-[#292535] px-5 py-4 rounded-xl shadow-md text-[#EAEAEA]">
          <p className="font-semibold">
            Opa {userName}!{" "}
            {pomodoroStats.totalStudyTime > 0
              ? `Já estudou ${formatStudyTime(pomodoroStats.totalStudyTime)}!`
              : "Vamos começar a estudar?"}
          </p>

          <p className="text-[#AFAFAF] text-sm">
            {pomodoroStats.totalStudyTime > 0
              ? "Continue assim! 🎯"
              : "Bons estudos, mantenha o foco."}
          </p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col items-center lg:flex-row lg:items-start justify-center gap-12 w-full max-w-6xl">
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
            {
              to: "/Pomodoro",
              label: "🍅",
              angle: 10,
              tooltip: "Gerencie seu tempo",
            },
            {
              to: "/Flashcard",
              label: "🃏",
              angle: 50,
              tooltip: "Crie e revise seus flashcards",
            },
            {
              to: "/SobreNos",
              label: "👥",
              angle: 90,
              tooltip: "Conheça a equipe",
            },
            {
              to: "/Resumo",
              label: "📝",
              angle: 130,
              tooltip: "Organize seus estudos",
            },
            {
              to: "/Agenda",
              label: "📅",
              angle: 170,
              tooltip: "Planeje seus eventos",
            },
          ].map((item, index) => {
            const radius = 160;
            const x = radius * Math.cos((item.angle * Math.PI) / 180);
            const y = radius * Math.sin((item.angle * Math.PI) / 180) - 60;

            return (
              <Link
                key={index}
                to={item.to}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className="group absolute w-18 h-18 bg-[#3B2868] border-2 border-[#7763B3] rounded-full flex items-center justify-center hover:bg-[#322159] hover:border-[#5D45A7] transition-all hover:-translate-y-1 z-20"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <span className="text-2xl">{item.label}</span>

                {hoverIndex === index && (
                  <Tooltip text={item.tooltip} position="top" />
                )}
              </Link>
            );
          })}
        </div>

        {/* BLOCO DE ESTATÍSTICAS */}
        <div className="w-full max-w-sm bg-[#292535] rounded-2xl p-6 shadow-lg space-y-8 text-[#EAEAEA]">
          {/* CARD PRINCIPAL DO POMODORO */}
          <div className="bg-[#423E51] rounded-xl w-full p-5 flex flex-col items-center relative">
            <div className="absolute -top-6 w-15 h-15 bg-[#3B2868] rounded-lg border-2 border-[#7763B3] flex items-center justify-center">
              <span className="text-2xl">🍅</span>
            </div>

            <p className="font-semibold text-sm mt-8">Você estudou por:</p>
            <p className="text-5xl font-extrabold mt-2 tracking-tight">
              {pomodoroStats.loading
                ? "..."
                : formatStudyTime(pomodoroStats.totalStudyTime)}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {pomodoroStats.totalStudyTime > 0
                ? "Tempo total de foco"
                : "Comece agora!"}
            </p>
          </div>

          {/* CARDS SECUNDÁRIOS */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                  label: "Notas",
                  value: stats.resumos,
                  icon: "📝",
              },
              {
                label: "Cards",
                value:  stats.flashcards,
                icon: "🃏",
              },
              {
                label: "Eventos",
                value: dashboardStats.loading
                  ? "..."
                  : dashboardStats.totalEventos,
                icon: "🗓️",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-[#423E51] rounded-xl p-4 pt-10 flex flex-col items-center justify-center"
              >
                <div className="absolute -top-6 w-12 h-12 bg-[#3B2868] rounded-lg border-2 border-[#7763B3] flex items-center justify-center">
                  <span className="text-2xl">{item.icon}</span>
                </div>

                <p className="font-semibold text-sm mb-2">{item.label}</p>
                <p className="text-2xl font-extrabold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
