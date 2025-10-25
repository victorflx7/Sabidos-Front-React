// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [totalResumos, setTotalResumos] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [totalTrabalho, setTotalTrabalho] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsub();
  }, []);

  /*useEffect(() => {
    async function buscarDados() {
      if (!userId) return;
      setCarregando(true);
      try {
        const [events, resumos, flashcards] = await Promise.all([
          contarDocumentosPorUsuario("events", userId),
          contarDocumentosPorUsuario("resumos", userId),
          contarDocumentosPorUsuario("flashcards", userId),
        ]);
        setTotalEvents(events);
        setTotalResumos(resumos);
        setTotalFlashcards(flashcards);
        const total = await SomaTempoDasSecoesPomo(userId);
        setTotalTrabalho(total);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    buscarDados();
  }, [userId]);

  if (carregando)
    return <div className="p-6 text-white">Carregando dados do usuário...</div>;
*/
  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <div className="flex items-center gap-6 mb-8">
        <img src="SabidoOlhosFechados.svg" alt="Sabido" className="w-35" />
        <div className="bg-[#292535] rounded-xl p-4 shadow-md">
          <p className="text-white font-bold text-lg">
            Opa sabido! Já checou suas notas hoje?
          </p>
          <p className="text-pink-300">
            Bons estudos, mantenha o foco e continue aprendendo.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* BLOCO CENTRAL */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative bg-[#3B2868] rounded-2xl w-full max-w-md p-6 shadow-lg border-4 border-[#7763B3] flex flex-col items-center">
            <img
              src="/assets/sabidoOutline.svg"
              alt="Mascote Sabido"
              className="w-28 mb-4"
            />
            <h2 className="text-yellow-400 font-semibold text-lg mb-4">
              Acesse suas áreas de estudo
            </h2>

            <div className="grid grid-cols-2 gap-4 w-full">
              <a
                href="/Agenda"
                className="bg-[#423E51] hover:bg-[#564b6a] rounded-xl p-4 flex flex-col items-center justify-center transition-all shadow-md"
              >
                <span className="text-4xl mb-2">📔</span>
                <span className="text-white font-semibold">Agenda</span>
              </a>
              <a
                href="/Resumo"
                className="bg-[#423E51] hover:bg-[#564b6a] rounded-xl p-4 flex flex-col items-center justify-center transition-all shadow-md"
              >
                <span className="text-4xl mb-2">📝</span>
                <span className="text-white font-semibold">Resumos</span>
              </a>
              <a
                href="/Pomodoro"
                className="bg-[#423E51] hover:bg-[#564b6a] rounded-xl p-4 flex flex-col items-center justify-center transition-all shadow-md"
              >
                <span className="text-4xl mb-2">⏳</span>
                <span className="text-white font-semibold">Pomodoro</span>
              </a>
              <a
                href="/Flashcard"
                className="bg-[#423E51] hover:bg-[#564b6a] rounded-xl p-4 flex flex-col items-center justify-center transition-all shadow-md"
              >
                <span className="text-4xl mb-2">🃏</span>
                <span className="text-white font-semibold">Flashcards</span>
              </a>
            </div>
          </div>
        </div>

        {/* BLOCO DE DADOS */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="bg-[#292535] p-4 rounded-lg flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-[#423E51] flex items-center justify-center">
              <img
                src="/assets/clock.svg"
                alt="clock"
                className="w-10 h-10"
              />
            </div>
            <div>
              <div className="text-white">Você estudou por:</div>
              <div className="text-4xl font-bold text-white">
                {totalTrabalho}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#423E51] p-4 rounded-lg text-center">
              <div className="text-pink-300 mb-2 font-semibold">Notas</div>
              <div className="text-3xl font-bold text-white">
                {totalResumos}
              </div>
            </div>

            <div className="bg-[#423E51] p-4 rounded-lg text-center">
              <div className="text-pink-300 mb-2 font-semibold">Eventos</div>
              <div className="text-3xl font-bold text-white">
                {totalEvents}
              </div>
            </div>

            <div className="bg-[#423E51] p-4 rounded-lg text-center">
              <div className="text-pink-300 mb-2 font-semibold">Cards</div>
              <div className="text-3xl font-bold text-white">
                {totalFlashcards}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
