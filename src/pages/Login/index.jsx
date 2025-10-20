import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/FirebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      alert("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setErro("Erro ao logar com Google.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      {/* Logo */}
      <header className="mt-8">
        <img
          className="mx-auto w-[300px] md:w-[400px]"
          src="LogoExtensa.svg"
          alt="Logo Sabidos"
        />
      </header>

      {/* Navegação Login / Cadastro */}
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

      {/* Formulário */}
      <main className="flex flex-col items-center mt-8 w-full max-w-md">
        <form
          onSubmit={handleEmailLogin}
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

        {/* Login com Google */}
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

        {/* Cadastro link */}
        <div className="mt-10 text-center">
          <p className="text-white text-sm">Ainda não possui uma conta?</p>
          <Link
            to="/cadastro"
            className="text-[#FBCB4E] font-semibold hover:underline"
          >
            Cadastre-se
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
