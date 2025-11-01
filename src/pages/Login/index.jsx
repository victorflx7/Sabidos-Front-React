// pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { useAuth } from "../../context/AuthContexts";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUser, loginError } = useAuth();

  // ✅ REDIRECIONAMENTO AUTOMÁTICO
  useEffect(() => {
    if (backendUser) {
      console.log("✅ Usuário autenticado, redirecionando para dashboard...");
      navigate("/dashboard");
    }
  }, [backendUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, senha);
      // O redirecionamento acontecerá automaticamente pelo useEffect
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.code === "auth/user-not-found") {
        setErro("Usuário não encontrado.");
      } else if (err.code === "auth/wrong-password") {
        setErro("Senha incorreta.");
      } else {
        setErro("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      await signInWithPopup(auth, provider);
      // O redirecionamento acontecerá automaticamente pelo useEffect
    } catch (err) {
      console.error("Erro no login com Google:", err);
      setErro("Erro ao fazer login com Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
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

          {(erro || loginError) && (
            <p className="text-red-400 text-sm text-center mt-2">
              {erro || loginError}
            </p>
          )}
        </form>

        <p className="text-xs text-gray-300 mt-4 text-center">
          Esqueceu sua senha?{" "}
          <span className="text-[#FBCB4E] cursor-pointer hover:underline">
            Clique aqui
          </span>
        </p>

        
          {/* Separador */}
        <div className="flex items-center w-full px-6 mt-4">
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