import React from "react";

// --- Dados Estáticos para o Design (Simulando a Imagem) ---
const teamMembers = [
    { id: 1, name: "Matos", content: "Oi sou o Matos", isMe: false, avatar: "/MATOS.svg" },
    { id: 2, name: "Luiz", content: "lorem ipsum dolor sit amet", isMe: true, avatar: "/LUIS.svg" },
    { id: 3, name: "Willian", content: "lorem ipsum dolor sit amet", isMe: false, avatar: "/WILLIAN.svg" },
    { id: 4, name: "Vitamina", content: "lorem ipsum dolor sit amet", isMe: true, avatar: "/VITAMINA.svg" },
];

// Componente Estilizado do Avatar
const TeamAvatar = ({ avatar }) => (
    <div className="w-40 h-40 rounded-full bg-[#312D42] flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={avatar} className="h-30 object-cover rounded-full"/>
    </div>
);


const TeamInfoBubble = ({ name, content, isMe, avatar }) => {
  const alignment = isMe ? 'justify-end' : 'justify-start';
  const direction = isMe ? 'flex-row-reverse' : 'flex-row';
  const bubbleColor = 'bg-[#1D1B2A] p-12 rounded-xl shadow-lg w-[600px]';  

    return (
    <div className={`flex ${alignment} mb-6 w-full`}>
      <div className={`flex ${direction} items-start max-w-xl w-full`}>

        {/* Avatar com imagem correta */}
        <TeamAvatar avatar={avatar} />

        <div className={`mx-4 flex flex-col ${isMe ? 'items-end' : 'items-start'} flex-grow`}>
          <p className="text-white font-bold text-base mb-1">
            {name} : lorem 
          </p>

          <div className={bubbleColor} style={{ minHeight: '60px' }}>
            <span className="text-white">{content}</span> 
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
const SobreNosPage = () => {
    return (
        // Usando Fragment para retornar múltiplos blocos (o texto e a interface)
        <>
            {/* 1. Conteúdo da Página "Sobre Nós" (Seção Superior) */}
            <div className="pt-10 pb-10">
                {/* 'class' trocado por 'className' */}
                <h1 className="text-5xl flex items-center justify-center font-bold translate-x-5 translate-y-10 bg-gradient-to-r from-[#E44B4B] from-[4%] via-[#A45981] via-[44%] to-[#279BCE] to-[83%]
          bg-clip-text text-transparent">Equipe SabidoS²</h1>
                <br /><br /><br /><br />
                {/* 'class' trocado por 'className' */}
                <p className="text-yellow-500 text-[20px] flex items-center justify-center font-bold translate-x-5 max-w-[920px] mx-auto">O SabidoS² é um website interativo que oferece métodos e anotações de estudo gratuitas para alunos do ensino médio e universitário. Nosso objetivo é reunir diversas ferramentas acadêmicas em um único ambiente digital, promovendo uma experiência de aprendizado mais eficiente, organizada e acessível para todos.</p>
            </div>

            {/* 2. Interface Estática do Design (Seção de "Equipe") */}
            <div className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto space-y-4">
                    {teamMembers.map((member) => (
                        <TeamInfoBubble
                            key={member.id}
                            name={member.name}
                            content={member.content}
                            isMe={member.isMe}
                            avatar={member.avatar}
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-center w-full mt-10 mb-10 px-6">
    {/* 🎯 Container do Bloco de Contato (Fundo Roxo Escuro) */}
    <div className="bg-[#1D1B2A] p-8 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center justify-between">
        
        {/* 📝 Texto de Chamada */}
        <div className="text-white text-center md:text-left mb-4 md:mb-0 md:mr-6 max-w-md">
            <p className="text-[15px] font-semibold max-w-[320px] mx-auto">
                Manda um e-mail pra gente! Pode ser dúvida, sugestão ou só um alô — a gente tá aqui pra ouvir você.
            </p>
        </div>

        {/* 🎓 Ícone e E-mail */}
        <div className="flex items-center space-x-4">
            {/* 🎓 Ícone (Representado por um span com um emoji ou um ícone do Tailwind) */}
                <img className="flex items-center justify-center font-bold -translate-x-42"src="sabidos.svg"/>
            {/* 📧 Endereço de E-mail */}
            <a 
                href="mailto:sabidos.dev@gmail.com" 
                className="font-bold text-yellow-500 hover:text-yellow-400 transition duration-300"
            >
                sabidos.dev@gmail.com
            </a>
        </div>
    </div>
</div>
        </>
    );
};

export default SobreNosPage;