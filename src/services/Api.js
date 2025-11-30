// services/Api.js
// Já funciona! Use localhost:
export const API_BASE_URL = "http://localhost:5169/api"; 
// export const API_BASE_URL = "https://localhost:7091/api";

// 🔐 Função para validação de login (substitui fetchWithAuth)
export const validateLogin = async (firebaseUid, email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/validate-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirebaseUid: firebaseUid,
        Email: email
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro na validação: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Erro na validação do login:', error);
    throw error;
  }
};

// ✅ Função para sincronização (cadastro)
export const syncUserToBackend = async (user, name = null) => {
  try {
    const syncDto = {
      FirebaseUid: user.uid,
      Email: user.email,
      Name: name || user.displayName
    };

    const res = await fetch(`${API_BASE_URL}/user/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncDto)
    });

    if (!res.ok) {
      throw new Error(`Erro na sincronização: ${res.status}`);
    }
    
    const result = await res.json();
    console.log("Usuário sincronizado com sucesso:", result);
    return result;
  } catch (apiError) {
    console.error("Erro na sincronização com a API:", apiError);
    throw apiError;
  }
};
