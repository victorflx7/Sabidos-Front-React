import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex justify-between items-center h-screen bg-[#060423] text-white overflow-hidden font-['Inter']">
      {/* BLOCO ESQUERDA */}
      <div className="flex flex-col justify-center items-center gap-6 w-[650px] h-[650px]">
        <img src="frame2.svg" alt="Logo" className="w-100 h-auto" />
        <p className="text-center text-3xl font-semibold">
          Organize seus estudos <br /> de forma{" "}
          <span className="underline text-[#EA6A69]">fácil</span>
        </p>

        <Link to="/cadastro">
          <div
            className="
              p-[3px] w-[350px] h-[60px] rounded-lg relative overflow-hidden
              bg-gradient-to-r from-[#D6343B] via-[#7D63AC] to-[#1499E2]
              transform transition-all duration-300 hover:scale-[1.03]
            "
          >

            <span
              className="
                flex items-center justify-center 
                w-full h-full bg-[#060423] text-white font-bold text-xl rounded-[calc(0.5rem-3px)]
                p-2 transition-all duration-300
              "
            >
              Começar
            </span>

          </div>
        </Link>
        {/* FIM DO BOTÃO REFINADO */}

        <Link
          to="/login"
          className="underline text-[#FBCB4E] font-bold hover:text-[#FB904E] text-base visited:text-[#FBCB4E] transition-colors duration-200"
        >
          Já tem uma conta? Entre !
        </Link>
      </div>

      {/* BLOCO DIREITA / CARROSSEL */}
      <section
        className="h-screen overflow-hidden snap-y snap-mandatory relative w-[650px]"
      >
        <div
          className="animate-[slide_12s_infinite] flex flex-col items-center justify-start"
          style={{
            height: "500vh",
          }}
        >
          {/* Seção 1 */}
          <div className="flex flex-col justify-center items-center h-screen snap-start">
            <p className="text-[#8395ED] text-2xl font-semibold mb-3">
              Trabalhe de qualquer lugar
            </p>
            <div className="flex items-center gap-10">
              <img src="logo2.svg" alt="logo" className="w-36 h-auto mt-6" />
              <p className="text-xl text-white">
                Mantenha as informações <br />
                importantes à mão; suas <br />
                notas sincronizam <br />
                automaticamente em todos <br />
                os seus dispositivos.
              </p>
            </div>
          </div>

          {/* Seção 2 */}
          <div className="flex flex-col justify-center items-center h-screen snap-start">
            <p className="text-[#8395ED] text-2xl font-semibold mb-3">
              Faça tudo de forma <br /> interativa e gratuita
            </p>
            <div className="flex items-center gap-10">
              <img src="lamp.svg" alt="lamp" className="w-36 h-auto mt-6" />
              <p className="text-xl text-white">
                Tenha suas anotações <br />
                salvas com o melhor website <br />
                de anotações do mercado
              </p>
            </div>
          </div>

          {/* Seção 3 */}
          <div className="flex flex-col justify-center items-center h-screen snap-start">
            <p className="text-[#8395ED] text-2xl font-semibold mb-3">
              Eficiência é nosso objetivo
            </p>
            <div className="flex items-center gap-10">
              <img src="pencil.svg" alt="pencil" className="w-28 h-auto mt-6" />
              <p className="text-xl text-white">
                Nosso website contém <br />
                diversos métodos de estudos <br />
                com muita eficiência
              </p>
            </div>
          </div>

          {/* Seção 4 */}
          <div className="flex flex-col justify-center items-center h-screen snap-start">
            <p className="text-[#8395ED] text-2xl font-semibold mb-3">
              Veloz para melhor <br /> experiência do usuário
            </p>
            <div className="flex items-center gap-10">
              <img src="rocket.svg" alt="rocket" className="w-36 h-auto mt-6" />
              <p className="text-xl text-white">
                O Sabidos² é um website com <br />
                muita velocidade para suas <br />
                anotações e estudos
              </p>
            </div>
          </div>

          {/* Seção 5 */}
          <div className="flex flex-col justify-center items-center h-screen snap-start">
            <p className="text-[#8395ED] text-2xl font-semibold mb-3">
              Gratuidade para todos
            </p>
            <div className="flex items-center gap-10">
              <img src="cash.svg" alt="cash" className="w-36 h-auto mt-6" />
              <p className="text-xl text-white">
                Você pode usar todos os <br />
                recursos aqui sem se preocupar <br />
                com valores, pois todos os <br />
                recursos são gratuitos !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animação personalizada do carrossel (mantida) */}
      <style>
        {`
          @keyframes slide {
            0%, 15% { transform: translateY(0); }
            20%, 35% { transform: translateY(-100vh); }
            40%, 55% { transform: translateY(-200vh); }
            60%, 75% { transform: translateY(-300vh); }
            80%, 95% { transform: translateY(-400vh); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
