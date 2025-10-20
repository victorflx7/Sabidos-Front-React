import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/FirebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      alert('Login realizado com sucesso!');
      navigate("/dashboard"); // página inicial após login
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
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

    <div className="login-container">
      <header className="headerL">
        <img className="logoL" src="LogoLogin.svg" alt="logoExtensa" width="409px" height="153px" />
      </header>
      <br />
      <nav>
        <a id="b1" className="luz">Login</a>
        <Link to="/cadastro" id="b2">Cadastro</Link>
      </nav>
      <main id="login" >
        <div id="d1">
          <form onSubmit={handleEmailLogin} className='formlog'>
            <input className="inputL" type="email" name="" id="" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="inputL" type="password" name="password" id="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button type="submit" className="buttonLL" disabled={loading}>
              {loading ? 'Entrando....' : 'Entrar'}
            </button>
            {erro && <p className="erro">{erro}</p>}
          </form>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Entrar com Google
        </button>

        
        <div id="d3-log">
        </div>
        <div id="d4-log">
          <p id="p">Ainda não possui uma conta?</p>
        </div>
        <div id="d5-log">

          <Link to="/cadastro" id="a">Cadastre-se</Link>

        </div>
      </main>
    </div>



  )
}

export default LoginPage;
