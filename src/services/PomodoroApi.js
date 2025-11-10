// services/PomodoroApi.js
import { API_BASE_URL } from './Api';

export const PomodoroApi = {
  // 📖 Buscar todos os pomodoros (opcional: filtrar por usuário)
  async getAllPomodoros(userUid = null) {
    const url = userUid 
      ? `${API_BASE_URL}/api/pomodoro?userFirebaseUid=${userUid}`
      : `${API_BASE_URL}/api/pomodoro`;

    const response = await fetch(url);
    const result = await response.json();
    return result;
  },

  // 📖 Buscar pomodoros do usuário
  async getUserPomodoros(userUid) {
    const response = await fetch(`${API_BASE_URL}/api/pomodoro/user/${userUid}`);
    const result = await response.json();
    return result;
  },

  // ⏱️ Contar tempo total do usuário
  async getTotalTime(userUid) {
    const response = await fetch(`${API_BASE_URL}/api/pomodoro/count-time?firebaseUid=${userUid}`);
    const result = await response.json();
    return result;
  },

  // ⏰ Buscar duração total do usuário
  async getTotalDuration(userUid) {
    const response = await fetch(`${API_BASE_URL}/api/pomodoro/user/${userUid}/total-duration`);
    const result = await response.json();
    return result;
  },

  // ➕ Criar pomodoro
  async createPomodoro(pomodoroData, userUid) {
    const response = await fetch(`${API_BASE_URL}/api/pomodoro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: userUid,
        PomodoroData: pomodoroData
      })
    });
    const result = await response.json();
    return result;
  }
};