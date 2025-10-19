import axios from "axios";
import { auth } from "../firebase/FirebaseConfig";
import { getIdToken } from "firebase/auth";

const api = axios.create({
    baseURL: "https://localhost:5000/api",
});

api.interceptors.request.use(async(config) => {
    if (auth.currentUser){
    const token = await getIdToken(auth.currentUser, true);
    config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export default api;