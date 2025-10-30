import { useLocation } from 'react-router-dom';
import IconProfile from './IconProfile/IconProfile';
import SlideBar from './SlideBar/SlideBar';
import SwitchModo from './SwitchModo/SwitchModo';

function Header() {
  const location = useLocation();
  
  // Rotas onde o Header NÃO deve aparecer
  const hiddenRoutes = ['/', '/login', '/cadastro'];
  
  // Se estiver numa rota hidden, não renderiza o Header
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }
  
  // Mapeia as rotas para títulos
  const getPageTitle = () => {
    const routeTitles = {
      '/dashboard': 'Dashboard',
      '/Resumo': 'Resumos',
      '/Agenda': 'Agenda',
      '/Pomodoro': 'Pomodoro',
      '/Flashcard': 'Flashcards',
      '/Perfil': 'Perfil',
      '/sobrenos': 'Sobre Nós'
    };
    
    return routeTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header className="flex items-center justify-between w-full max-w-6xl mx-auto py-4">
      <div className="w-[150px]">
        <SlideBar />
      </div>
      
      <div className="flex-1 text-center">
        <h1 className="text-3xl font-semibold text-[#FBCB4E]">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-5">
        <SwitchModo />
        <IconProfile />
      </div>
    </header>
  );
}

export default Header;