import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/FirebaseConfig";

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

  const isCadastro = location.pathname === "/cadastro";

  const validarFormulario = () => {
    if (!dadosUsuario.nome.trim()) throw new Error("Informe seu nome");
    if (!dadosUsuario.email.includes("@")) throw new Error("E-mail inválido");
    if (dadosUsuario.senha.length < 6)
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    if (dadosUsuario.senha !== dadosUsuario.confirmarSenha)
      throw new Error("As senhas não coincidem");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      validarFormulario();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: dadosUsuario.nome,
          email: dadosUsuario.email,
          uid: user.uid,
          criadoEm: new Date(),
          ultimoAcesso: new Date(),
          perfil: "estudante",
          ativo: true,
        });
        setSucesso("🎉 Cadastro realizado com sucesso!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        throw new Error("Erro ao obter dados do usuário");
      }
    } catch (err) {
      setErro(err.message);
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
      {/* Logo */}
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

      {/* Formulário */}
      <main className="flex flex-col items-center mt-8 w-full max-w-md">
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
