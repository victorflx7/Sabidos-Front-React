import React from "react";

const SobreNosPage = () => {
  const teamMembers = [
    {
      id: "matos",
      name: "Victor Matos",
      text: (
        <>
          E aí, sou o <span className="font-bold">Victor Matos!</span> Fui um dos idealizadores mais importantes, e criador da <span className="bg-gradient-to-r from-[#E44B4B] via-[#B65CA7] to-[#279BCE] bg-clip-text text-transparent font-bold">Logo do Sabidos²</span>
        </>
      ),
      avatar: "/MATOS.svg",
      side: "left",
    },
    {
      id: "luiz",
      name: "Luiz",
      text: (
        <>
          Opa, eu sou o <span className="font-bold">Luiz</span>, trabalhei duro no Backend, fazendo com que essa <span className="bg-gradient-to-r from-[#E44B4B] via-[#B65CA7] to-[#279BCE] bg-clip-text text-transparent font-bold">maravilha de site</span> funcionasse corretamente!
        </>
      ),
      avatar: "/LUIS.svg",
      side: "right",
    },
    {
      id: "willian",
      name: "Willian",
      text: (
        <>
          Olá, sou o <span className="font-bold">Willian!</span> O grande <span className="bg-gradient-to-r from-[#E44B4B] via-[#B65CA7] to-[#279BCE] bg-clip-text text-transparent font-bold">Sabido.</span> Dediquei noites de trabalho e fiz boa parte dos códigos pesados do projeto!
        </>
      ),
      avatar: "/WILLIAN.svg",
      side: "left",
    },
    {
      id: "vitaminado",
      name: "Victor Freitas",
      text: (
        <>
          🙏 Me chamo <span className="font-bold">Victor</span> mas, também sou conhecido por <span className="bg-gradient-to-r from-[#E44B4B] via-[#B65CA7] to-[#279BCE] bg-clip-text text-transparent font-bold">Vitamina</span>! Eu cuidei principalmente do visual mais estilizado do site, mas trabalhei na grande parte das paginas em front
        </>
      ),
      avatar: "/VITAMINA.svg",
      side: "right",
    },
    {
      id: "hugao",
      name: "Hugo",
      text: (
        <>
          Ola, eu sou o <span className="font-bold">Hugo</span>, o mais novo membro da equipe, a culpa do visual <span className="bg-gradient-to-r from-[#E44B4B] via-[#B65CA7] to-[#279BCE] bg-clip-text text-transparent font-bold">Moderno e limpo</span> do site é toda minha!
        </>
      ),
      avatar: "/HUGO.svg",
      side: "left",
    },
  ];

  const Avatar = ({ src }) => (
    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#312D42] flex-shrink-0">
      <div className="w-full h-full p-2">
        <img src={src} className="w-full h-full object-contain" alt="" />
      </div>
    </div>
  );
  const MemberBlock = ({ member }) => {
    const isRight = member.side === "right";

    return (
      <section
        id={`membro-${member.id}`}
        className={`flex w-full justify-center ${isRight ? "md:justify-end" : "md:justify-start"}`}
      >
        <div
          className={`flex flex-col md:flex-row ${isRight ? "md:flex-row-reverse" : ""} items-center gap-6 max-w-4xl w-full`}
        >
          <Avatar src={member.avatar} />

          <div className="bg-[#1D1B2A] p-8 md:p-10 rounded-xl shadow-xl max-w-xl">
            <p className="text-white text-[15px] leading-relaxed text-center md:text-left">
              {member.text}
            </p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main id="sobre-nos" className="px-6 md:px-12 py-12 space-y-20">
      <header id="sobre-header" className="text-center py-16 px-6">
        <h1
          className="text-4xl md:text-5xl font-bold
    bg-gradient-to-r from-[#E44B4B] via-[#B65CA7] to-[#279BCE]
    bg-clip-text text-transparent"
        >
          Equipe SabidoS²
        </h1>

        <div className="mt-8 max-w-3xl mx-auto px-8 py-6 rounded-lg bg-[#1D1B2A] border border-[#2A2740]">
          <p className="text-gray-300 leading-relaxed text-[15.5px] md:text-[17px] font-medium">
            O SabidoS² é um website interativo que oferece métodos e anotações
            de estudo gratuitas para alunos do ensino médio e universitário.
            Nosso objetivo é reunir diversas ferramentas acadêmicas em um único
            ambiente digital, promovendo uma experiência de aprendizado mais
            eficiente, organizada e acessível para todos.
          </p>
        </div>
      </header>
      
      <section id="equipe" className="space-y-16 p-30">
        {teamMembers.map((member) => (
          <MemberBlock key={member.id} member={member} />
        ))}
      </section>
      <section id="contato" className="flex justify-center w-full">
        <div className="bg-[#1D1B2A] p-8 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white font-semibold text-center md:text-left max-w-md">
            Manda um e-mail pra gente! Pode ser dúvida, sugestão ou só um alô —
            a gente tá aqui pra ouvir você.
          </p>

          <div className="flex items-center gap-4">
            <img src="/sabidos.svg" className="w-14" />

            <a
              href="mailto:sabidos.dev@gmail.com"
              className="font-bold text-yellow-500 hover:text-yellow-400 transition"
            >
              sabidos.dev@gmail.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SobreNosPage;
