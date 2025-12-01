// pages/Agenda/AgendaPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContexts';
import { EventoApi } from '../../services/EventoApi.js';

const AgendaPage = () => {
    const { currentUser, backendUser } = useAuth();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date()); // Data selecionada no calendário
    const [modalVisible, setModalVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventTime, setEventTime] = useState("00:00"); // Horário padrão
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 
    const [editingEvent, setEditingEvent] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);


    // 🔄 Carregar eventos do usuário
    useEffect(() => {
        if (currentUser?.uid) {
            loadUserEvents();
        }
    }, [currentUser]);

    const loadUserEvents = async () => {
        if (!currentUser?.uid) return;
        
        setLoading(true);
        setError("");
        try {
            const result = await EventoApi.getUserEventos(currentUser.uid);
            if (result.success) {
                setEvents(result.data);
            } else {
                setError("Erro ao carregar eventos");
            }
        } catch (err) {
            console.error("Erro ao carregar eventos:", err);
            setError("Falha ao carregar eventos");
        } finally {
            setLoading(false);
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const days = [];

        // Células vazias
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square bg-transparent"></div>);
        }

        // Dias do mês
        for (let i = 1; i <= lastDate; i++) {
            const fullDate = new Date(year, month, i);
            const dateString = fullDate.toISOString().split('T')[0];
            
            // Verifica se é hoje
            const today = new Date();
            const isToday = fullDate.toDateString() === today.toDateString();
            
            // Verifica se é a data selecionada
            const isSelected = selectedDate && fullDate.toDateString() === selectedDate.toDateString();
            
            // Verifica se há evento neste dia
            const hasEvent = events.some(event => {
                const eventDate = new Date(event.dataEvento);
                return eventDate.toDateString() === fullDate.toDateString();
            });

            // Eventos do dia para tooltip
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.dataEvento);
                return eventDate.toDateString() === fullDate.toDateString();
            });

            days.push(
                <div
                    key={dateString}
                    className={`aspect-square flex items-center justify-center cursor-pointer rounded-lg text-white text-lg font-medium transition-all duration-200 ${
                        isSelected 
                            ? 'bg-[#FBCB4E] text-[#292535] scale-105' 
                            : isToday
                                ? 'bg-[#3B2868] border-2 border-[#FBCB4E]'
                                : hasEvent
                                    ? 'bg-white/10 border-2 border-[#FBCB4E]'
                                    : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => handleDayClick(fullDate)}
                    title={dayEvents.length > 0 ? 
                        `${dayEvents.length} evento(s):\n\n${dayEvents.map(e => 
              `• ${e.titleEvent}${e.localEvento ? `\n  📍 ${e.localEvento}` : ''}`
            ).join('\n\n')}` : 
            `✨ Clique para adicionar evento`}
                        
                >
                    {i}
                    {hasEvent && !isSelected && (
                        <div className="relative left-1 bottom-3 w-2 h-2 bg-[#FBCB4E] rounded-full"></div>
                    )}
                    {isToday && !isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-[#FBCB4E] rounded-full"></div>
                    )}
                </div>
            );
        }

        return days;
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        // Não abre o modal automaticamente, apenas seleciona a data
        console.log("Data selecionada:", date.toLocaleDateString('pt-BR'));
    };

    const handleAddButtonClick = () => {
        if (!selectedDate) {
            // Se nenhuma data foi selecionada, usa a data atual
            setSelectedDate(new Date());
        }
        setModalVisible(true);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
        // Limpa a seleção ao mudar de mês
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
        // Limpa a seleção ao mudar de mês
        setSelectedDate(null);
    };

    // Combina data selecionada com horário escolhido
    const getFullDateTime = () => {
        if (!selectedDate) return new Date();
        
        const [hours, minutes] = eventTime.split(':').map(Number);
        const fullDate = new Date(selectedDate);
        fullDate.setHours(hours, minutes, 0, 0);
        return fullDate;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!currentUser?.uid) {
            setError("Usuário não autenticado");
            return;
        }

        if (!eventTitle) {
            setError("Título é obrigatório");
            return;
        }

        try {
            setError("");
            const fullDateTime = getFullDateTime();
            
            const eventoData = {
                TitleEvent: eventTitle,
                DataEvento: fullDateTime.toISOString(),
                DescriptionEvent: eventDescription || null,
                LocalEvento: eventLocation || null
            };

            const result = await EventoApi.createEvento(eventoData, currentUser.uid);
            
            if (result.success) {
                setModalVisible(false);
                setEventTitle("");
                setEventDescription("");
                setEventLocation("");
                setEventTime("00:00"); // Reset para horário padrão
                // Recarrega a lista de eventos
                await loadUserEvents();
            } else {
                setError("Erro ao criar evento");
            }
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
            setError(err.message || "Erro ao salvar evento");
        }
    };

            // Função para abrir edição
            const handleEditClick = (event) => {
                setEditingEvent(event);
                setEventTitle(event.titleEvent);
                setEventDescription(event.descriptionEvent || "");
                setEventLocation(event.localEvento || "");
                setEventTime(new Date(event.dataEvento).toTimeString().slice(0, 5));
                setSelectedDate(new Date(event.dataEvento));
                setEditModalVisible(true);
            };

            // Função para salvar edição
            const handleSaveEdit = async (e) => {
                e.preventDefault();
                
                if (!currentUser?.uid || !editingEvent) return;

                try {
                    const fullDateTime = getFullDateTime();
                    
                    const eventoData = {
                        TitleEvent: eventTitle,
                        DataEvento: fullDateTime.toISOString(),
                        DescriptionEvent: eventDescription || null,
                        LocalEvento: eventLocation || null
                    };

                    const result = await EventoApi.updateEvento(editingEvent.id, eventoData, currentUser.uid);
                    
                    if (result.success) {
                        setEditModalVisible(false);
                        setEditingEvent(null);
                        // Reset form
                        setEventTitle("");
                        setEventDescription("");
                        setEventLocation("");
                        setEventTime("00:00");
                        // Recarrega eventos
                        await loadUserEvents();
                    }
                } catch (err) {
                    console.error("Erro ao editar evento:", err);
                    setError(err.message || "Erro ao editar evento");
                }
            };

    const handleDeleteEvent = async (eventId) => {
        if (!currentUser?.uid || !window.confirm("Tem certeza que deseja excluir este evento?")) {
            return;
        }

        try {
            const result = await EventoApi.deleteEvento(eventId, currentUser.uid);
            if (result.success) {
                await loadUserEvents(); // Recarrega a lista
            } else {
                setError("Erro ao excluir evento");
            }
        } catch (err) {
            console.error("Erro ao excluir evento:", err);
            setError("Erro ao excluir evento");
        }
    };

        // 🆕 CANCELAR EDIÇÃO
        const handleCancelEdit = () => {
            setEditModalVisible(false);
            setEditingEvent(null);
            // Reset para valores padrão
            setEventTitle("");
            setEventDescription("");
            setEventLocation("");
            setEventTime("00:00");
            setSelectedDate(new Date());
        };

    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateForDisplay = (date) => {
        if (!date) return "Selecione uma data";
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Gera opções de horário (de 00:00 até 23:45)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(
                    <option key={timeString} value={timeString}>
                        {timeString}
                    </option>
                );
            }
        }
        return times;
    };
    

    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <main className='flex flex-col lg:flex-row justify-center items-start min-h-[90vh] lg:h-[90vh] p-4 lg:p-8 gap-8 w-full max-w-7xl mx-auto'>
                
                {/* CALENDÁRIO */}
                <div className="w-full max-w-sm sm:max-w-md lg:w-[480px] bg-[#292535] rounded-2xl shadow-xl overflow-hidden p-6">
                    
                    {/* HEADER DO CALENDÁRIO */}
                    <div className="flex justify-between items-center py-2 mb-4">
                        <button 
                            onClick={handlePrevMonth} 
                            className="bg-transparent border-none cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-[#FBCB4E]/20"
                        >
                            <img 
                                src="IconesSVG/setaAgendaE.svg" 
                                alt="Mês Anterior" 
                                className="w-6 h-6 invert sepia-[30%] saturate-[1000%] hue-rotate-[340deg] brightness-[105%] contrast-[95%]" 
                            />
                        </button>
                        
                        <span className='text-[#FBCB4E] text-2xl flex items-baseline gap-2'>
                            <span className='text-3xl font-bold capitalize'>
                                {currentDate.toLocaleDateString('pt-BR', { month: 'long' })}
                            </span>
                            <span className='text-xl opacity-80'>
                                {currentDate.getFullYear()}
                            </span>
                        </span>
                        
                        <button 
                            onClick={handleNextMonth}
                            className="bg-transparent border-none cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-[#FBCB4E]/20"
                        >
                            <img 
                                src="IconesSVG/setaAgendaD.svg" 
                                alt="Próximo Mês" 
                                className="w-6 h-6 invert sepia-[30%] saturate-[1000%] hue-rotate-[340deg] brightness-[105%] contrast-[95%]" 
                            />
                        </button>
                    </div>
                    
                    {/* DIAS DA SEMANA */}
                    <div className="grid grid-cols-7 text-center mb-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                            <div 
                                key={day} 
                                className={`font-semibold p-2 text-base uppercase ${
                                    index === 0 ? 'text-red-500' : 'text-[#FBCB4E]'
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* DIAS DO MÊS */}
                    <div className="grid grid-cols-7 gap-2">
                        {renderCalendar()}
                    </div>
                    
                    {/* DATA SELECIONADA */}
                    {selectedDate && (
                        <div className="mt-4 p-3 bg-[#1a1a2e] rounded-lg border-l-4 border-[#FBCB4E]">
                            <p className="text-sm text-[#FBCB4E] mb-1">Data selecionada:</p>
                            <p className="text-white font-semibold">
                                {formatDateForDisplay(selectedDate)}
                            </p>
                        </div>
                    )}
                    
                    {/* BOTÃO ADICIONAR */}
                    <div className="mt-6 text-center">
                        <button 
                            className="w-16 h-16 rounded-full border-none bg-[#FBCB4E] text-[#292535] text-4xl font-normal cursor-pointer transition-all duration-300 flex items-center justify-center shadow-lg hover:bg-[#ffd86e] hover:scale-105 hover:shadow-xl" 
                            onClick={handleAddButtonClick}
                            title="Adicionar evento na data selecionada"
                        >
                            +
                        </button>
                        <p className="text-xs text-gray-400 mt-2">
                            {selectedDate ? "Adicionar à data selecionada" : "Adicionar evento"}
                        </p>
                    </div>
                </div>

                {/* LISTA DE EVENTOS */}
                <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none p-6 rounded-2xl bg-[#292535] shadow-xl max-h-[600px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#FBCB4E]">
                        <h3 className="text-xl font-semibold text-[#FBCB4E] m-0">
                            Meus Eventos
                        </h3>
                        <span className="text-sm text-gray-400">
                            {events.length} evento(s)
                        </span>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBCB4E]"></div>
                            <p className="text-gray-400 mt-2">Carregando eventos...</p>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {events
                                .sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento))
                                .map((event) => (
                                <div 
                                    key={event.id} 
                                    className="p-4 rounded-xl bg-[#1a1a2e] shadow-md transition-all duration-300 hover:translate-x-1 hover:shadow-lg border-l-4 border-[#FBCB4E] group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-lg text-[#FBCB4E] mb-2 block">
                                                {formatEventDate(event.dataEvento)}
                                            </span>
                                            <h4 className="text-xl font-semibold text-white m-0 mb-2">
                                                {event.titleEvent}
                                            </h4>
                                             {/* {(event.descriptionEvent || event.localEvento) && (
                                            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded ml-2 transition-all duration-300 group-hover:text-[#FBCB4E] group-hover:bg-[#FBCB4E]/10 shrink-0">
                                                ler mais
                                            </span>
                                        )} */}
                                             {/* INFORMAÇÕES (se existirem) */}
                                        {event.descriptionEvent && (
                                            <p className="text-gray-300 text-sm m-0 mb-2 bg-blue-500/20 p-2 rounded  break-words whitespace-normal overflow-hidden">
                                                📝 <strong>Descrição:</strong> {event.descriptionEvent}
                                            </p>
                                        )}
                                        {event.localEvento && (
                                            <p className="text-gray-400 text-xs m-0 flex items-center gap-1 bg-green-500/20 p-2 rounded break-words">
                                                📍 <strong>Local:</strong> {event.localEvento}
                                            </p>
                                        )}
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(event)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2"
                                            title="Editar evento"
                                        >
                                                ✏️
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors duration-200 ml-2 p-2"
                                            title="Excluir evento"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    {event.isCompleted && (
                                        <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                            Concluído
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📅</div>
                            <p className='text-gray-400 text-lg'>
                                Nenhum evento encontrado.
                            </p>
                            <p className='text-gray-500 text-sm mt-2'>
                                Selecione uma data e clique no "+" para adicionar seu primeiro evento!
                            </p>
                        </div>
                    )}
                </div>

                {/* MODAL DE NOVO EVENTO */}
                {modalVisible && (
                    <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300">
                        <div className="bg-[#292535] p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-white">
                            <span 
                                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e]" 
                                onClick={() => setModalVisible(false)}
                            >
                                &times;
                            </span>
                            <h2 className="mt-0 text-[#FBCB4E] text-2xl font-semibold mb-6">
                                Novo Evento
                            </h2>
                            
                            {/* INFO DA DATA SELECIONADA */}
                            {selectedDate && (
                                <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border-l-4 border-[#FBCB4E]">
                                    <p className="text-sm text-[#FBCB4E] mb-1">Data selecionada no calendário:</p>
                                    <p className="text-white font-semibold">
                                        {formatDateForDisplay(selectedDate)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Você pode alterar a data e horário abaixo
                                    </p>
                                </div>
                            )}
                            
                            <form className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="event-title" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                        Título do Evento *
                                    </label>
                                    <input
                                        type="text"
                                        id="event-title"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        required
                                        className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        placeholder="Ex: Reunião, Prova, Aniversário..."
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="event-date" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                            Data
                                        </label>
                                        <input
                                            type="date"
                                            id="event-date"
                                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                            className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="event-time" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                            Horário
                                        </label>
                                        <select
                                            id="event-time"
                                            value={eventTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                            className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        >
                                            {generateTimeOptions()}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="event-description" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                        Descrição (Opcional)
                                    </label>
                                    <textarea
                                        id="event-description"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        rows="3"
                                        className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                                        placeholder="Detalhes do evento..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="event-location" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                        Local (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        id="event-location"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                        className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        placeholder="Ex: Sala 305, Online, Biblioteca..."
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={!eventTitle}
                                    className="w-full p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] disabled:bg-gray-500 disabled:cursor-not-allowed mt-4"
                                >
                                    Salvar Evento
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                                {/* MODAL DE EDIÇÃO */}
                {editModalVisible && editingEvent && (
                    <div className="fixed z-[1000] left-0 top-0 w-full h-full bg-black/70 flex items-center justify-center transition-all duration-300">
                        <div className="bg-[#292535] p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-white">
                            <span 
                                className="absolute top-4 right-4 text-3xl cursor-pointer text-[#FBCB4E] transition-all duration-200 hover:rotate-90 hover:text-[#ffd86e]" 
                                onClick={handleCancelEdit}
                            >
                                &times;
                            </span>
                            <h2 className="mt-0 text-[#FBCB4E] text-2xl font-semibold mb-6">
                                Editar Evento
                            </h2>
                            
                            {/* INFO DO EVENTO ORIGINAL */}
                            <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border-l-4 border-blue-500">
                                <p className="text-sm text-blue-400 mb-1">Editando evento:</p>
                                <p className="text-white font-semibold text-sm">
                                    "{editingEvent.titleEvent}"
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Criado em: {new Date(editingEvent.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            
                            <form className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="edit-event-title" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                        Título do Evento *
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-event-title"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        required
                                        className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        placeholder="Ex: Reunião, Prova, Aniversário..."
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="edit-event-date" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                            Data
                                        </label>
                                        <input
                                            type="date"
                                            id="edit-event-date"
                                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                            className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="edit-event-time" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                            Horário
                                        </label>
                                        <select
                                            id="edit-event-time"
                                            value={eventTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                            className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        >
                                            {generateTimeOptions()}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit-event-description" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                        Descrição (Opcional)
                                    </label>
                                    <textarea
                                        id="edit-event-description"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        rows="3"
                                        className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20 resize-none"
                                        placeholder="Detalhes do evento..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="edit-event-location" className="text-base font-semibold text-[#FBCB4E] text-left block mb-2">
                                        Local (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-event-location"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                        className="w-full p-3 rounded-lg border-2 border-gray-600 bg-[#1a1a2e] text-white text-base transition-all duration-300 focus:outline-none focus:border-[#FBCB4E] focus:ring-4 focus:ring-[#FBCB4E]/20"
                                        placeholder="Ex: Sala 305, Online, Biblioteca..."
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="flex-1 p-3 rounded-lg border-2 border-gray-600 bg-transparent text-gray-300 text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:text-white"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveEdit}
                                        disabled={!eventTitle}
                                        className="flex-1 p-3 rounded-lg border-none bg-[#FBCB4E] text-[#292535] text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#ffd86e] disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AgendaPage;