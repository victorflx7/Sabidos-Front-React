// services/FlashcardApi.js
import { API_BASE_URL } from './Api';

export const FlashCardAPI = {
  // 📖 Buscar todos os flashcards do usuário
  async getUserFlashcards(userUid) {
    const response = await fetch(`${API_BASE_URL}/flashcards/user`, {
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

  // 📖 Buscar flashcard por ID
  async getFlashcardById(id) {
    const response = await fetch(`${API_BASE_URL}/flashcards/${id}`);
    const result = await response.json();
    return result;
  },

  // 🔢 Contar flashcards do usuário
  async getFlashcardsCount(userUid) {
    const response = await fetch(`${API_BASE_URL}/flashcards/count`, {
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

  // ➕ Criar flashcard
  async createFlashcard(flashcardData, userUid) {
    const response = await fetch(`${API_BASE_URL}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        FlashcardData: flashcardData
      })
    });
    const result = await response.json();
    return result;
  },

  // ✏️ Atualizar flashcard
  async updateFlashcard(id, flashcardData, userUid) {
    const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        FlashcardData: flashcardData
      })
    });
    const result = await response.json();
    return result;
  },

  // 🗑️ Deletar flashcard
  async deleteFlashcard(id, userUid) {
    const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
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

  // 🔄 MÉTODOS ADICIONAIS PARA FLASHCARDS
  async getFlashcardsByCategory(category, userUid = null) {
    const requestBody = {
      Category: category
    };
    
    if (userUid) {
      requestBody.FirebaseUid = userUid;
    }

    const response = await fetch(`${API_BASE_URL}/flashcards/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const result = await response.json();
    return result;
  },

  async getRecentFlashcards(limit = 10, userUid = null) {
    const requestBody = { Limit: limit };
    
    if (userUid) {
      requestBody.FirebaseUid = userUid;
    }

    const response = await fetch(`${API_BASE_URL}/flashcards/recent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const result = await response.json();
    return result;
  },

  // 🎯 Método específico para estudo - marcar flashcard como estudado
  async markAsStudied(flashcardId, userUid, masteryLevel = 1) {
    const response = await fetch(`${API_BASE_URL}/flashcards/${flashcardId}/study`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        MasteryLevel: masteryLevel,
        StudiedAt: new Date().toISOString()
      })
    });
    const result = await response.json();
    return result;
  },

  // 📊 Estatísticas de estudo
  async getStudyStats(userUid, days = 30) {
    const response = await fetch(`${API_BASE_URL}/flashcards/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        Days: days
      })
    });
    const result = await response.json();
    return result;
  }
};