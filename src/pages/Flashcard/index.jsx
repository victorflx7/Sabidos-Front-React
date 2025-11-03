// pages/Flashcards/FlashcardsPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContexts";
import { FlashCardAPI } from "../../services/FlashCardAPI";

const FlashcardsPage = () => {
  const { currentUser, backendUser } = useAuth();

  const [flashcards, setFlashcards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados do formulário
  const [flashcardTitle, setFlashcardTitle] = useState("");
  const [flashcardFront, setFlashcardFront] = useState("");
  const [flashcardBack, setFlashcardBack] = useState("");
  const [editingFlashcard, setEditingFlashcard] = useState(null);

  // Estados para visualização
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);

  // 🔄 Carregar flashcards do usuário
  useEffect(() => {
    if (currentUser?.uid) {
      loadUserFlashcards();
    }
  }, [currentUser]);

  const loadUserFlashcards = async () => {
    if (!currentUser?.uid) return;

    setLoading(true);
    setError("");
    try {
      const result = await FlashCardAPI.getUserFlashcards(currentUser.uid);

      if (result.success) {
        // Ordenar por data de criação (mais recentes primeiro)
        const sortedFlashcards = result.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFlashcards(sortedFlashcards);
      } else {
        setError(result.error || "Erro ao carregar flashcards");
      }
    } catch (err) {
      console.error("Erro ao carregar flashcards:", err);
      setError("Falha ao carregar flashcards");
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

    if (!flashcardTitle || !flashcardFront || !flashcardBack) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      setError("");

      const flashcardData = {
        title: flashcardTitle,
        front: flashcardFront,
        back: flashcardBack,
      };

      const result = await FlashCardAPI.createFlashcard(
        flashcardData,
        currentUser.uid
      );

      if (result.success) {
        setModalVisible(false);
        resetForm();
        await loadUserFlashcards();
      } else {
        setError(result.error || "Erro ao criar flashcard");
      }
    } catch (err) {
      console.error("Erro ao salvar flashcard:", err);
      setError(err.message || "Erro ao salvar flashcard");
    }
  };

  const handleEditClick = (flashcard) => {
    setEditingFlashcard(flashcard);
    setFlashcardTitle(flashcard.title);
    setFlashcardFront(flashcard.front);
    setFlashcardBack(flashcard.back);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid || !editingFlashcard) return;

    try {
      const flashcardData = {
        title: flashcardTitle,
        front: flashcardFront,
        back: flashcardBack,
      };

      const result = await FlashCardAPI.updateFlashcard(
        editingFlashcard.id,
        flashcardData,
        currentUser.uid
      );

      if (result.success) {
        setEditModalVisible(false);
        setEditingFlashcard(null);
        resetForm();
        await loadUserFlashcards();
      } else {
        setError(result.error || "Erro ao editar flashcard");
      }
    } catch (err) {
      console.error("Erro ao editar flashcard:", err);
      setError(err.message || "Erro ao editar flashcard");
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    if (
      !currentUser?.uid ||
      !window.confirm("Tem certeza que deseja excluir este flashcard?")
    ) {
      return;
    }

    try {
      const result = await FlashCardAPI.deleteFlashcard(
        flashcardId,
        currentUser.uid
      );
      if (result.success) {
        await loadUserFlashcards();
        if (selectedFlashcard?.id === flashcardId) {
          setSelectedFlashcard(null);
          setViewMode("grid");
        }
      } else {
        setError(result.error || "Erro ao excluir flashcard");
      }
    } catch (err) {
      console.error("Erro ao excluir flashcard:", err);
      setError("Erro ao excluir flashcard");
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingFlashcard(null);
    resetForm();
  };

  const resetForm = () => {
    setFlashcardTitle("");
    setFlashcardFront("");
    setFlashcardBack("");
  };

  const toggleFlip = (flashcardId, e) => {
    e?.stopPropagation();
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(flashcardId)) {
        newSet.delete(flashcardId);
      } else {
        newSet.add(flashcardId);
      }
      return newSet;
    });
  };

  const handleCardClick = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setSelectedFlashcard(null);
    setViewMode("grid");
    setFlippedCards(new Set());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">

      <main className="flex flex-col lg:flex-row justify-center items-start p-4 lg:p-8 gap-8 w-full max-w-7xl mx-auto">


        {/* EDITOR DE FLASHCARDS */}
        <div className="w-full max-w-sm sm:max-w-md lg:w-[480px] bg-[#292535] rounded-2xl shadow-xl overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#FBCB4E]">
            <h3 className="text-xl font-semibold text-[#FBCB4E] m-0">
              Criar Flashcard
            </h3>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="flashcard-title"
                className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
              >
                Título *
              </label>
              <input
                type="text"
                id="flashcard-title"
                value={flashcardTitle}
                onChange={(e) => setFlashcardTitle(e.target.value)}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                placeholder="Ex: Fórmula de Bhaskara"
                maxLength={50}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {flashcardTitle.length}/50
              </div>
            </div>

            <div>
              <label
                htmlFor="flashcard-front"
                className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
              >
                Frente *
              </label>
              <textarea
                id="flashcard-front"
                value={flashcardFront}
                onChange={(e) => setFlashcardFront(e.target.value)}
                required
                rows="4"
                className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                placeholder="Pergunta ou conceito..."
              />
            </div>

            <div>
              <label
                htmlFor="flashcard-back"
                className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
              >
                Verso *
              </label>
              <textarea
                id="flashcard-back"
                value={flashcardBack}
                onChange={(e) => setFlashcardBack(e.target.value)}
                required
                rows="4"
                className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                placeholder="Resposta ou explicação..."
              />
            </div>

            <button
              type="button"
              onClick={() => setModalVisible(true)}
              disabled={!flashcardTitle || !flashcardFront || !flashcardBack}
              className="w-full p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] disabled:bg-gray-500 disabled:cursor-not-allowed mt-4"
            >
              Criar Flashcard
            </button>
          </form>

          {/* DICAS */}
          <div className="mt-6 p-4 bg-[#1a1a2e] rounded-lg border-l-4 border-[#3085AA]">
            <h4 className="text-[#3085AA] font-semibold mb-2">💡 Dicas</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Use perguntas objetivas na frente</li>
              <li>• Respostas claras no verso</li>
              <li>• Revise regularmente</li>
            </ul>
          </div>
        </div>

        {/* LISTA DE FLASHCARDS */}
        <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none p-6 rounded-2xl bg-[#292535] shadow-xl max-h-[600px] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#FBCB4E]">
            <h3 className="text-xl font-semibold text-[#FBCB4E] m-0">
              Meus Flashcards
            </h3>
            <span className="text-sm text-gray-400">
              {flashcards.length} card(s)
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBCB4E]"></div>
              <p className="text-gray-400 mt-2">Carregando flashcards...</p>
            </div>
          ) : viewMode === "detail" && selectedFlashcard ? (
            <div className="visualizacao-detalhada">
              <button
                onClick={handleBackToList}
                className="btn-voltar mb-4 text-[#FBCB4E] hover:text-[#ffd86e] transition-colors"
              >
                ← Voltar para lista
              </button>
              <div className="card-detalhado p-6 bg-[#1a1a2e] rounded-xl border-l-4 border-[#FBCB4E]">
                <h2 className="text-2xl font-bold text-[#FBCB4E] mb-4">
                  {selectedFlashcard.title}
                </h2>
                <div className="lados-card grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="lado-card">
                    <h3 className="text-lg font-semibold text-[#EBB2B6] mb-3 pb-2 border-b border-gray-600">
                      Frente
                    </h3>
                    <div className="conteudo-card bg-[#2A2438] p-4 rounded-lg text-white leading-relaxed whitespace-pre-wrap">
                      {selectedFlashcard.front}
                    </div>
                  </div>
                  <div className="lado-card">
                    <h3 className="text-lg font-semibold text-[#EBB2B6] mb-3 pb-2 border-b border-gray-600">
                      Verso
                    </h3>
                    <div className="conteudo-card bg-[#2A2438] p-4 rounded-lg text-white leading-relaxed whitespace-pre-wrap">
                      {selectedFlashcard.back}
                    </div>
                  </div>
                </div>
                <div className="card-metadata mt-6 pt-4 border-t border-gray-600 text-right">
                  <span className="text-sm text-gray-400">
                    Criado em: {formatDate(selectedFlashcard.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : flashcards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((flashcard) => (
                <div
                  key={flashcard.id}
                  className={`p-4 rounded-xl bg-[#1a1a2e] shadow-md transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg border-l-4 border-[#FBCB4E] cursor-pointer group ${
                    flippedCards.has(flashcard.id) ? "bg-[#2A2438]" : ""
                  }`}
                  onClick={() => handleCardClick(flashcard)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-[#FBCB4E] m-0 flex-1">
                      {flashcard.title}
                    </h4>
                    <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      {formatDate(flashcard.createdAt)}
                    </span>
                  </div>

                  <div className="conteudo-card mb-4 min-h-[60px]">
                    <div
                      className={`transition-all duration-300 ${
                        flippedCards.has(flashcard.id)
                          ? "opacity-0 h-0"
                          : "opacity-100"
                      }`}
                    >
                      <p className="text-gray-300 text-sm m-0 line-clamp-3">
                        {flashcard.front}
                      </p>
                    </div>
                    <div
                      className={`transition-all duration-300 ${
                        flippedCards.has(flashcard.id)
                          ? "opacity-100"
                          : "opacity-0 h-0"
                      }`}
                    >
                      <p className="text-gray-300 text-sm m-0 line-clamp-3">
                        {flashcard.back}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(flashcard.id, e);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2 text-sm flex items-center gap-1"
                      title={
                        flippedCards.has(flashcard.id)
                          ? "Mostrar frente"
                          : "Mostrar verso"
                      }
                    >
                      🔄 {flippedCards.has(flashcard.id) ? "Frente" : "Verso"}
                    </button>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(flashcard);
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2"
                        title="Editar flashcard"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFlashcard(flashcard.id);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                        title="Excluir flashcard"
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
              <div className="text-6xl mb-4">🃏</div>
              <p className="text-gray-400 text-lg">
                Nenhum flashcard encontrado.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Preencha o formulário ao lado para criar seu primeiro flashcard!
              </p>
            </div>
          )}
        </div>

        {/* MODAL DE CRIAÇÃO */}
        {modalVisible && (
          <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300">
            <div className="bg-[#292535] p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-white">
              <span
                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e]"
                onClick={() => setModalVisible(false)}
              >
                &times;
              </span>
              <h2 className="mt-0 text-[#FBCB4E] text-2xl font-semibold mb-6">
                Confirmar Flashcard
              </h2>

              <div className="mb-6 p-4 bg-[#1a1a2e] rounded-lg border-l-4 border-[#FBCB4E]">
                <h3 className="text-lg font-semibold text-[#FBCB4E] mb-3">
                  {flashcardTitle}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm text-[#EBB2B6] font-semibold">
                      Frente:
                    </span>
                    <p className="text-white text-sm mt-1 bg-[#2A2438] p-2 rounded whitespace-pre-wrap">
                      {flashcardFront}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-[#EBB2B6] font-semibold">
                      Verso:
                    </span>
                    <p className="text-white text-sm mt-1 bg-[#2A2438] p-2 rounded whitespace-pre-wrap">
                      {flashcardBack}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="flex-1 p-3 rounded-lg border-2 border-gray-600 bg-transparent text-gray-300 text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e]"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE EDIÇÃO */}
        {editModalVisible && editingFlashcard && (
          <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300">
            <div className="bg-[#292535] p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-white">
              <span
                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e]"
                onClick={handleCancelEdit}
              >
                &times;
              </span>
              <h2 className="mt-0 text-[#FBCB4E] text-2xl font-semibold mb-6">
                Editar Flashcard
              </h2>

              <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-400 mb-1">
                  Editando flashcard:
                </p>
                <p className="text-white font-semibold text-sm">
                  "{editingFlashcard.title}"
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Criado em: {formatDate(editingFlashcard.createdAt)}
                </p>
              </div>

              <form className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="edit-flashcard-title"
                    className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
                  >
                    Título *
                  </label>
                  <input
                    type="text"
                    id="edit-flashcard-title"
                    value={flashcardTitle}
                    onChange={(e) => setFlashcardTitle(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                    placeholder="Ex: Fórmula de Bhaskara"
                    maxLength={50}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {flashcardTitle.length}/50
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-flashcard-front"
                    className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
                  >
                    Frente *
                  </label>
                  <textarea
                    id="edit-flashcard-front"
                    value={flashcardFront}
                    onChange={(e) => setFlashcardFront(e.target.value)}
                    required
                    rows="4"
                    className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                    placeholder="Pergunta ou conceito..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-flashcard-back"
                    className="text-base font-semibold text-[#FBCB4E] text-left block mb-2"
                  >
                    Verso *
                  </label>
                  <textarea
                    id="edit-flashcard-back"
                    value={flashcardBack}
                    onChange={(e) => setFlashcardBack(e.target.value)}
                    required
                    rows="4"
                    className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                    placeholder="Resposta ou explicação..."
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 p-3 rounded-lg border-2 border-gray-600 bg-transparent text-gray-300 text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={
                      !flashcardTitle || !flashcardFront || !flashcardBack
                    }
                    className="flex-1 p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FlashcardsPage;
