import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/FirebaseConfig";
import AuthService from "../../services/authService";

function Cadastro() {
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
    if (!dadosUsuario.nome.trim()) {
      throw new Error("Por favor, informe seu nome");
    }

    if (!dadosUsuario.email.trim()) {
      throw new Error("Por favor, informe seu email");
    }

    if (!dadosUsuario.email.includes("@")) {
      throw new Error("Por favor, informe um email válido");
    }

    if (dadosUsuario.senha.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }

    if (dadosUsuario.senha !== dadosUsuario.confirmarSenha) {
      throw new Error("As senhas não coincidem");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    try {
      console.log("🔄 Iniciando cadastro...");

      validarFormulario();

      const userData = {
        name: dadosUsuario.nome,
        email: dadosUsuario.email,
        password: dadosUsuario.senha,
      };

      const result = await AuthService.register(userData);

      console.log("✅ Usuário cadastrado no Auth, salvando no Firestore...");

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

        console.log("✅ Dados salvos no Firestore com sucesso!");

        setSucesso("🎉 Cadastro realizado com sucesso! Redirecionando...");

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error("Erro ao obter dados do usuário após cadastro");
      }
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);

      let mensagemErro = error.message;

      if (error.message.includes("email-already-in-use")) {
        mensagemErro =
          "Este email já está cadastrado. Faça login ou use outro email.";
      } else if (error.message.includes("weak-password")) {
        mensagemErro = "A senha é muito fraca. Use pelo menos 6 caracteres.";
      } else if (error.message.includes("invalid-email")) {
        mensagemErro = "Email inválido. Verifique o formato.";
      } else if (error.message.includes("Este email já está cadastrado")) {
        mensagemErro = error.message;
      }

      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setDadosUsuario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (erro) setErro("");
  };

  return (
    <div className="cadastro-container">
      <header className="headerL">
        <img
          className="logoL"
          src="LogoExtensa.svg"
          alt="Logo Sabidos"
          width="409px"
          height="153px"
        />
      </header>

      <br />

      <section>
        <nav className="navv">
          <Link to="/login" id="b1">
            Login
          </Link>
          <a id="b2" className="luz">
            Cadastro
          </a>
        </nav>

        <main id="cad" className="s">
          <div id="d1">
            <form onSubmit={handleSubmit} className="formcad">
              <input
                className="inputL"
                type="text"
                value={dadosUsuario.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
                disabled={loading}
                placeholder="Nome completo"
                aria-label="Nome completo"
              />

              <input
                className="inputL"
                type="email"
                value={dadosUsuario.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={loading}
                placeholder="E-mail"
                aria-label="E-mail"
              />

              <input
                className="inputL"
                type="password"
                value={dadosUsuario.senha}
                onChange={(e) => handleInputChange("senha", e.target.value)}
                required
                disabled={loading}
                placeholder="Senha (mínimo 6 caracteres)"
                aria-label="Senha"
              />

              <input
                className="inputL"
                type="password"
                value={dadosUsuario.confirmarSenha}
                onChange={(e) =>
                  handleInputChange("confirmarSenha", e.target.value)
                }
                required
                disabled={loading}
                placeholder="Confirme sua senha"
                aria-label="Confirme sua senha"
              />

              <div id="d2-cad">
                {sucesso && <div className="sucesso-message">✅ {sucesso}</div>}

                {erro && <div className="erro-message">❌ {erro}</div>}

                <button
                  type="submit"
                  className="buttonCC"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "📝 Cadastrando..." : "🚀 Cadastrar"}
                </button>
              </div>
            </form>
          </div>

          <div id="d4-cad">
            <p id="p">
              Ao se cadastrar, você confirma que compreende e aceita
              <br />
              como nossa plataforma funciona.
            </p>
            <br />

            <div className="google-placeholder">
              🔄 Integração com Google Login em breve
            </div>

            <br />

            {process.env.NODE_ENV === "development" && (
              <Link to="/dashboard" className="dev-link">
                [DEV] Acessar sem cadastro
              </Link>
            )}
          </div>
        </main>
      </section>
    </div>
  );
}

export default Cadastro;
