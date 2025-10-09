import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="container">
      <div className="bloco esquerda">
        <img src="frame2.svg" className="logo1" alt="Logo" />
        <p className="texto1">
          Organize seus estudos <br /> de forma{" "}
          <span className="sublinhado">fácil</span>
        </p>
        <Link to="/cadastro">
        <button className='botao'>
          Cadastre-se ! É grátis
        </button>
        </Link>
        <Link to="/login" className="sub">
          <br />
          Já tem uma conta? Entre !
        </Link>
      </div>

      <section className="secLateral">
        <div className="bloco direita">
          <p className="texto2">Trabalhe de qualquer lugar</p>
          <div className="bloco2">
            <img src="logo2.svg" className="logo2" />
            <p className="texto3">
              Mantenha as informações
              <br />
              importantes à mão; suas
              <br />
              notas sincronizam
              <br />
              automaticamente em todos
              <br />
              os seus dispositivos.
            </p>
          </div>
        </div>
        <div className="bloco direita">
          <p className="texto2">
            Faça tudo de forma<br></br>interativa e gratuita
          </p>
          <div className="bloco2">
            <img src="lamp.svg" className="logo2" />
            <p className="texto3">
              Tenha suas anotações
              <br />
              salvas com o melhor website
              <br />
              de anotações do mercado
            </p>
          </div>
        </div>
        <div className="bloco direita">
          <p className="texto2">Eficiência é nosso objetivo</p>
          <div className="bloco2">
            <img src="pencil.svg" className="logo3" />
            <p className="texto3">
              Nosso website contém <br />
              diversos métodos de estudos <br />
              com muita eficiência
            </p>
          </div>
        </div>
        <div className="bloco direita">
          <p className="texto2">
            Veloz para melhor<br></br>experiência do usuário
          </p>
          <div className="bloco2">
            <img src="rocket.svg" className="logo2" />
            <p className="texto3">
              O Sabidos² é um website com <br />
              muita velocidade para suas <br />
              anotações e estudos
            </p>
          </div>
        </div>
        <div className="bloco direita">
          <p className="texto2">Gratuidade para todos</p>
          <div className="bloco2">
            <img src="cash.svg" className="logo2" />
            <p className="texto3">
              Você pode usar todos os <br />
              recursos aqui sem se preocupar
              <br />
              com valores, pois todos os <br />
              recursos são gratuitos !
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
