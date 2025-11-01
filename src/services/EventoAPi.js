// services/EventoApi.js
import { API_BASE_URL } from './Api';

export const EventoApi = {
  // 📖 Buscar todos os eventos do usuário
  async getUserEventos(userUid) {
    const response = await fetch(`${API_BASE_URL}/api/eventos/user/${userUid}`);
    const result = await response.json();
    return result;
  },

  // 📖 Buscar evento por ID
  async getEventoById(id) {
    const response = await fetch(`${API_BASE_URL}/api/eventos/${id}`);
    const result = await response.json();
    return result;
  },

  // 🔢 Contar eventos do usuário
  async getEventosCount(userUid) {
    const response = await fetch(`${API_BASE_URL}/api/eventos/count?firebaseUid=${userUid}`);
    const result = await response.json();
    return result;
  },

  // ➕ Criar evento
  async createEvento(eventoData, userUid) {
    const response = await fetch(`${API_BASE_URL}/api/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        EventoData: eventoData
      })
    });
    const result = await response.json();
    return result;
  },

  // ✏️ Atualizar evento
  async updateEvento(id, eventoData, userUid) {
    const response = await fetch(`${API_BASE_URL}/api/eventos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        EventoData: eventoData
      })
    });
    const result = await response.json();
    return result;
  },

  // 🗑️ Deletar evento
  async deleteEvento(id, userUid) {
    const response = await fetch(`${API_BASE_URL}/api/eventos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid
      })
    });
    const result = await response.json();
    return result;
  }
};