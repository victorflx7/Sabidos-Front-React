// pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";
import { useAuth } from "../../context/AuthContexts";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginError } = useAuth();

  // 1. 🔐 Login Manual (E-mail/Senha)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log("✅ Login Firebase bem-sucedido, aguardando validação backend...");
      
      // O AuthContext automaticamente validará no backend e redirecionará
    } catch (err) {
      console.error("❌ Erro no login Firebase:", err);
      // O AuthContext irá capturar o erro automaticamente
    } finally {
      setLoading(false);
    }
  };

  // 2. 🔐 Login com Google (APENAS LOGIN - não cria no SQL)
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      
      await signInWithPopup(auth, provider);
      console.log("✅ Login Google bem-sucedido, aguardando validação backend...");
      
      // O AuthContext automaticamente validará no backend
    } catch (err) {
      console.error("❌ Erro no login com Google:", err);
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
      
        {/* Formulário de Login Manual */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full px-6">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
            required
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

          {/* Exibir erros do AuthContext */}
          {loginError && (
            <p className="text-red-400 text-sm text-center mt-2">{loginError}</p>
          )}
        </form>

        <p className="text-xs text-gray-300 mt-4 text-center">
          Esqueceu sua senha?{" "}
          <span className="text-[#FBCB4E] cursor-pointer hover:underline">
            Clique aqui
          </span>
          .
        </p>
                {/* Separador */}
        <div className="flex items-center w-full px-6 mb-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

                {/* Botão de Login com Google */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-[90%] mt-6 border border-gray-400 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Entrar com Google</span>
        </button>

      </main>
    </div>
  );
};

export default Login;