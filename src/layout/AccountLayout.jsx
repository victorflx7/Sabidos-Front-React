import { Outlet } from 'react-router-dom';
import './AccountLayout.css'
import Footer from '../Components/Footer/Footer';

export default function AccountLayout() {
  return (
    <div className="account-layout">
      
      {/* Conteúdo dinâmico das rotas */}
      <main className="account-content-area">
        <Outlet /> {/* Aqui as páginas serão injetadas */}
      </main>
      
     
      <Footer />
    </div>
  );
}


