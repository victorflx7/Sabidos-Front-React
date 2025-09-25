import React from "react";
import { Link } from "react-router-dom";
//import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="container bg-[#060423]">
        <div className="grid grid-cols-1">
          <div className="">
            <img src="frame2.svg" className="" alt="Logo" />
            <p className="">
              Organize seus estudos <br /> de forma{" "}
              <span className="">fácil</span>
            </p>
            {/*<Link to="/cadastro"></Link>*/}
            {/*<Link to="/login" className="sub">*/}
              <br />
              Já tem uma conta? Entre !
            {/*</Link>*/}
          </div>
          <section className="">
            <div className="">
              <p className="">Trabalhe de qualquer lugar</p>
              <div className="">
                <img src="logo2.svg" className="" />
                <p className="">
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
            <div className="">
              <p className="">
                Faça tudo de forma<br></br>interativa e gratuita
              </p>
              <div className="">
                <img src="lamp.svg" className="" />
                <p className="">
                  Tenha suas anotações
                  <br />
                  salvas com o melhor website
                  <br />
                  de anotações do mercado
                </p>
              </div>
            </div>
            <div className="">
              <p className="">Eficiência é nosso objetivo</p>
              <div className="">
                <img src="pencil.svg" className="" />
                <p className="">
                  Nosso website contém <br />
                  diversos métodos de estudos <br />
                  com muita eficiência
                </p>
              </div>
            </div>
            <div className="">
              <p className="">
                Veloz para melhor<br></br>experiência do usuário
              </p>
              <div className="">
                <img src="rocket.svg" className="" />
                <p className="">
                  O Sabidos² é um website com <br />
                  muita velocidade para suas <br />
                  anotações e estudos
                </p>
              </div>
            </div>
            <div className="">
              <p className="">Gratuidade para todos</p>
              <div className="">
                <img src="cash.svg" className="" />
                <p className="">
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
      </div>
    </>
  );
}
