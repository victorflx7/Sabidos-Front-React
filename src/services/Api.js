export const API_BASE_URL = "http://localhost:5000/api"; // ajuste para sua API

export const fetchWithAuth = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token"); // idToken Firebase

  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_BASE_URL}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    throw new Error(`Erro: ${res.status}`);
  }

  return res.json();
};
