import { API_BASE_URL } from './Api';

export const ResumoAPI = {
  // 📖 Buscar todos os resumos do usuário
  async getUserResumos(userUid) {
    const response = await fetch(`${API_BASE_URL}/resumos/user`, {
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

  // 📖 Buscar resumo por ID
  async getResumoById(id) {
    const response = await fetch(`${API_BASE_URL}/resumos/${id}`);
    const result = await response.json();
    return result;
  },

  // 🔢 Contar resumos do usuário
  async getResumosCount(userUid) {
    const response = await fetch(`${API_BASE_URL}/resumos/count`, {
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

  // ➕ Criar resumo
  async createResumo(resumoData, userUid) {
    const response = await fetch(`${API_BASE_URL}/resumos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        ResumoData: resumoData
      })
    });
    const result = await response.json();
    return result;
  },

  // ✏️ Atualizar resumo
  async updateResumo(id, resumoData, userUid) {
    const response = await fetch(`${API_BASE_URL}/resumos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        ResumoData: resumoData
      })
    });
    const result = await response.json();
    return result;
  },

  // 🗑️ Deletar resumo
  async deleteResumo(id, userUid) {
    const response = await fetch(`${API_BASE_URL}/resumos/${id}`, {
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

  // 🔍 Buscar resumos por período
  async getResumosByDateRange(startDate, endDate, userUid = null) {
    const requestBody = {
      StartDate: startDate,
      EndDate: endDate
    };
    
    if (userUid) {
      requestBody.FirebaseUid = userUid;
    }

    const response = await fetch(`${API_BASE_URL}/resumos/range`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const result = await response.json();
    return result;
  },

  // 📊 Estatísticas de resumos
  async getResumosStats(userUid, days = 30) {
    const response = await fetch(`${API_BASE_URL}/resumos/stats`, {
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