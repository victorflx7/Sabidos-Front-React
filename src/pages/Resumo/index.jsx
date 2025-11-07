import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContexts";
import { db } from "../../firebase/FirebaseConfig";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ResumoPage = () => {
  const [carregando, setCarregando] = useState(true);
  const { currentUser, backendUser } = useAuth();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

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
    if (!currentUser?.uid) {
      setCarregando(false);
      return;
    }
    loadUserResumos();
  }, [currentUser]);

  const loadUserResumos = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const q = query(collection(db, "resumos"), where("userId", "==", userId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const loadedResumos = [];
        querySnapshot.forEach((doc) => {
          loadedResumos.push({
            id: doc.id,
            ...doc.data()
          });
        });
        // Ordena por data de criação (mais novos primeiro)
        loadedResumos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setResumos(loadedResumos);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Erro ao carregar resumos:", err);
      setError("Falha ao carregar resumos");
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

      await addDoc(collection(db, "resumos"), {
        userId: userId,
        titulo: resumoTitulo,
        descricao: resumoDescricao,
        data: formatarData(new Date()),
        createdAt: new Date().toISOString()
      });

      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar resumo:", err);
      setError("Ocorreu um erro ao salvar o resumo!");
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
    
    if (!currentUser?.uid) {
      setError("Usuário não autenticado");
      return;
    }

    if (!editingResumo) return;

    try {
      await updateDoc(doc(db, "resumos", editingResumo.id), {
        titulo: resumoTitulo,
        descricao: resumoDescricao,
        data: formatarData(new Date()),
        atualizadoEm: new Date().toISOString()
      });

      setEditModalVisible(false);
      setEditingResumo(null);
      resetForm();
    } catch (err) {
      console.error("Erro ao editar resumo:", err);
      setError("Ocorreu um erro ao editar o resumo!");
    }
  };

  const handleDeleteResumo = async (resumoId) => {
    if (!currentUser?.uid) {
      setError("Usuário não autenticado");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este resumo?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "resumos", resumoId));
      if (selectedResumo?.id === resumoId) {
        setSelectedResumo(null);
        setViewModalVisible(false);
      }
    } catch (err) {
      console.error("Erro ao excluir resumo:", err);
      setError("Ocorreu um erro ao excluir o resumo!");
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

  const formatarData = (date) => {
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${dia}/${mes}`;
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
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Container principal com mesma altura */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 min-h-[600px]">

          {/* Editor - Área maior */}
          <section className="lg:col-span-2 bg-[#292535] rounded-xl p-6 md:p-8 shadow-2xl border border-[#423E51] flex flex-col h-full">
            <h2 className="text-2xl font-bold text-[#FBCA4E] mb-6 pb-3 border-b border-gray-600">
              {editingResumo ? "Editar Resumo" : "Novo Resumo"}
            </h2>
            <form
              onSubmit={editingResumo ? handleSaveEdit : handleSave}
              className="flex-1 flex flex-col"
            >
              <div className="space-y-6 flex-1">
                {/* Título */}
                <div>
                  <input
                    type="text"
                    className="w-full bg-[#1D1B2A] border-2 border-gray-600 rounded-xl px-4 py-3 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-[#FBCA4E] focus:ring-2 focus:ring-[#FBCA4E] focus:ring-opacity-30 transition-all"
                    placeholder="Título do resumo"
                    value={resumoTitulo}
                    onChange={(e) => setResumoTitulo(e.target.value)}
                    maxLength={100}
                  />
                  <div className="flex justify-end mt-1">
                    <small className="text-pink-200 text-sm">
                      {resumoTitulo.length}/100
                    </small>
                  </div>
                </div>

                {/* Descrição - Área bem maior */}
                <div className="flex-1">
                  <textarea
                    className="w-full h-full bg-[#1D1B2A] border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#FBCA4E] focus:ring-2 focus:ring-[#FBCA4E] focus:ring-opacity-30 transition-all resize-none min-h-[300px] text-base leading-relaxed"
                    placeholder="Digite o conteúdo do resumo aqui..."
                    value={resumoDescricao}
                    onChange={(e) => setResumoDescricao(e.target.value)}
                    rows={12}
                  />
                </div>

                {/* Live Text from Speech Recognition */}
                {isListening && (
                  <div className="p-4 bg-[#423E51] rounded-lg">
                    <strong className="text-white text-sm font-semibold">
                      Texto ao vivo:
                    </strong>
                    <div
                      id="live-text"
                      className="mt-2 bg-gray-600 text-gray-200 p-3 rounded min-h-[60px] text-sm"
                    ></div>
                  </div>
                )}
              </div>

              {/* Actions - Fica na parte inferior */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end items-center mt-6 pt-6 border-t border-gray-600">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`w-full sm:w-40 px-6 py-4 rounded-lg font-semibold text-white transition-colors ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isListening ? "Parar 🎤" : "Iniciar 🎤"}
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                  {editingResumo && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 sm:flex-none bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#423E51] transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!resumoTitulo || !resumoDescricao}
                    className="flex-1 sm:flex-none bg-[#FBCA4E] text-[#1D1B2A] px-6 py-4 rounded-lg font-semibold hover:bg-[#DE9530] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {editingResumo ? "Atualizar" : "Salvar"} Resumo
                  </button>
                </div>
              </div>
            </form>

            {/* DICAS - Mantida no editor */}
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
          </section>
          {/* Sidebar - Lista de Resumos (Estilo Agenda) */}
          <aside className="lg:col-span-1 bg-[#292535] rounded-xl p-6 shadow-2xl border border-[#423E51] flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-[#FBCA4E]">
              <h3 className="text-xl font-semibold text-[#FBCA4E] m-0">
                Seus Resumos
              </h3>
              <span className="text-sm text-gray-400 bg-[#1a1a2e] px-3 py-1 rounded-full">
                {resumos.length} {resumos.length === 1 ? "resumo" : "resumos"}
              </span>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBCA4E] mb-4"></div>
                  <p className="text-gray-400 text-sm">
                    Carregando seus resumos...
                  </p>
                </div>
              ) : resumos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-400 text-lg mb-2">
                    Nenhum resumo encontrado
                  </p>
                  <p className="text-gray-500 text-sm">
                    Comece criando seu primeiro resumo!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumos.map((resumo) => (
                    <article
                      key={resumo.id}
                      className="bg-[#423E51] rounded-lg p-4 shadow-lg border-l-4 border-pink-300 hover:border-pink-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleViewResumo(resumo)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-[#FBCA4E] font-semibold text-lg flex-1 mr-3">
                          {resumo.titulo}
                        </h3>
                        <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {resumo.data}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-200 text-sm line-clamp-3">
                          {resumo.descricao}
                        </p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(resumo);
                          }}
                          className="w-8 h-8 bg-[#F29437] text-[#1D1B2A] rounded-full flex items-center justify-center hover:bg-[#D97818] transition-colors"
                          aria-label="Editar resumo"
                        >
                          <img
                            src="IconesSVG/lapis.svg"
                            alt="Editar resumo"
                            className="w-4 h-4"
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResumo(resumo.id);
                          }}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-[#A81F1F] transition-colors"
                          aria-label="Excluir resumo"
                        >
                          <img
                            src="IconesSVG/lixeira.svg"
                            alt="Deletar resumo"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* MODAL DE VISUALIZAÇÃO APENAS */}
      {viewModalVisible && selectedResumo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#292535] rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden border border-[#423E51]">
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-600">
              <h3 className="text-xl font-bold text-[#FBCA4E]">
                {selectedResumo.titulo}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full">
                  {selectedResumo.data}
                </span>
                <button
                  onClick={() => setViewModalVisible(false)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-[#A81F1F] transition-colors"
                  aria-label="Fechar"
                >
                  <img
                    src="IconesSVG/X.svg"
                    alt="Fechar visualização do resumo"
                    className="w-5"
                  />
                </button>
              </div>
            </div>

            {/* Conteúdo do Resumo */}
            <div className="p-6 h-[400px]">
              <div
                className={`bg-[#1D1B2A] rounded-xl p-6 whitespace-pre-wrap break-words leading-relaxed ${getClasseTamanhoFonte()} overflow-y-auto h-full`}
              >
                {selectedResumo.descricao}
              </div>
            </div>

            {/* Rodapé com Botões */}
            <div className="flex justify-between items-center p-6 border-t border-gray-600">
              {/* Botão de Tamanho de Fonte */}
              <button
                onClick={alternarTamanhoFonte}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <img
                  src="IconesSVG/TamanhoTexto.svg"
                  alt="Alterar tamanho do Texto"
                  className="w-5"
                />
                <span>Tamanho</span>
              </button>

              {/* Botões Copiar e Editar */}
              <div className="flex space-x-3">
                <button
                  onClick={copiarTexto}
                  className="bg-[#FBCA4E] text-[#1D1B2A] px-6 py-3 rounded-lg font-semibold hover:bg-[#DE9530] transition-colors flex items-center space-x-2"
                >
                  <img
                    src="IconesSVG/copiar.svg"
                    alt="Copiar"
                    className="w-4 h-4"
                  />
                  <span>Copiar</span>
                </button>

                <button
                  onClick={() => {
                    handleEditClick(selectedResumo);
                    setViewModalVisible(false);
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <img
                    src="IconesSVG/lapis.svg"
                    alt="Editar"
                    className="w-4 h-4"
                  />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumoPage;