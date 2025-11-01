import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SlideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      {/* Botão de abrir menu */}
      <div 
        className="flex justify-center items-center w-15 h-14 cursor-pointer transition-colors"
        onClick={toggleDropdown}
      >
        <img src='/IconesSVG/setaBarraLateral.svg' alt="Menu" className={`h-8 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}/>
      </div>
      
      {/* Menu dropdown */}
      <div 
        ref={dropdownRef}
        className={`absolute left-[1px] top-[3px] bg-[#292535] rounded-tr-none rounded-br-lg rounded-bl-lg shadow-lg border border-[#171621] min-w-[200px] z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Cabeçalho do menu */}
        <div className="px-3 py-2 border-b border-[#171621] mb-3 cursor-pointer"
        onClick={() => setIsOpen(false)}
        >
          <img src='/IconesSVG/setaBarraLateral.svg' alt="Menu" className="h-8 scale-x-[-1]"/>
        </div>
        
        {/* Links principais */}
        <div className="flex flex-col space-y-1">
          <Link 
            to="/dashboard" 
            className="flex items-center px-3 py-3 text-[#eaeaea] no-underline transition-all rounded bg-[#171621] hover:bg-[#423E51] mx-2"
            onClick={() => setIsOpen(false)}
          >
            <img src='/IconesSVG/House.svg' className="h-5 mr-3" alt="Home"/>
            <span>Home</span>
          </Link>
          
          <Link 
            to="/Agenda" 
            className="flex items-center px-3 py-3 text-white no-underline transition-all rounded bg-[#171621] hover:bg-[#423E51] mx-2"
            onClick={() => setIsOpen(false)}
          >
            <img src='/IconesSVG/diario.svg' className="h-5.5 mr-3" alt="Agenda"/>
            <span>Agenda</span>
          </Link>
          
          <Link 
            to="/Resumo" 
            className="flex items-center px-3 py-3 text-white no-underline transition-all rounded bg-[#171621] hover:bg-[#423E51] mx-2"
            onClick={() => setIsOpen(false)}
          >
            <img src='/IconesSVG/escrever.svg' className="h-5 mr-3" alt="Resumos"/>
            <span>Resumos</span>
          </Link>
          
          <Link 
            to="/Pomodoro" 
            className="flex items-center px-3 py-3 text-white no-underline transition-all rounded bg-[#171621] hover:bg-[#423E51] mx-2"
            onClick={() => setIsOpen(false)}
          >
            <img src='/IconesSVG/temporizador.svg' className="h-6 mr-3" alt="Pomodoro"/>
            <span>Pomodoro</span>
          </Link>
          
          <Link 
            to="/Flashcard" 
            className="flex items-center px-3 py-3 text-white no-underline transition-all rounded bg-[#171621] hover:bg-[#423E51] mx-2"
            onClick={() => setIsOpen(false)}
          >
            <img src='/IconesSVG/cartas.svg' className="h-5 mr-3" alt="Flashcards"/>
            <span>Flashcards</span>
          </Link>
        </div>
        
        {/* Rodapé do menu */}
        <div className="pt-3 mt-3 border-t border-[#171621]">
          <Link 
            to="/sobrenos" 
            className="flex items-center mb-3 px-3 py-3 text-white no-underline transition-all rounded bg-[#171621] hover:bg-[#423E51] mx-2"
            onClick={() => setIsOpen(false)}
          >
            <img src='/IconesSVG/sobreNos.svg' className="h-6 mr-3" alt="Sobre nós"/>
            <span>Sobre nós</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SlideBar;