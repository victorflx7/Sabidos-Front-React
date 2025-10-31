// pages/Cadastro.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { db } from "../../firebase/FirebaseConfig";
import { syncUserToBackend } from "../../services/Api"; 

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

  const validarFormulario = () => {
    if (!dadosUsuario.nome.trim()) throw new Error("Informe seu nome");
    if (!dadosUsuario.email.includes("@")) throw new Error("E-mail inválido");
    if (dadosUsuario.senha.length < 6)
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    if (dadosUsuario.senha !== dadosUsuario.confirmarSenha)
      throw new Error("As senhas não coincidem");
  };

  // 1. 📝 Cadastro Manual (E-mail/Senha)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      validarFormulario();
      const auth = getAuth();

      // 🔥 Cria usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        dadosUsuario.email,
        dadosUsuario.senha
      );
      const user = userCredential.user;

      // 📋 Cria documento no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        uid: user.uid,
        criadoEm: new Date(),
        ultimoAcesso: new Date(),
        perfil: "estudante",
        ativo: true,
      });

      // 🗄️ Sincroniza com SQL Server
      await syncUserToBackend(user, dadosUsuario.nome);

      setSucesso("🎉 Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      console.error("❌ Erro no cadastro:", err);
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

  // 2. 📝 Cadastro com Google (CADASTRA + LOGIN)
  const handleGoogleSignup = async () => {
    setErro("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 📋 Cria/Atualiza no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: user.displayName,
        email: user.email,
        uid: user.uid,
        criadoEm: new Date(),
        ultimoAcesso: new Date(),
        perfil: "estudante",
        ativo: true,
      }, { merge: true });

      // 🗄️ Sincroniza com SQL Server
      await syncUserToBackend(user);

      setSucesso("🎉 Cadastro com Google realizado com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      console.error("❌ Erro no cadastro com Google:", err);
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
        
        {/* Formulário de Cadastro Manual */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full px-6">
          <input
            type="text"
            placeholder="Usuário"
            value={dadosUsuario.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={dadosUsuario.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={dadosUsuario.senha}
            onChange={(e) => handleInputChange("senha", e.target.value)}
            className="w-full h-10 rounded-lg bg-gray-200 text-black px-4 text-sm focus:ring-2 focus:ring-[#3085AA] outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={dadosUsuario.confirmarSenha}
            onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
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
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          {erro && <p className="text-red-400 text-sm text-center mt-2">{erro}</p>}
          {sucesso && <p className="text-green-400 text-sm text-center mt-2">{sucesso}</p>}
        </form>

          {/* Separador */}
        <div className="flex items-center w-full px-6 mt-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

          {/* Botão de Login com Google */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-2 w-[90%] mt-6 border border-gray-400 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Entrar com Google</span>
        </button>

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
