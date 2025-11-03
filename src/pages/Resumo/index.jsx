// pages/Resumos/ResumosPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContexts";
import { ResumoAPI } from "../../services/ResumoAPI";

const ResumosPage = () => {
  const { currentUser, backendUser } = useAuth();

  const [resumos, setResumos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados do formulário
  const [resumoTitulo, setResumoTitulo] = useState("");
  const [resumoDescricao, setResumoDescricao] = useState("");
  const [editingResumo, setEditingResumo] = useState(null);
  const [selectedResumo, setSelectedResumo] = useState(null);

  // Estados para funcionalidades extras
  const [isListening, setIsListening] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState("base");
  const recognitionRef = useRef(null);

  // 🔄 Carregar resumos do usuário
  useEffect(() => {
    if (currentUser?.uid) {
      loadUserResumos();
    }
  }, [currentUser]);

  const loadUserResumos = async () => {
    if (!currentUser?.uid) return;

    setLoading(true);
    setError("");
    try {
      const result = await ResumoAPI.getUserResumos(currentUser.uid);

      if (result.success) {
        // Ordenar por data de criação (mais recentes primeiro)
        const sortedResumos = result.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setResumos(sortedResumos);
      } else {
        setError(result.error || "Erro ao carregar resumos");
      }
    } catch (err) {
      console.error("Erro ao carregar resumos:", err);
      setError("Falha ao carregar resumos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid) {
      setError("Usuário não autenticado");
      return;
    }

    if (!resumoTitulo || !resumoDescricao) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      setError("");

      const resumoData = {
        titulo: resumoTitulo,
        descricao: resumoDescricao,
      };

      const result = await ResumoAPI.createResumo(resumoData, currentUser.uid);

      if (result.success) {
        setModalVisible(false);
        resetForm();
        await loadUserResumos();
      } else {
        setError(result.error || "Erro ao criar resumo");
      }
    } catch (err) {
      console.error("Erro ao salvar resumo:", err);
      setError(err.message || "Erro ao salvar resumo");
    }
  };

  const handleEditClick = (resumo) => {
    setEditingResumo(resumo);
    setResumoTitulo(resumo.titulo);
    setResumoDescricao(resumo.descricao);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid || !editingResumo) return;

    try {
      const resumoData = {
        titulo: resumoTitulo,
        descricao: resumoDescricao,
      };

      const result = await ResumoAPI.updateResumo(
        editingResumo.id,
        resumoData,
        currentUser.uid
      );

      if (result.success) {
        setEditModalVisible(false);
        setEditingResumo(null);
        resetForm();
        await loadUserResumos();
      } else {
        setError(result.error || "Erro ao editar resumo");
      }
    } catch (err) {
      console.error("Erro ao editar resumo:", err);
      setError(err.message || "Erro ao editar resumo");
    }
  };

  const handleDeleteResumo = async (resumoId) => {
    if (
      !currentUser?.uid ||
      !window.confirm("Tem certeza que deseja excluir este resumo?")
    ) {
      return;
    }

    try {
      const result = await ResumoAPI.deleteResumo(resumoId, currentUser.uid);
      if (result.success) {
        await loadUserResumos();
        if (selectedResumo?.id === resumoId) {
          setSelectedResumo(null);
          setViewModalVisible(false);
        }
      } else {
        setError(result.error || "Erro ao excluir resumo");
      }
    } catch (err) {
      console.error("Erro ao excluir resumo:", err);
      setError("Erro ao excluir resumo");
    }
  };

  const handleViewResumo = (resumo) => {
    setSelectedResumo(resumo);
    setViewModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingResumo(null);
    resetForm();
  };

  const resetForm = () => {
    setResumoTitulo("");
    setResumoDescricao("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Reconhecimento de voz
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Este navegador não suporta a Web Speech API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setResumoDescricao((prev) => prev + " " + transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      const liveTextDiv = document.getElementById("live-text");
      if (liveTextDiv) liveTextDiv.innerText = interimTranscript;
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const liveTextDiv = document.getElementById("live-text");
      if (liveTextDiv) liveTextDiv.innerText = "";
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const copiarTexto = async () => {
    if (selectedResumo) {
      const textoCompleto = `${selectedResumo.titulo}\n\n${selectedResumo.descricao}`;
      try {
        await navigator.clipboard.writeText(textoCompleto);
        alert("Texto copiado para a área de transferência!");
      } catch (err) {
        console.error("Erro ao copiar texto: ", err);
        alert("Erro ao copiar texto");
      }
    }
  };

  const alternarTamanhoFonte = () => {
    if (tamanhoFonte === "sm") setTamanhoFonte("base");
    else if (tamanhoFonte === "base") setTamanhoFonte("lg");
    else setTamanhoFonte("sm");
  };

  const getClasseTamanhoFonte = () => {
    switch (tamanhoFonte) {
      case "sm":
        return "text-sm";
      case "base":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">

      <main className="flex flex-col lg:flex-row justify-center items-start p-4 lg:p-8 gap-8 w-full max-w-7xl mx-auto">

        {/* EDITOR DE RESUMOS */}
        <div className="w-full max-w-sm sm:max-w-md lg:w-[480px] bg-[#292535] rounded-2xl shadow-xl overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#FBCB4E]">
            <h3 className="text-xl font-semibold text-[#FBCB4E] m-0">
              {editingResumo ? "Editar Resumo" : "Criar Resumo"}
            </h3>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="resumo-titulo"
                className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
              >
                Título *
              </label>
              <input
                type="text"
                id="resumo-titulo"
                value={resumoTitulo}
                onChange={(e) => setResumoTitulo(e.target.value)}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                placeholder="Ex: Resumo de Matemática"
                maxLength={100}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {resumoTitulo.length}/100
              </div>
            </div>

            <div>
              <label
                htmlFor="resumo-descricao"
                className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
              >
                Conteúdo *
              </label>
              <textarea
                id="resumo-descricao"
                value={resumoDescricao}
                onChange={(e) => setResumoDescricao(e.target.value)}
                required
                rows="8"
                className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                placeholder="Digite o conteúdo do seu resumo aqui..."
              />
            </div>

            {isListening && (
              <div className="p-3 bg-[#423E51] rounded-lg border-l-4 border-green-500">
                <strong className="text-white text-sm font-semibold">
                  🔊 Texto ao vivo:
                </strong>
                <div
                  id="live-text"
                  className="mt-2 bg-[#2A2438] text-gray-200 p-3 rounded text-sm min-h-[60px]"
                ></div>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="button"
                onClick={() => setModalVisible(true)}
                disabled={!resumoTitulo || !resumoDescricao}
                className="flex-1 p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
              >
                {editingResumo ? "📝 Atualizar" : "💾 Salvar"} Resumo
              </button>

              <button
                type="button"
                onClick={handleMicClick}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isListening ? "⏹️ Parar Gravação" : "🎤 Gravar com Voz"}
              </button>
            </div>
          </form>

          {/* DICAS */}
          <div className="mt-6 p-4 bg-[#1a1a2e] rounded-lg border-l-4 border-[#3085AA]">
            <h4 className="text-[#3085AA] font-semibold mb-2">
              💡 Dicas para bons resumos
            </h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#FBCB4E]">•</span>
                <span>Use títulos claros e objetivos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FBCB4E]">•</span>
                <span>Organize o conteúdo em tópicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FBCB4E]">•</span>
                <span>Destaque pontos importantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FBCB4E]">•</span>
                <span>Use a gravação por voz para agilizar</span>
              </li>
            </ul>
          </div>
        </div>

        {/* LISTA DE RESUMOS */}
        <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none p-6 rounded-2xl bg-[#292535] shadow-xl max-h-[600px] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#FBCB4E]">
            <h3 className="text-xl font-semibold text-[#FBCB4E] m-0">
              📚 Meus Resumos
            </h3>
            <span className="text-sm text-gray-400 bg-[#1a1a2e] px-3 py-1 rounded-full">
              {resumos.length} {resumos.length === 1 ? "resumo" : "resumos"}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBCB4E] mb-4"></div>
              <p className="text-gray-400 text-sm">
                Carregando seus resumos...
              </p>
            </div>
          ) : resumos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumos.map((resumo) => (
                <div
                  key={resumo.id}
                  className="p-4 rounded-xl bg-[#1a1a2e] shadow-md transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg border-l-4 border-[#FBCB4E] cursor-pointer group"
                  onClick={() => handleViewResumo(resumo)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-[#FBCB4E] m-0 flex-1 pr-2">
                      {resumo.titulo}
                    </h4>
                    <span className="text-xs text-gray-400 bg-[#2A2438] px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      📅 {formatDate(resumo.createdAt)}
                    </span>
                  </div>

                  <div className="mb-4 min-h-[60px]">
                    <p className="text-gray-300 text-sm m-0 line-clamp-3 leading-relaxed">
                      {resumo.descricao}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 bg-[#2A2438] px-2 py-1 rounded">
                      👆 Clique para ler
                    </span>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(resumo);
                        }}
                        className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                        title="Editar resumo"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResumo(resumo.id);
                        }}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                        title="Excluir resumo"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-lg mb-2">
                Nenhum resumo encontrado
              </p>
              <p className="text-gray-500 text-sm">
                Comece criando seu primeiro resumo usando o editor ao lado!
              </p>
            </div>
          )}
        </div>

        {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
        {(modalVisible || editModalVisible) && (
          <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300">
            <div className="bg-[#292535] p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative text-white">
              <span
                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e]"
                onClick={
                  editModalVisible
                    ? handleCancelEdit
                    : () => setModalVisible(false)
                }
              >
                &times;
              </span>
              <h2 className="mt-0 text-[#FBCB4E] text-2xl font-semibold mb-6">
                {editModalVisible
                  ? "✏️ Confirmar Edição"
                  : "📝 Confirmar Resumo"}
              </h2>

              <div className="mb-6 p-4 bg-[#1a1a2e] rounded-lg border-l-4 border-[#FBCB4E]">
                <h3 className="text-lg font-semibold text-[#FBCB4E] mb-3">
                  {resumoTitulo}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm text-[#EBB2B6] font-semibold">
                      📄 Conteúdo:
                    </span>
                    <div className="text-white text-sm mt-2 bg-[#2A2438] p-4 rounded-lg whitespace-pre-wrap max-h-[300px] overflow-y-auto leading-relaxed">
                      {resumoDescricao}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={
                    editModalVisible
                      ? handleCancelEdit
                      : () => setModalVisible(false)
                  }
                  className="flex-1 p-3 rounded-lg border-2 border-gray-600 bg-transparent text-gray-300 text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:text-white hover:border-gray-500"
                >
                  ↩️ Cancelar
                </button>
                <button
                  type="button"
                  onClick={editModalVisible ? handleSaveEdit : handleSave}
                  className="flex-1 p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] hover:scale-105"
                >
                  {editModalVisible ? "💾 Atualizar" : "💾 Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE VISUALIZAÇÃO */}
        {viewModalVisible && selectedResumo && (
          <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300 p-4">
            <div className="bg-[#292535] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative text-white">
              <span
                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e] z-10"
                onClick={() => setViewModalVisible(false)}
              >
                &times;
              </span>

              {/* Cabeçalho */}
              <div className="p-6 border-b border-gray-600 bg-[#1a1a2e]">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-[#FBCB4E] m-0 pr-4">
                    {selectedResumo.titulo}
                  </h2>
                  <span className="text-sm text-gray-400 bg-[#2A2438] px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0">
                    📅 {formatDate(selectedResumo.createdAt)}
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div
                  className={`bg-[#1a1a2e] rounded-xl p-6 whitespace-pre-wrap break-words leading-relaxed border-2 border-[#423E51] ${getClasseTamanhoFonte()}`}
                >
                  {selectedResumo.descricao}
                </div>
              </div>

              {/* Rodapé com Ações */}
              <div className="flex justify-between items-center p-6 border-t border-gray-600 bg-[#1a1a2e]">
                <button
                  onClick={alternarTamanhoFonte}
                  className="bg-[#423E51] text-white px-4 py-2 rounded-lg hover:bg-[#4A4558] transition-colors flex items-center space-x-2 font-semibold"
                >
                  <span>🔠</span>
                  <span>
                    {tamanhoFonte === "sm"
                      ? "Pequeno"
                      : tamanhoFonte === "base"
                      ? "Médio"
                      : "Grande"}
                  </span>
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={copiarTexto}
                    className="bg-[#FBCB4E] text-[#292535] px-6 py-2 rounded-lg font-semibold hover:bg-[#ffd86e] transition-colors flex items-center space-x-2"
                  >
                    <span>📋</span>
                    <span>Copiar</span>
                  </button>

                  <button
                    onClick={() => {
                      handleEditClick(selectedResumo);
                      setViewModalVisible(false);
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <span>✏️</span>
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumosPage;
