import React, { useState, useEffect } from 'react';
// Remova o CSS original: import './AgendaPage.css'
// Remova o CSS do componente: import './Agenda.css'; 

// Importações do Firebase e Configurações (Mantidas)
import { db, collection, addDoc, query, onSnapshot  } from "../../firebase/FirebaseConfig";
import { getAuth } from "firebase/auth";
import {  where } from "firebase/firestore";

const AgendaPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [events, setEvents] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user?.uid;

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                const q = query(
                    collection(db, "events") , where("userId", "==", user.uid)
                );
    
                const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
                    const loadedEvents = [];
                    querySnapshot.forEach((doc) => {
                        loadedEvents.push({ id: doc.id, ...doc.data() });
                    });
                    setEvents(loadedEvents);
                });
    
                // Clean up snapshot listener
                return () => unsubscribeSnapshot();
            }
        });
    
        // Clean up auth listener
        return () => unsubscribeAuth();
    }, []);
    
    
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const days = [];

        // Células vazias (empty-cell)
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square bg-transparent"></div>);
        }

        // Dias do mês (day)
        for (let i = 1; i <= lastDate; i++) {
            const fullDate = new Date(year, month, i).toISOString().split('T')[0];
            
            // Verifica se há evento neste dia para aplicar estilo de destaque, se necessário.
            const hasEvent = events.some(event => {
                const eventDateStr = new Date(event.date).toISOString().split('T')[0];
                return eventDateStr === fullDate;
            });

            days.push(
                <div
                    key={fullDate}
                    className={`aspect-square flex items-center justify-center cursor-pointer rounded-lg text-white text-lg font-medium transition-all duration-200 bg-white/5 hover:bg-[#FBCB4E] hover:text-[#292535] hover:scale-105 ${hasEvent ? 'border-2 border-[#FBCB4E]' : ''}`}
                    data-value={fullDate}
                    onClick={() => handleDayClick(fullDate)}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setModalVisible(true);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (selectedDate && eventTitle) {
            try {
                await addDoc(collection(db, "events"), {
                    userId : userId,
                    title: eventTitle,
                    date: selectedDate,
                    createdAt: new Date().toISOString()

                });
                setModalVisible(false);
                setEventTitle("");
            } catch (error) {
                console.error("Erro ao salvar evento: ", error);
            }
        }
    };
        

    return (
        // .agenda (wrapper geral) - Replicando height: 100vh do .agenda
        <div className="flex justify-center items-center min-h-screen w-full"> 
            
            {/* .main-agenda - Replicando display: flex, justify-content: center, etc. e height: 90vh da tag main original */}
            <main className='flex flex-col lg:flex-row justify-center items-center min-h-[90vh] lg:h-[90vh] p-4 lg:p-8 gap-8 w-full max-w-7xl mx-auto'>
                
                {/* .calendar-container */}
                <div className="w-full max-w-sm sm:max-w-md lg:w-[480px] bg-[#292535] rounded-2xl shadow-xl overflow-hidden p-6">
                    
                    {/* .calendar-header */}
                    <div className="flex justify-between items-center py-2 mb-4">
                        <button 
                            id="prevMonth" 
                            onClick={handlePrevMonth} 
                            className="bg-transparent border-none cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-[#FBCB4E]/20"
                        >
                            <img 
                                src="/public/SetaEsquerda.svg" 
                                alt="Mês Anterior" 
                                className="w-6 h-6 invert sepia-[30%] saturate-[1000%] hue-rotate-[340deg] brightness-[105%] contrast-[95%]" 
                            />
                        </button>
                        
                        {/* #monthYear */}
                        <span id="monthYear" className='text-[#FBCB4E] text-2xl flex items-baseline gap-2'>
                            {/* .monthvalue */}
                            <span className='text-3xl font-bold'>
                                {currentDate.toLocaleDateString('pt-BR', {
                                    month: 'long',
                                })}
                            </span>
                            {/* .yearvalue */}
                            <span className='text-xl opacity-80'>
                                {currentDate.toLocaleDateString('pt-BR', {
                                    year: 'numeric',
                                })}
                            </span>
                        </span>
                        
                        <button 
                            id="nextMonth" 
                            onClick={handleNextMonth}
                            className="bg-transparent border-none cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-[#FBCB4E]/20"
                        >
                            <img 
                                src="/public/SetaDireita.svg" 
                                alt="Próximo Mês" 
                                className="w-6 h-6 invert sepia-[30%] saturate-[1000%] hue-rotate-[340deg] brightness-[105%] contrast-[95%]" 
                            />
                        </button>
                    </div>
                    
                    {/* .calendar-weekdays */}
                    <div className="grid grid-cols-7 text-center mb-2">
                        <div className="font-semibold p-2 text-base uppercase text-red-500">Dom</div>
                        <div className="font-semibold p-2 text-base uppercase text-[#FBCB4E]">Seg</div>
                        <div className="font-semibold p-2 text-base uppercase text-[#FBCB4E]">Ter</div>
                        <div className="font-semibold p-2 text-base uppercase text-[#FBCB4E]">Qua</div>
                        <div className="font-semibold p-2 text-base uppercase text-[#FBCB4E]">Qui</div>
                        <div className="font-semibold p-2 text-base uppercase text-[#FBCB4E]">Sex</div>
                        <div className="font-semibold p-2 text-base uppercase text-[#FBCB4E]">Sáb</div>
                    </div>
                    
                    {/* .calendar-days */}
                    <div className="grid grid-cols-7 gap-2" id="calendarDays">
                        {renderCalendar()}
                    </div>
                    
                    {/* .box-btnadd */}
                    <div className="mt-6 text-center">
                        <button 
                            className="w-16 h-16 rounded-full border-none bg-[#FBCB4E] text-[#292535] text-4xl font-normal cursor-pointer transition-all duration-300 flex items-center justify-center shadow-lg hover:bg-[#ffd86e] hover:scale-105 hover:shadow-xl" 
                            onClick={() => setModalVisible(true)}
                        >
                            &#43;
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {modalVisible && (
                    <div 
                        id="event-modal" 
                        className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300"
                    >
                        <div className="bg-[#292535] p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-white">
                            <span 
                                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e]" 
                                onClick={() => setModalVisible(false)}
                            >
                                &times;
                            </span>
                            <h2 className="mt-0 text-[#FBCB4E] text-2xl font-semibold mb-6">Novo Evento</h2>
                            <form id="dataForm" className="flex flex-col gap-6">
                                <label htmlFor="event-title" className="text-base font-semibold text-[#FBCB4E] text-left">
                                    Título do Evento:
                                </label>
                                <input
                                    type="text"
                                    id="event-title"
                                    name="Titulo_evento"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    required
                                    className="p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                />
                                <button
                                    id="btnSalvar"
                                    type="button"
                                    onClick={(e) => handleSave(e)}
                                    className="p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] hover:-translate-y-0.5"
                                >
                                    Salvar
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* .events-container */}
                <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none p-6 rounded-2xl bg-[#292535] shadow-xl max-h-[600px] overflow-y-auto">
                    <h3 className="mt-0 mb-6 text-xl font-semibold text-[#FBCB4E] pb-2 border-b-2 border-[#FBCB4E]">
                        Eventos Salvos
                    </h3>
                    <div className="flex flex-col gap-4">
                        {/* .events-box */}
                        {events.length > 0 ? (
                            events.map((event) => {
                                // Converte o campo `date` para um formato legível
                                const formattedDate = event.date instanceof Object
                                    ? new Date(event.date.seconds * 1000).toLocaleDateString('pt-BR')
                                    : event.date;

                                return (
                                    // .event-item
                                    <div 
                                        key={event.id} 
                                        className="p-3 md:p-4 rounded-xl bg-[#1a1a2e] shadow-md transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
                                    >
                                        {/* .event-date */}
                                        <span className="text-sm text-[#FBCB4E] mb-1 block">
                                            {formattedDate}
                                        </span>
                                        {/* .event-title */}
                                        <h4 className="text-base font-semibold text-white m-0">
                                            {event.title}
                                        </h4>
                                    </div>
                                );
                            })
                        ) : (
                            <p className='text-gray-400 italic text-center mt-8'>
                                Nenhum evento salvo.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AgendaPage;