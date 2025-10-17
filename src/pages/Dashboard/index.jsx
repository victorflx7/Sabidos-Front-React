import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
//import { contarDocumentosPorUsuario, SomaTempoDasSeçõesPomo } from "../../services/firebaseService";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [totalResumos, setTotalResumos] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [totalTrabalho, setTotalTrabalho] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const buscarDados = async () => {
      if (!userId) return;

      const [events, resumos, flashcards] = await Promise.all([
        contarDocumentosPorUsuario("events", userId),
        contarDocumentosPorUsuario("resumos", userId),
        contarDocumentosPorUsuario("flashcards", userId),
      ]);

      setTotalEvents(events);
      setTotalResumos(resumos);
      setTotalFlashcards(flashcards);

      const total = await SomaTempoDasSeçõesPomo(userId);
      setTotalTrabalho(total);

      setCarregando(false);
    };

    buscarDados();
  }, [userId]);

  if (carregando) {
    return <div className="Dashboard">Carregando dados do usuário...</div>;
  }

  return (
    <div className='Dashboard'>
      <div className='mensagemSabido'>
        <img src='sabidoOfechado.svg' className='imgSabido' alt="Sabido" />
        <div className='cont'>
          <div className='cxpTxt'>
            <p className='txtSabido'>Opa sabido! Já checou suas notas<br /> hoje?</p>
            <p className='txtSabido'>Bons estudos, mantenha o foco.</p>
          </div>
        </div>
      </div>

      <div className='atEinf'>
        <div className="atalhos">
          <div className='contencao'>
            <Link to='/Agenda'><div className="circulo circulo1"><img src="diario.svg" alt="icone 1" style={{ width: '28px' }} /></div></Link>
            <Link to='/Resumo'><div className="circulo circulo2"><img src="notas.svg" alt="icone 2" style={{ width: '25px' }} /></div></Link>
            <Link to='/Pomodoro'><div className="circulo circulo3"><img src="ampulheta.svg" alt="icone 3" style={{ width: '20px' }} /></div></Link>
            <Link to='/Flashcard'><div className="circulo circulo4"><img src="caarta.svg" alt="icone 4" style={{ width: '28px' }} /></div></Link>
            <Link to=''><div className="circulo circulo5"><img src="grupo.svg" alt="icone 5" style={{ width: '28px' }} /></div></Link>
            <div className="circulo-central"><img src="sabidoOutline.svg" alt="icone central" style={{ width: '85px' }} /></div>
          </div>
        </div>


        <div className="infos">
          <div className="tempo_estudo">
            <div className='contencao_svgte'>
              <div className='blcsvg_do_te'>
                <img src='clock.svg' className='clock'>
                </img>
              </div>
            </div>
            <div className='blc_do_te'>
              <div className="text_estudo">Você estudou por:</div>
              <div className="tempo_valor">{totalTrabalho}</div>
            </div>
          </div>


          <div className="estatisticas">
            <div className="itens_ferramentas">
              <div className="top-square">
                <img src='notas.svg' className='notas'>
                </img>
              </div>
              <div className="item-nome">Notas</div>
              <div className="item-valor">{totalResumos}</div>
            </div>
            <div className="itens_ferramentas">
              <div className="top-square">
                <img src='caarta.svg' className='cards'>
                </img>
              </div>
              <div className="item-nome">Eventos</div>
              <div className="item-valor">{totalEvents}</div>
            </div>
            <div className="itens_ferramentas">
              <div className="top-square">
                <img src='caarta.svg' className='cards'>
                </img>
              </div>
              <div className="item-nome">Cards</div>
              <div className="item-valor">{totalFlashcards}</div>
            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;

