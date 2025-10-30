import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function IconProfile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUsuario();
    navigate("/login"); 
  };

  return (
    <div className="relative group">
      {/* Novo Ícone do Perfil */}
      <div className="w-10 h-10 rounded-full bg-[#3B2868] border border-[#7763B3] flex items-center justify-center cursor-pointer">
        <img 
          src="IconesSVG/sabidosOutline.svg" 
          alt="Perfil" 
          className="w-8 h-8" 
        />
      </div>

      {/* Modal de Perfil */}
      <div className="absolute top-full right-0 mt-2 w-72 bg-[#575757] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="flex flex-col items-center p-6">
          
          {/* Avatar no Modal */}
          <div className="w-16 h-16 rounded-full bg-[#3B2868] border-2 border-[#7763B3] flex items-center justify-center mb-4">
            <img 
              src="IconesSVG/sabidosOutline.svg" 
              alt="Perfil" 
              className="w-10 h-10" 
            />
          </div>

          {/* Botão Gerenciar Conta */}
          <Link to="/Perfil" className="w-full mb-4">
            <button className="w-full h-10 bg-[#FBCB4E] text-[#292535] rounded-full font-bold text-sm hover:bg-[#e6b847] transition-colors duration-300 flex items-center justify-center relative">
              <img 
                src="/IconesSVG/sobreNos.svg" 
                alt="Gerenciar" 
                className="w-5 h-5 absolute left-4"
              />
              <span className="ml-2">Gerenciar sua Conta</span>
            </button>
          </Link>

          {/* Botão Sair */}
          <button 
            onClick={handleLogout}
            className="w-full max-w-[240px] bg-[#1D1D1D] text-[#EAEAEA] rounded-lg py-2 px-4 font-bold text-sm hover:bg-[#2a2a2a] transition-colors duration-300 flex items-center justify-center"
          >
            <img 
              src="/IconesSVG/exitDoor.svg" 
              alt="Sair" 
              className="w-6 h-6 mr-2"
            />
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}

export default IconProfile;