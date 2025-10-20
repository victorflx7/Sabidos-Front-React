// import React from 'react'
// import { Link } from 'react-router-dom';


// function Login() {
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');
//   const [erro, setErro] = useState('');
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await fazerLogin(email, senha);
//       if (result.success) {


//         alert('Login realizado com sucesso!');
//         navigate('/dashboard');
//       } else {
//         setErro(result.error);
//       }
//     } catch (error) {
//       setErro("Falha no login: " + error.message);
//     }
//   };

  import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
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
