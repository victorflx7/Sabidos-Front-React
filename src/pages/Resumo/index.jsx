import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";

const Resumo = () => {
  const [resumos, setResumos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const autosaveTimeout = useRef(null);

  const recognitionRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (userId) {
      carregarResumos();
    }
  }, [userId]);

  const carregarResumos = async () => {
    try {
      setCarregando(true);
      const q = query(collection(db, "resumos"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const resumosCarregados = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResumos(resumosCarregados);
    } catch (error) {
      console.error("Erro ao carregar resumos: ", error);
      alert("Ocorreu um erro ao carregar seus resumos");
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!titulo.trim()) {
      alert("Por favor, insira um título para seu resumo");
      return;
    }

    if (!descricao.trim()) {
      alert("Por favor, insira o conteúdo do resumo");
      return;
    }

    const dataAtual = formatarData(new Date());

    try {
      if (modoEdicao && idEdicao) {
        await updateDoc(doc(db, "resumos", idEdicao), {
          titulo,
          descricao,
          data: dataAtual,
          atualizadoEm: new Date().toISOString(),
        });

        setResumos(
          resumos.map((resumo) =>
            resumo.id === idEdicao
              ? { ...resumo, titulo, descricao, data: dataAtual }
              : resumo
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "resumos"), {
          userId,
          titulo,
          descricao,
          data: dataAtual,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
        });

        setResumos([
          ...resumos,
          {
            id: docRef.id,
            titulo,
            descricao,
            data: dataAtual,
          },
        ]);
      }

      resetarFormulario();
    } catch (error) {
      console.error("Erro ao salvar resumo: ", error);
      alert("Ocorreu um erro ao salvar seu resumo");
    }
  };

  const deletarResumo = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este resumo?")) return;

    try {
      await deleteDoc(doc(db, "resumos", id));
      setResumos(resumos.filter((resumo) => resumo.id !== id));
    } catch (error) {
      console.error("Erro ao deletar resumo: ", error);
      alert("Ocorreu um erro ao excluir o resumo");
    }
  };

  const editarResumo = (id) => {
    const resumo = resumos.find((r) => r.id === id);
    if (resumo) {
      setTitulo(resumo.titulo);
      setDescricao(resumo.descricao);
      setModoEdicao(true);
      setIdEdicao(id);
      document
        .querySelector(".editor-container")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatarData = (data) => {
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    return `${dia}/${mes}`;
  };

  const resetarFormulario = () => {
    setTitulo("");
    setDescricao("");
    setModoEdicao(false);
    setIdEdicao(null);
  };

  // Auto save
  useEffect(() => {
    if (!titulo.trim() && !descricao.trim()) return;

    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);

    autosaveTimeout.current = setTimeout(() => {
      if (titulo.trim() && descricao.trim()) {
        handleSubmit({ preventDefault: () => {} });
      }
    }, 15000);

    return () => clearTimeout(autosaveTimeout.current);
  }, [titulo, descricao]);

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
          setDescricao((prev) => prev + " " + transcript);
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

  return (
    <div className="min-h-screen text-white p-3 md:p-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 min-h-[350px]">
          <aside className="lg:col-span-1 bg-[#292535] rounded-lg p-3 lg:p-4 shadow-xl border border-[#423E51] flex flex-col h-full order-2 lg:order-1">
            <h2 className="text-xl font-bold text-[#FBCA4E] mb-4 pb-2 border-b border-gray-600">
              Seus Resumos
            </h2>

            <div className="flex-1 overflow-y-auto">
              {carregando ? (
                <div className="text-center py-6 text-pink-200">
                  Carregando...
                </div>
              ) : resumos.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-pink-200 mb-3">Nenhum resumo encontrado</p>
                  <button
                    onClick={resetarFormulario}
                    className="bg-[#FBCA4E] text-[#1D1B2A] px-4 py-2 rounded-lg font-semibold hover:bg-[#DE9530] transition-colors"
                  >
                    Criar primeiro resumo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumos.map((resumo) => (
                    <article
                      key={resumo.id}
                      className="bg-[#423E51] rounded-lg p-3 shadow-lg border-l-4 border-pink-300 hover:border-pink-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#FBCA4E] font-semibold text-base flex-1 mr-2">
                          {resumo.titulo}
                        </h3>
                        <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {resumo.data}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-gray-200 text-sm line-clamp-3">
                          {resumo.descricao}
                        </p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => editarResumo(resumo.id)}
                          className="w-7 h-7 bg-[#FBCA4E] text-[#1D1B2A] rounded-full flex items-center justify-center hover:bg-[#DE9530] transition-colors"
                          aria-label="Editar resumo"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => deletarResumo(resumo.id)}
                          className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          aria-label="Excluir resumo"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <section className="lg:col-span-2 bg-[#292535] rounded-lg p-3 lg:p-4 shadow-xl border border-[#423E51] flex flex-col h-full order-1 lg:order-2">
            <h2 className="text-xl font-bold text-[#FBCA4E] mb-4 pb-2 border-b border-gray-600">
              {modoEdicao ? "Editar Resumo" : "Novo Resumo"}
            </h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-4 flex flex-col">
                <div>
                  <input
                    type="text"
                    className="w-full bg-[#1D1B2A] border border-gray-600 rounded-lg px-3 py-2 text-white text-base placeholder-gray-400 focus:outline-none focus:border-[#FBCA4E] focus:ring-1 focus:ring-[#FBCA4E] focus:ring-opacity-30 transition-all"
                    placeholder="Título do resumo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    maxLength={100}
                  />
                  <div className="flex justify-end mt-1">
                    <small className="text-pink-200 text-xs">
                      {titulo.length}/100
                    </small>
                  </div>
                </div>

                <div className="flex-1 lg:h-[300px]">
                  <textarea
                    className="w-full h-full bg-[#1D1B2A] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#FBCA4E] focus:ring-1 focus:ring-[#FBCA4E] focus:ring-opacity-30 transition-all resize-none min-h-[200px] mb-30"
                    placeholder="Digite o conteúdo do resumo aqui..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                {isListening && (
                  <div className="p-3 bg-[#423E51] rounded-lg">
                    <strong className="text-white text-sm font-semibold">
                      Texto ao vivo:
                    </strong>
                    <div
                      id="live-text"
                      className="mt-2 bg-gray-600 text-gray-200 p-2 rounded min-h-[50px] text-sm"
                    ></div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end items-center mt-4 pt-4 border-t border-gray-600 mt-6">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`w-full sm:w-32 px-4 py-3 rounded-lg font-semibold text-white transition-colors ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isListening ? "Parar 🎤" : "Iniciar 🎤"}
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  {modoEdicao && (
                    <button
                      type="button"
                      onClick={resetarFormulario}
                      className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#423E51] transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none bg-[#FBCA4E] text-[#1D1B2A] px-4 py-3 rounded-lg font-semibold hover:bg-[#DE9530] transition-colors"
                  >
                    {modoEdicao ? "Atualizar" : "Salvar"} Resumo
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Resumo;