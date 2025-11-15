// services/PomodoroApi.js
import { API_BASE_URL } from './Api';

export const PomodoroApi = {
  // 📖 Buscar todos os pomodoros (opcional: filtrar por usuário)
  async getAllPomodoros(userUid = null) {
    const url = userUid 
      ? `${API_BASE_URL}/pomodoro?userFirebaseUid=${userUid}`
      : `${API_BASE_URL}/pomodoro`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  },

  // 📖 Buscar pomodoros do usuário
  async getUserPomodoros(userUid) {
    const response = await fetch(`${API_BASE_URL}/pomodoro/user/${userUid}`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  },

  // ⏱️ Contar tempo total do usuário
  async getTotalTime(userUid) {
    const response = await fetch(`${API_BASE_URL}/pomodoro/count-time?firebaseUid=${userUid}`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  },

  // ⏰ Buscar duração total do usuário
  async getTotalDuration(userUid) {
    const response = await fetch(`${API_BASE_URL}/pomodoro/user/${userUid}/total-duration`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  },

  // ➕ Criar pomodoro (CORRIGIDO)
  async createPomodoro(pomodoroData, userUid) {
    const requestBody = {
        FirebaseUid: userUid,
        PomodoroData: pomodoroData
    };

    console.log('Enviando para API:', requestBody); // Debug

    const response = await fetch(`${API_BASE_URL}/pomodoro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro detalhado:', errorText);
      throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  }
};