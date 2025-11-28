export default function Footer() {
  return (
    <footer className="w-full h-28 bg-[#292535] flex flex-col justify-evenly items-center items-center">
      <div className="flex justify-evenly w-72">
        <a href="https://www.instagram.com/jeniosiloucos/" target="_blank"><img src="IconesSVG/instagram.svg" alt="Instagram" className="w-8 h-8" /></a>
        <a href="https://linktr.ee/Sabidos.d" target="_blank"><img src="IconesSVG/linkTree.svg" alt="Linktree" className="w-8 h-8" /></a>
        <a href="mailto:sabidos.dev@gmail.com"><img src="IconesSVG/emailContato.svg" alt="Email de Contato" className="w-9 h-9" /></a>
      </div>

      <div className="flex flex-col justify-center items-center text-center">
        <p className="text-[#EAEAEA] font-semibold text-[13px]">
          © 2025 Sabidos. Todos os direitos reservados.
        </p>
      </div>

      <div className="text-[#b9b9b9] font-semibold text-[12px] flex space-x-4">
        <span>De alunos, para alunos, crie, com o SabidoS²</span>
      </div>
    </footer>
  );
}
