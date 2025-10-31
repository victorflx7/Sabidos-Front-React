// index.jsx (MODIFICADO - Agora suporta Cadastro com E-mail e Google)
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, // 💡 Importar Provedor Google
  signInWithPopup // 💡 Importar método de Popup
} from "firebase/auth";
import { db } from "../../firebase/FirebaseConfig";
import { API_BASE_URL } from "../../services/Api"; 

// Função auxiliar para sincronizar o usuário no SQL
const syncUserToBackend = async (user, name = null) => {
    try {
        const syncDto = {
            FirebaseUid: user.uid,
            Email: user.email,
            Name: name || user.displayName
        };

        const res = await fetch(`${API_BASE_URL}/user/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(syncDto)
        });

        if (!res.ok) {
            throw new Error(`Erro na API de sincronização: ${res.status}`);
        }
        console.log("Usuário sincronizado com sucesso no SQL Server via /sync.");
    } catch (apiError) {
        console.warn("Erro na sincronização com a API (SQL):", apiError);
    }
};

const Cadastro = () => {
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const validarFormulario = () => {
    if (!dadosUsuario.nome.trim()) throw new Error("Informe seu nome");
    if (!dadosUsuario.email.includes("@")) throw new Error("E-mail inválido");
    if (dadosUsuario.senha.length < 6)
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    if (dadosUsuario.senha !== dadosUsuario.confirmarSenha)
      throw new Error("As senhas não coincidem");
  };

  // 1. 🌟 Cadastro Manual (E-mail/Senha)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      validarFormulario();
      const auth = getAuth();

      // 🔹 Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        dadosUsuario.email,
        dadosUsuario.senha
      );
      const user = userCredential.user;

      // 🔹 Cria o documento no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        uid: user.uid,
        criadoEm: new Date(),
        ultimoAcesso: new Date(),
        perfil: "estudante",
        ativo: true,
      });

      // 🔹 Sincroniza com o Backend (SQL Server)
      await syncUserToBackend(user, dadosUsuario.nome);

      setSucesso("🎉 Cadastro realizado com sucesso!");
      // Não precisa de token, pois o AuthContext fará isso no login.
      setTimeout(() => navigate("/login"), 2000); 

    } catch (err) {
      // 🔸 Tratamento de erros Firebase
      if (err.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está em uso.");
      } else if (err.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else if (err.code === "auth/invalid-email") {
        setErro("E-mail inválido.");
      } else {
        setErro(err.message || "Erro ao cadastrar usuário.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. 🌟 Cadastro/Login com Google
  const handleGoogleSignup = async () => {
    setErro("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔹 Cria/Atualiza o documento no Firestore (usando displayName do Google)
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: user.displayName,
        email: user.email,
        uid: user.uid,
        criadoEm: new Date(),
        ultimoAcesso: new Date(),
        perfil: "estudante",
        ativo: true,
      }, { merge: true }); // Usamos merge: true para atualizar se já existir

      // 🔹 Sincroniza com o Backend (SQL Server)
      await syncUserToBackend(user);

      setSucesso("🎉 Login com Google realizado com sucesso!");
      
      // O AuthContext fará o resto do fluxo de navegação após o sucesso do Firebase
      // Redirecionamos para onde o usuário logado seria direcionado
      setTimeout(() => navigate("/dashboard"), 1000); 

    } catch (err) {
      console.error("Erro no cadastro com Google:", err);
      setErro("Erro ao cadastrar com Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (campo, valor) => {
    setDadosUsuario((prev) => ({ ...prev, [campo]: valor }));
    if (erro) setErro("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      {/* ... (Header e Nav inalterados) ... */}
      <header className="mt-8">
        <img
          className="mx-auto w-[300px] md:w-[400px]"
          src="LogoExtensa.svg"
          alt="Logo Sabidos"
        />
      </header>

      <nav className="flex justify-center mt-6 bg-[#292535] rounded-xl px-1 py-1">
        <Link
          to="/login"
          className="text-white px-5 py-2 rounded-xl hover:text-[#FBCB4E] transition"
        >
          Login
        </Link>
        <span className="bg-[#FBCB4E] text-black px-5 py-2 rounded-xl font-semibold">
          Cadastro
        </span>
      </nav>

      <main className="flex flex-col items-center mt-8 w-full max-w-md">
        
        {/* Botão de Cadastro com Google */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full h-11 mb-4 rounded-md font-bold text-white bg-[#DB4437] hover:bg-[#c3372c] transition-all flex items-center justify-center gap-2"
        >
          <img src="google-icon.svg" alt="Google" className="w-5 h-5" /> 
          {loading ? "Processando..." : "Cadastrar com Google"}
        </button>

        {/* Separador */}
        <div className="flex items-center w-full px-6 mb-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Formulário de Cadastro Manual */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full px-6"
        >
          <input
            type="text"
            placeholder="Usuário"
            value={dadosUsuario.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={dadosUsuario.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
          />
          <input
            type="password"
            placeholder="Senha"
            value={dadosUsuario.senha}
            onChange={(e) => handleInputChange("senha", e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={dadosUsuario.confirmarSenha}
            onChange={(e) =>
              handleInputChange("confirmarSenha", e.target.value)
            }
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-md font-bold text-white 
              bg-gradient-to-r from-[#3085AA]/90 to-[#0F4E6A]/90
              hover:opacity-90 transition-all"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          {erro && (
            <p className="text-red-400 text-sm text-center mt-2">{erro}</p>
          )}
          {sucesso && (
            <p className="text-green-400 text-sm text-center mt-2">{sucesso}</p>
          )}
        </form>

        <p className="text-xs text-gray-300 mt-4 text-center">
          Ao criar uma conta, você concorda com os nossos{" "}
          <span className="text-[#FBCB4E] cursor-pointer hover:underline">
            Termos de serviço
          </span>{" "}
          e com a nossa{" "}
          <span className="text-[#FBCB4E] cursor-pointer hover:underline">
            Política de privacidade
          </span>
          .
        </p>
      </main>
    </div>
  );
};

export default Cadastro;