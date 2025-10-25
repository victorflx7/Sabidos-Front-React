// src/pages/Resumos.jsx
import React, { useEffect, useState, useRef } from "react";
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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";

export default function Resumos() {
  const [resumos, setResumos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const autosaveTimeout = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) {
      setCarregando(false);
      return;
    }
    carregarResumos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function carregarResumos() {
    setCarregando(true);
    try {
      const q = query(collection(db, "resumos"), where("userId", "==", userId));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setResumos(list);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar resumos");
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(e) {
    if (e?.preventDefault) e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }
    try {
      if (modoEdicao && idEdicao) {
        const ref = doc(db, "resumos", idEdicao);
        await updateDoc(ref, {
          titulo,
          descricao,
          atualizadoEm: serverTimestamp(),
        });
        setResumos(prev => prev.map(r => r.id === idEdicao ? { ...r, titulo, descricao } : r));
        toast.success("Resumo atualizado");
      } else {
        const docRef = await addDoc(collection(db, "resumos"), {
          userId,
          titulo,
          descricao,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
        setResumos(prev => [...prev, { id: docRef.id, titulo, descricao }]);
        toast.success("Resumo criado");
      }
      resetarFormulario();
    } catch (err) {
      console.error(err);
      toast.error("Falha ao salvar resumo");
    }
  }

  async function deletarResumo(id) {
    if (!confirm("Deseja excluir este resumo?")) return;
    try {
      await deleteDoc(doc(db, "resumos", id));
      setResumos(prev => prev.filter(r => r.id !== id));
      toast.success("Resumo excluído");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir");
    }
  }

  function editarResumo(id) {
    const r = resumos.find(x => x.id === id);
    if (!r) return;
    setTitulo(r.titulo || "");
    setDescricao(r.descricao || "");
    setModoEdicao(true);
    setIdEdicao(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetarFormulario() {
    setTitulo("");
    setDescricao("");
    setModoEdicao(false);
    setIdEdicao(null);
  }

  // AUTOSAVE
  useEffect(() => {
    if (!titulo.trim() && !descricao.trim()) return;
    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = setTimeout(() => {
      if (titulo.trim() && descricao.trim()) handleSubmit({ preventDefault: () => {} });
    }, 15000);
    return () => clearTimeout(autosaveTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titulo, descricao]);

  // Web Speech
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setDescricao(prev => (prev ? prev + " " + t : t));
        } else {
          interim += t;
        }
      }
      const el = document.getElementById("live-text");
      if (el) el.innerText = interim;
    };

    recognitionRef.current = recognition;
    // cleanup
    return () => {
      recognition.stop?.();
    };
  }, []);

  function handleMicClick() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const el = document.getElementById("live-text");
      if (el) el.innerText = "";
      recognitionRef.current.start();
    }
    setIsListening(s => !s);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400">Meus Resumos</h1>
        <p className="text-pink-300 mt-2">{modoEdicao ? "Editando resumo" : "Adicione novos conhecimentos"}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="bg-[#2E293D] rounded-xl p-4 shadow-md border border-gray-700 max-h-[70vh] overflow-auto">
          <h2 className="text-yellow-400 text-xl font-semibold mb-4">Seus Resumos</h2>

          {carregando ? (
            <div className="text-pink-300 text-center py-6">Carregando...</div>
          ) : resumos.length === 0 ? (
            <div className="text-center py-6 text-pink-300">
              <p>Nenhum resumo encontrado</p>
              <button onClick={resetarFormulario} className="mt-4 px-4 py-2 bg-yellow-400 rounded-md font-semibold text-black">Criar primeiro resumo</button>
            </div>
          ) : (
            <div className="space-y-4">
              {resumos.map(r => (
                <article key={r.id} className="bg-[#3A3550] rounded-lg p-4 border-l-4 border-pink-300 hover:translate-y-[-4px] transition">
                  <div className="flex justify-between items-start">
                    <h3 className="text-yellow-400 font-semibold text-lg">{r.titulo}</h3>
                    <span className="bg-sky-800 text-white text-sm px-2 py-1 rounded-full">{r.data || ""}</span>
                  </div>
                  <p className="text-white mt-2 line-clamp-3">{r.descricao}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button aria-label="Editar" onClick={() => editarResumo(r.id)} className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center">✎</button>
                    <button aria-label="Excluir" onClick={() => deletarResumo(r.id)} className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">🗑</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>

        <section className="lg:col-span-2 bg-[#2E293D] rounded-xl p-6 shadow-md border border-gray-700">
          <h2 className="text-yellow-400 text-2xl font-semibold mb-4">{modoEdicao ? "Editar Resumo" : "Novo Resumo"}</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Título do resumo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                maxLength={100}
                className="w-full p-3 rounded-md bg-[#1a1a2e] border border-gray-600 text-white placeholder-gray-400"
              />
              <div className="text-right text-sm text-pink-300 mt-1">{titulo.length}/100</div>
            </div>

            <div>
              <textarea
                rows={12}
                placeholder="Digite o conteúdo do resumo aqui..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-4 rounded-md bg-[#1a1a2e] border border-gray-600 text-white placeholder-gray-400 resize-vertical"
              />
            </div>

            {isListening && (
              <div className="mt-2 text-sm">
                <strong className="text-white">Texto ao vivo:</strong>
                <p id="live-text" className="bg-white/90 text-black p-2 rounded mt-2 min-h-[40px]"></p>
              </div>
            )}

            <div className="flex items-center gap-4 justify-end mt-2">
              <button type="button" onClick={handleMicClick}
                className={`px-4 py-3 rounded-md font-semibold text-white ${isListening ? "bg-red-600" : "bg-green-600"}`}>
                {isListening ? "Parar 🎤" : "Iniciar 🎤"}
              </button>

              <button type="submit" className="px-6 py-3 bg-yellow-400 text-black rounded-md font-bold">
                {modoEdicao ? "Atualizar" : "Salvar"} Resumo
              </button>

              {modoEdicao && (
                <button type="button" onClick={resetarFormulario} className="px-4 py-3 bg-gray-600 text-white rounded-md">
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
