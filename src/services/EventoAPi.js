// services/EventoApi.js
import { API_BASE_URL } from './Api';

export const EventoApi = {
  // 📖 Buscar todos os eventos do usuário (CORRIGIDO)
  async getUserEventos(userUid) {
    const response = await fetch(`${API_BASE_URL}/eventos/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  },

  // 📖 Buscar evento por ID (Já está correto)
  async getEventoById(id) {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`);
    const result = await response.json();
    return result;
  },

  // 🔢 Contar eventos do usuário (CORRIGIDO)
  async getEventosCount(userUid) {
    const response = await fetch(`${API_BASE_URL}/eventos/count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid
      })
    });
    const result = await response.json();
    return result;
  },

  // ➕ Criar evento (Já está correto)
  async createEvento(eventoData, userUid) {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
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

  // ✏️ Atualizar evento (Já está correto)
  async updateEvento(id, eventoData, userUid) {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
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

  // 🗑️ Deletar evento (Já está correto)
  async deleteEvento(id, userUid) {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
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
  },

  // 📅 NOVOS MÉTODOS ADICIONAIS
  async getEventosByDateRange(startDate, endDate, userUid = null) {
    const requestBody = {
      StartDate: startDate,
      EndDate: endDate
    };
    
    if (userUid) {
      requestBody.FirebaseUid = userUid;
    }

    const response = await fetch(`${API_BASE_URL}/eventos/range`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const result = await response.json();
    return result;
  },

  async getUpcomingEventos(days = 7, userUid = null) {
    const requestBody = { Days: days };
    
    if (userUid) {
      requestBody.FirebaseUid = userUid;
    }

    const response = await fetch(`${API_BASE_URL}/eventos/upcoming`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const result = await response.json();
    return result;
  }
};