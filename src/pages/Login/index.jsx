// Login.jsx (NOVO ARQUIVO)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/FirebaseConfig";
import { API_BASE_URL } from "../../services/Api"; // Importar API_BASE_URL

// Função auxiliar para sincronizar o usuário no SQL (copiada do Cadastro)
const syncUserToBackend = async (user) => {
    try {
        const syncDto = {
            FirebaseUid: user.uid,
            Email: user.email,
            Name: user.displayName || null
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


const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. 🌟 Login Manual (E-mail/Senha)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      // 🔹 Login com Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // O AuthContext fará o resto: pegará o token, chamará a API /sync, e obterá os dados /me
      
      navigate("/dashboard"); // ou /home — depende do seu fluxo
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.code === "auth/user-not-found") {
        setErro("Usuário não encontrado.");
      } else if (err.code === "auth/wrong-password") {
        setErro("Senha incorreta.");
      } else if (err.code === "auth/invalid-email") {
        setErro("E-mail inválido.");
      } else {
        setErro("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. 🌟 Login com Google
  const handleGoogleLogin = async () => {
    setErro("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔹 Sincroniza o usuário com o Backend (SQL Server)
      // Fazemos a chamada explícita aqui para garantir a criação/atualização antes da navegação
      await syncUserToBackend(user); 

      // O AuthContext tratará o token e chamará /me
      navigate("/dashboard"); 

    } catch (err) {
      console.error("Erro no login com Google:", err);
      setErro("Erro ao fazer login com Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
        <span className="bg-[#FBCB4E] text-black px-5 py-2 rounded-xl font-semibold">
          Login
        </span>
        <Link
          to="/cadastro"
          className="text-white px-5 py-2 rounded-xl hover:text-[#FBCB4E] transition"
        >
          Cadastro
        </Link>
      </nav>

      <main className="flex flex-col items-center mt-8 w-full max-w-md">
        
        {/* Botão de Login com Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-11 mb-4 rounded-md font-bold text-white bg-[#DB4437] hover:bg-[#c3372c] transition-all flex items-center justify-center gap-2"
        >
          <img src="google-icon.svg" alt="Google" className="w-5 h-5" /> 
          {loading ? "Processando..." : "Entrar com Google"}
        </button>

        {/* Separador */}
        <div className="flex items-center w-full px-6 mb-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>
        
        {/* Formulário de Login Manual */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full px-6"
        >
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-md font-bold text-white 
              bg-gradient-to-r from-[#3085AA]/90 to-[#0F4E6A]/90
              hover:opacity-90 transition-all"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {erro && (
            <p className="text-red-400 text-sm text-center mt-2">{erro}</p>
          )}
        </form>

        <p className="text-xs text-gray-300 mt-4 text-center">
          Esqueceu sua senha?{" "}
          <span className="text-[#FBCB4E] cursor-pointer hover:underline">
            Clique aqui
          </span>
          .
        </p>
      </main>
    </div>
  );
};

export default Login;