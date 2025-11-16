import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContexts";
import { PomodoroApi } from "../../services/PomodoroApi";
import { FaPlay, FaPause, FaStop, FaCode } from "react-icons/fa";

const ProgressoCircular = () => {
  const { currentUser } = useAuth();

  // Estados do timer
  const [tempo, setTempo] = useState(0);
  const [tempoMaximo, setTempoMaximo] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [entrada, setEntrada] = useState(25);
  const [modoDescanso, setModoDescanso] = useState(false);

  // Estados dos ciclos
  const [ciclos, setCiclos] = useState(3);
  const [cicloAtual, setCicloAtual] = useState(0);
  const [tempoDescansoCurto, setTempoDescansoCurto] = useState(5);
  const [tempoDescansoLongo, setTempoDescansoLongo] = useState(15);

  // Estatísticas
  const [temposTrabalho, setTemposTrabalho] = useState([]);
  const [temposDescanso, setTemposDescanso] = useState([]);

  // Estado para modo desenvolvedor
  const [modoDesenvolvedor, setModoDesenvolvedor] = useState(false);

  // Refs para áudio
  const audioFoco = useRef(null);
  const audioDescanso = useRef(null);
  const audioLongo = useRef(null);
  const audioFim = useRef(null);

  // Carregar estatísticas do usuário
  useEffect(() => {}, [currentUser]);

useEffect(() => {
  let intervalo = null;

  if (ativo && !pausado && tempo > 0) {
    intervalo = setInterval(() => {
      setTempo((t) => t - 1);
    }, 1000);
  } else if (tempo === 0 && ativo && !pausado) {
    if (!modoDescanso) {
      // ✅ Fim do tempo de trabalho - APENAS ATUALIZA ESTADO
      console.log("⏰ Tempo de trabalho terminou");
      const novosTemposTrabalho = [...temposTrabalho, tempoMaximo];
      setTemposTrabalho(novosTemposTrabalho);
      
      iniciarDescanso();
    } else {
      console.log("⏰ Tempo de descanso terminou");
      const novosTemposDescanso = [...temposDescanso, tempoMaximo];
      setTemposDescanso(novosTemposDescanso);

      if (cicloAtual < ciclos - 1) {
        // ✅ Continua para próximo ciclo - NÃO SALVA AINDA
        iniciarFoco();
        setCicloAtual(cicloAtual + 1);
      } else {
        const eDescansoLongo = tempoMaximo === (tempoDescansoLongo || 0) * 60;

        if (!eDescansoLongo) {
          console.log("🚀 Iniciando descanso longo...");
          iniciarDescansoLongo();
        } else {
          console.log("🎉 Sessão completa! Salvando e resetando...");
          audioFim.current?.play();
          
          // ✅ SALVA APENAS AQUI NO FINAL DA SESSÃO COMPLETA
          salvarDadosPomodoro();
          resetar();
        }
      }
    }
  }

  return () => clearInterval(intervalo);
}, [
  ativo,
  pausado,
  tempo,
  cicloAtual,
  ciclos,
  modoDescanso,
  tempoMaximo,
  temposTrabalho,
  temposDescanso,
  tempoDescansoLongo,
]);
  // 🔧 NOVA FUNÇÃO: Criar sessão de teste para desenvolvedor
  // No arquivo index.jsx, na função criarSessaoTeste:

const criarSessaoTeste = async () => {
  if (!currentUser?.uid) {
    console.error("Usuário não autenticado");
    return;
  }

  try {
    console.log("🛠️ Criando sessão de teste para desenvolvedor...");

    // Simula uma sessão completa de pomodoro com dados realistas
    const tempoTrabalhoTeste = (entrada || 25) * 60; // em segundos
    const tempoDescansoTeste = (tempoDescansoCurto || 5) * 60;
    const tempoDescansoLongoTeste = (tempoDescansoLongo || 15) * 60;

    // Calcula duração total simulando uma sessão completa
    const duracaoTotal = 
      (tempoTrabalhoTeste * ciclos) + 
      (tempoDescansoTeste * (ciclos - 1)) + 
      tempoDescansoLongoTeste;

    const pomodoroData = {
      Ciclos: ciclos,
      Duration: duracaoTotal,
      TempoTrabalho: tempoTrabalhoTeste,
      TempoDescanso: tempoDescansoTeste,
    };

    const result = await PomodoroApi.createPomodoro(
      pomodoroData,
      currentUser.uid
    );

    if (result.success) {
      console.log("✅ Sessão de teste criada com sucesso!", result.data);
      
      // Atualiza as estatísticas visuais
      const temposTrabalhoTeste = Array(ciclos).fill(tempoTrabalhoTeste);
      const temposDescansoTeste = Array(ciclos - 1).fill(tempoDescansoTeste);
      
      setTemposTrabalho(temposTrabalhoTeste);
      setTemposDescanso(temposDescansoTeste);
      
      // ✅ CORREÇÃO: Mensagem de sucesso sem erro no console
      setTimeout(() => {
        alert(`✅ Sessão de teste criada com sucesso!\n\n` +
              `Ciclos: ${ciclos}\n` +
              `Duração total: ${Math.round(duracaoTotal / 60)} minutos\n` +
              `Tempo de trabalho: ${entrada} min/ciclo\n` +
              `Tempo de descanso: ${tempoDescansoCurto} min`);
      }, 100);
    } else {
      console.error("❌ Erro ao criar sessão de teste:", result);
      // ✅ CORREÇÃO: Mensagem de erro sem alerta vermelho
      setTimeout(() => {
        alert("❌ Erro ao criar sessão de teste. Verifique o console.");
      }, 100);
    }
  } catch (error) {
    console.error("❌ Erro ao criar sessão de teste:", error);
    // ✅ CORREÇÃO: Mensagem de erro sem alerta vermelho
    setTimeout(() => {
      alert("❌ Erro ao criar sessão de teste. Verifique o console.");
    }, 100);
  }
};

  // 🔧 NOVA FUNÇÃO: Teste rápido (apenas 1 ciclo)
  const testeRapido = async () => {
    if (!currentUser?.uid) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      console.log("⚡ Criando teste rápido...");

      const pomodoroData = {
        Ciclos: 1,
        Duration: 1500, // 25 minutos em segundos
        TempoTrabalho: 1500, // 25 minutos
        TempoDescanso: 300, // 5 minutos
      };

      const result = await PomodoroApi.createPomodoro(
        pomodoroData,
        currentUser.uid
      );

      if (result.success) {
        console.log("✅ Teste rápido criado com sucesso!", result.data);
        
        // Atualiza estatísticas visuais
        setTemposTrabalho([1500]);
        setTemposDescanso([]);
        
        alert("✅ Teste rápido criado com sucesso!\n1 ciclo de 25 minutos");
      }
    } catch (error) {
      console.error("❌ Erro no teste rápido:", error);
    }
  };

  const iniciarNovaSessao = () => {
    // 1. Limpa a contagem da sessão anterior
    setTemposTrabalho([]);
    setTemposDescanso([]);

    // 2. Inicia o primeiro foco
    iniciarFoco();
  };

  const iniciarFoco = () => {
    audioFoco.current?.play();
    const segundos = (entrada || 0) * 60;
    setTempo(segundos);
    setTempoMaximo(segundos);
    setModoDescanso(false);
    setAtivo(true);
    setPausado(false);
  };

  const iniciarDescanso = () => {
    audioDescanso.current?.play();
    const segundos = (tempoDescansoCurto || 0) * 60;
    setTempo(segundos);
    setTempoMaximo(segundos);
    setModoDescanso(true);
  };
  const iniciarDescansoLongo = async () => {
    console.log("🛌 Iniciando descanso longo...");
    audioLongo.current?.play();
    const segundos = (tempoDescansoLongo || 0) * 60;
    setTempo(segundos);
    setTempoMaximo(segundos);
    setModoDescanso(true);
    
  };

  const resetar = () => {
    setAtivo(false);
    setTempo(0);
    setTempoMaximo(0);
    setModoDescanso(false);
    setCicloAtual(0);
    setPausado(false);
  };

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const formatarTempoParaExibicao = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    }
    return `${minutos}m`;
  };

  const salvarDadosPomodoro = async () => {
    if (!currentUser?.uid) {
      console.log("❌ Usuário não autenticado, não foi possível salvar");
      return;
    }

    try {
      const tempoTotalTrabalho = temposTrabalho.reduce((acc, curr) => acc + curr, 0);
      const tempoTotalDescanso = temposDescanso.reduce((acc, curr) => acc + curr, 0);
      const duration = tempoTotalTrabalho + tempoTotalDescanso;

      // ✅ VALIDAÇÃO: Só salva se tiver tempo de trabalho
      if (tempoTotalTrabalho === 0) {
        console.log("❌ Nenhum tempo de trabalho para salvar");
        return;
      }

      const pomodoroData = {
        Ciclos: ciclos,
        Duration: duration, // ✅ DURAÇÃO TOTAL CORRETA
        TempoTrabalho: (entrada || 0) * 60, // Tempo configurado por ciclo
        TempoDescanso: (tempoDescansoCurto || 0) * 60, // Tempo configurado por descanso
      };

      console.log("💾 Salvando sessão completa:", {
        ciclosCompletos: temposTrabalho.length,
        tempoTotalTrabalho: formatarTempoParaExibicao(tempoTotalTrabalho),
        tempoTotalDescanso: formatarTempoParaExibicao(tempoTotalDescanso),
        durationTotal: formatarTempoParaExibicao(duration),
        dadosEnviados: pomodoroData
      });

      const result = await PomodoroApi.createPomodoro(
        pomodoroData,
        currentUser.uid
      );

      if (result && result.id) {
        console.log("✅ Sessão completa salva com sucesso! ID:", result.id);
        
        // ✅ FEEDBACK VISUAL
        setTimeout(() => {
          alert(`✅ Sessão completa salva!\n\n` +
                `Ciclos: ${temposTrabalho.length}/${ciclos}\n` +
                `Tempo total: ${formatarTempoParaExibicao(duration)}\n` +
                `ID: ${result.id}`);
        }, 500);
      } else {
        console.error("❌ Erro ao salvar sessão:", result);
      }
    } catch (error) {
      console.error("❌ Erro ao salvar sessão:", error);
    }
  };

  const progresso = tempoMaximo > 0 ? (tempo / tempoMaximo) * 100 : 0;
  const corFundo = modoDescanso ? "#1E90FF" : "#C52333";
  const corProgresso = modoDescanso ? "#A8D3FF" : "#ECB5B9";

  const tempoTrabalhoSessaoAtual = temposTrabalho.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const tempoDescansoSessaoAtual = temposDescanso.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const renderizarCiclos = () => {
    const items = [];
    const baseBoxClass =
      "w-10 h-10 rounded-lg flex items-center justify-center text-[1.2rem] transition-all duration-300 ease-in-out border-2";

    for (let i = 0; i < ciclos; i++) {
      // Um trabalho está completo se for de um ciclo anterior,
      // OU se for do ciclo atual E já estivermos no modo descanso.
      const isTrabalhoCompleto =
        i < cicloAtual || (i === cicloAtual && modoDescanso);

      const isTrabalhoAtivo = !modoDescanso && i === cicloAtual;
      let trabalhoClass = "";

      if (isTrabalhoCompleto) {
        trabalhoClass =
          "bg-gradient-to-tr from-[#4CAF50] to-[#45a049] border-[#4CAF50] text-white";
      } else if (isTrabalhoAtivo) {
        trabalhoClass =
          "bg-gradient-to-tr from-[#FFA000] to-[#ffb733] border-[#FFA000] text-white scale-110 shadow-[0_0_15px_rgba(255,160,0,0.5)]";
      } else {
        trabalhoClass = "bg-[#292535] border-[#7763B3]";
      }

      items.push(
        <div
          key={`trabalho-${i}`}
          className={`${baseBoxClass} ${trabalhoClass}`}
        >
          🍅
        </div>
      );

      if (i < ciclos - 1) {
        // Box de Descanso Curto (Não mudei nada aqui)
        const isDescansoCompleto = i < cicloAtual;
        const isDescansoAtivo = modoDescanso && i === cicloAtual;
        let descansoClass = "";

        if (isDescansoCompleto) {
          descansoClass =
            "bg-gradient-to-tr from-[#4CAF50] to-[#45a049] border-[#4CAF50] text-white";
        } else if (isDescansoAtivo) {
          descansoClass =
            "bg-gradient-to-tr from-[#FFA000] to-[#ffb733] border-[#FFA000] text-white scale-110 shadow-[0_0_15px_rgba(255,160,0,0.5)]";
        } else {
          descansoClass = "bg-[#292535] border-[#7763B3]";
        }

        items.push(
          <div
            key={`descanso-${i}`}
            className={`${baseBoxClass} ${descansoClass}`}
          >
            😌
          </div>
        );
      } else {
        // Box de Descanso Longo

        // --- LINHA CORRIGIDA 2 ---
        // O descanso longo está ativo se estivermos em modo descanso
        // E no último ciclo (ex: ciclo 2 de 3 ciclos).
        const isDescansoLongoAtivo = modoDescanso && cicloAtual === ciclos - 1;

        let descansoLongoClass = "";

        if (isDescansoLongoAtivo) {
          descansoLongoClass =
            "bg-gradient-to-tr from-[#FFA000] to-[#ffb733] border-[#FFA000] text-white scale-110 shadow-[0_0_15px_rgba(255,160,0,0.5)]";
        } else {
          descansoLongoClass = "bg-[#292535] border-[#7763B3]";
        }

        items.push(
          <div
            key="descanso-longo"
            className={`${baseBoxClass} ${descansoLongoClass}`}
          >
            🛌
          </div>
        );
      }
    }
    return items;
  };

  const baseButtonClass =
    "px-6 py-3 border-none rounded-lg text-[#292535] font-bold cursor-pointer transition-all duration-300 ease-in-out text-base hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-lg hover:not(:disabled):shadow-black/30 disabled:bg-[#cccccc] disabled:cursor-not-allowed disabled:transform-none";

  return (
    <div className="flex flex-col items-center min-h-[80vh] gap-8 py-12 px-3 bg-[#171621] h-screen">
      {/* 🔧 BOTÃO PARA MODO DESENVOLVEDOR */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setModoDesenvolvedor(!modoDesenvolvedor)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          title="Modo Desenvolvedor"
        >
          <FaCode />
          {modoDesenvolvedor ? "🔧" : "⚙️"}
        </button>
      </div>

      {/* 🔧 PAINEL DE DESENVOLVEDOR */}
      {modoDesenvolvedor && (
        <div className="fixed top-20 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-50 max-w-xs">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <FaCode /> Modo Desenvolvedor
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={criarSessaoTeste}
              className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              🧪 Criar Sessão Teste
            </button>
            
            <button
              onClick={testeRapido}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              ⚡ Teste Rápido (1 ciclo)
            </button>
            
            <button
              onClick={() => {
                setTemposTrabalho([]);
                setTemposDescanso([]);
                alert("Estatísticas resetadas!");
              }}
              className="w-full px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
            >
              🔄 Resetar Estatísticas
            </button>
            
            <div className="text-xs text-gray-300 mt-2 p-2 bg-gray-700 rounded">
              <strong>Debug Info:</strong><br />
              Ciclo: {cicloAtual + 1}/{ciclos}<br />
              Trabalho: {temposTrabalho.length} sessões<br />
              Descanso: {temposDescanso.length} sessões
            </div>
          </div>
        </div>
      )}

      {/* Configurações */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 items-center gap-4 mb-4 md:flex-row md:flex-wrap md:justify-center">
        {/* Bloco de Foco*/}
        <div className="flex w-40 flex-col items-center rounded-[10px] bg-gradient-to-tr from-[#292535] to-[#3B2868] p-2.5 shadow-lg shadow-black/30">
          <label className="text-center text-sm font-bold text-white mb-2">
            Trabalho Focado
          </label>

          {/* Wrapper do Input + Botões (agora com Flexbox) */}
          <div className="flex items-center gap-1.5">
            {/* Botão de Diminuir (-) */}
            <button
              type="button"
              onClick={() => !ativo && setEntrada((e) => Math.max(1, e - 1))}
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              {/* SVG de Menos (-) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>

            <input
              type="text"
              value={`${entrada}:00`}
              // O onChange que extrai o número (ex: "25" de "25:00")
              onChange={(e) => setEntrada(parseInt(e.target.value, 10) || 1)}
              disabled={ativo}
              className="w-16 rounded-md border-2 border-[#7763B3] bg-[#1a1a2e] py-1 text-center font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />

            {/* Botão de Aumentar (+) */}
            <button
              type="button"
              onClick={() => !ativo && setEntrada((e) => Math.min(60, e + 1))}
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              {/* SVG de Mais (+) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Bloco de Ciclos*/}
        <div className="flex w-40 flex-col items-center rounded-[10px] bg-gradient-to-tr from-[#292535] to-[#3B2868] p-2.5 shadow-lg shadow-black/30">
          <label className="text-center text-sm font-bold text-white mb-2">
            Nº de Ciclos
          </label>

          {/* Wrapper do Input + Botões */}
          <div className="flex items-center gap-2">
            {/* Botão de Diminuir (-) */}
            <button
              type="button"
              // Limite mínimo de 1
              onClick={() => !ativo && setCiclos((c) => Math.max(1, c - 1))}
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>

            <input
              type="text"
              value={ciclos} // Mostra o número puro (ex: 3)
              onChange={(e) => setCiclos(parseInt(e.target.value, 10) || 1)}
              disabled={ativo}
              className="w-16 rounded-md border-2 border-[#7763B3] bg-[#1a1a2e] p-1 text-center font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />

            {/* Botão de Aumentar (+) */}
            <button
              type="button"
              // Limite máximo de 10
              onClick={() => !ativo && setCiclos((c) => Math.min(10, c + 1))}
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Bloco de Descanso Curto*/}
        <div className="flex w-40 flex-col items-center rounded-[10px] bg-gradient-to-tr from-[#292535] to-[#3B2868] p-2.5 shadow-lg shadow-black/30">
          <label className="text-center text-sm font-bold text-white mb-2">
            Descanso Curto
          </label>

          {/* Wrapper do Input + Botões */}
          <div className="flex items-center gap-2">
            {/* Botão de Diminuir (-) */}
            <button
              type="button"
              // Limite mínimo de 1 (ou 0 se preferir)
              onClick={() =>
                !ativo && setTempoDescansoCurto((c) => Math.max(1, c - 1))
              }
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>

            <input
              type="text"
              value={`${tempoDescansoCurto}:00`} // Formata o valor
              onChange={(e) =>
                setTempoDescansoCurto(parseInt(e.target.value, 10) || 1)
              }
              disabled={ativo}
              className="w-16 rounded-md border-2 border-[#7763B3] bg-[#1a1a2e] p-1 text-center font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />

            {/* Botão de Aumentar (+) */}
            <button
              type="button"
              // Limite máximo de 10 (baseado no seu 'max' anterior)
              onClick={() =>
                !ativo && setTempoDescansoCurto((c) => Math.min(10, c + 1))
              }
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Bloco de "Descanso Longo" */}
        <div className="flex w-40 flex-col items-center rounded-[10px] bg-gradient-to-tr from-[#292535] to-[#3B2868] p-2.5 shadow-lg shadow-black/30">
          <label className="text-center text-sm font-bold text-white mb-2">
            Descanso Longo
          </label>

          {/* Wrapper do Input + Botões */}
          <div className="flex items-center gap-2">
            {/* Botão de Diminuir (-) */}
            <button
              type="button"
              // Limite mínimo de 1 (baseado no seu 'min' anterior)
              onClick={() =>
                !ativo && setTempoDescansoLongo((c) => Math.max(1, c - 1))
              }
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>

            {/* Input (agora no meio) */}
            <input
              type="text"
              value={`${tempoDescansoLongo}:00`} // Formata o valor
              onChange={(e) =>
                setTempoDescansoLongo(parseInt(e.target.value, 10) || 1)
              }
              disabled={ativo}
              className="w-16 rounded-md border-2 border-[#7763B3] bg-[#1a1a2e] p-1 text-center font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            />

            {/* Botão de Aumentar (+) */}
            <button
              type="button"
              // Limite máximo de 30 (baseado no seu 'max' anterior)
              onClick={() =>
                !ativo && setTempoDescansoLongo((c) => Math.min(30, c + 1))
              }
              disabled={ativo}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7763B3] text-white transition-colors hover:bg-[#9a89c7] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="m-0 text-3xl font-bold text-white">
          {modoDescanso ? "Tempo de Descanso" : "Tempo de Foco"}
        </p>
        <p className="mt-2 text-base text-gray-300">
          Ciclo {cicloAtual + 1} de {ciclos}
        </p>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center gap-6">
        <audio ref={audioFoco} src="/sounds/pomodoro/foco.mp3" preload="auto" />
        <audio ref={audioDescanso} src="/sounds/pomodoro/descanso-curto.mp3" preload="auto" />
        <audio
          ref={audioLongo}
          src="/sounds/pomodoro/descanso-longo.mp3"
          preload="auto"
        />
        <audio ref={audioFim} src="/sounds/pomodoro/fim.mp3" preload="auto" />

        <div className="relative">
          <svg width="300" height="300" viewBox="0 0 130 130">
            <g transform="translate(65, 65)">
              <circle cx="0" cy="0" r="45" fill={corFundo} />
              <circle
                cx="0"
                cy="0"
                r="55"
                fill="none"
                stroke={corProgresso}
                strokeWidth="8"
                strokeDasharray="345.6"
                strokeDashoffset={(progresso / 100 - 1) * 345.6}
                strokeLinecap="round"
                transform="rotate(-90)"
              />
              <text
                className="fill-white font-['Inter'] font-bold"
                y="-15"
                textAnchor="middle"
              >
                {formatarTempo(tempo)}
              </text>
              <text
                className="font-['Segoe_UI_Emoji'] text-4xl"
                y="25"
                textAnchor="middle"
              >
                {
                  modoDescanso
                    ? cicloAtual === ciclos - 1 // É modo descanso, mas qual?
                      ? "🛌" // É o último ciclo = Descanso Longo
                      : "😌" // Não é o último ciclo = Descanso Curto
                    : "🍅" // Não é modo descanso = Foco
                }
              </text>
            </g>
          </svg>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap">
          {!ativo ? (
            <button
              onClick={iniciarNovaSessao}
              className={`${baseButtonClass} bg-yellow`}
            >
              <FaPlay />
            </button>
          ) : (
            <>
              <button
                onClick={() => setPausado(!pausado)}
                className={`${baseButtonClass} bg-gradient-to-tr from-[#1E90FF] to-[#4AA8FF]`}
              >
                {pausado ? (
                  <>
                    {" "}
                    <FaPlay />{" "}
                  </>
                ) : (
                  <>
                    <FaPause />
                  </>
                )}
              </button>
              <button
                onClick={resetar}
                className={`${baseButtonClass} bg-gradient-to-tr from-[#C52333] to-[#E74C3C]`}
              >
                <FaStop />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ciclos */}
      <div className="flex flex-wrap justify-center gap-2 max-w-[500px]">
        {renderizarCiclos()}
      </div>

      {/* Estatísticas */}
      <div className="flex gap-5 mt-6">
        <div className="flex flex-col items-center gap-4 mb-4 md:flex-row">
          <div className="w-[200px] bg-gradient-to-tr from-[#292535] to-[#3B2868] rounded-[10px] px-6 py-4 text-center shadow-lg shadow-black/30 md:w-auto">
            <span className="block text-base font-medium text-gray-200 mb-2">
              Tempo Estudado (Sessão)
            </span>
            <span className="block text-xl font-bold text-yellow">
              {formatarTempoParaExibicao(tempoTrabalhoSessaoAtual)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 mb-4 md:flex-row">
          <div className="w-[200px] bg-gradient-to-tr from-[#292535] to-[#3B2868] rounded-[10px] px-6 py-4 text-center shadow-lg shadow-black/30 md:w-auto">
            <span className="block text-base font-medium text-gray-200 mb-2">
              Tempo Descansado (Sessão)
            </span>
            <span className="block text-xl font-bold text-yellow">
              {formatarTempoParaExibicao(tempoDescansoSessaoAtual)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressoCircular;