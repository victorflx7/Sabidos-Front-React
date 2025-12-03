import React, { useState, useEffect } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContexts";
import { supabase } from "../../services/supabaseClient";
import { db } from "../../firebase/FirebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const UserProfile = () => {
  const { currentUser, backendUser, logout } = useAuth();
  const [image, setImage] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // Preparando os dados para exibição (Prioridade: SQL -> Firebase -> Fallback)
  const displayData = {
    name: backendUser?.name || currentUser?.displayName || "Sem nome definido",
    bio: backendUser?.bio || "",
    photoURL: fotoPerfilUrl || currentUser?.photoURL || "",
    email: currentUser?.email || "",
    role: backendUser?.role || "Membro",
  };

  if (!currentUser && !backendUser) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Carregando perfil...
      </div>
    );
  }

  useEffect(() => {
    if (!currentUser) return;

    const getFoto = async () => {
      const userRef = doc(db, "usuarios", currentUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists() && snapshot.data().fotoPerfilUrl) {
        setFotoPerfilUrl(snapshot.data().fotoPerfilUrl);
      }
    };

    getFoto();
  }, [currentUser]);

  const uploadImage = async () => {
    if (!image || !currentUser?.uid) {
      alert("Selecione uma imagem.");
      return;
    }

    setLoading(true);

    const fileExt = image.name.split(".").pop();
    const fileName = `${currentUser.uid}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("imagens")
      .upload(fileName, image);

    if (uploadError) {
      alert("Erro ao subir imagem: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("imagens").getPublicUrl(fileName);

    const publicUrl = data.publicUrl;
    setFotoPerfilUrl(publicUrl);

    // Salvar no Firestore
    const userRef = doc(db, "usuarios", currentUser.uid);

    await updateDoc(userRef, {
      fotoPerfilUrl: publicUrl,
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-12">
      <div className="bg-main-gradient rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden p-1">
        <div className="bg-box rounded-xl overflow-hidden">
          {/* Header / Capa */}
          <div className="h-48 relative overflow-hidden">
            <img src="/public/profileBg.jpeg" alt="" />
            <div className="absolute top-4 right-4 text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {displayData.role.toUpperCase()}
            </div>
          </div>
          {/* Conteúdo do Perfil */}
          <div className="px-8 pb-8">
            {/* Área do Avatar e Botão Sair */}
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <div className="p-[3px] rounded-full bg-gradient-to-r from-[#1598e1] via-[#A45981] to-[#d5343b]">
                <label className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group block">
                  {displayData.photoURL ? (
                    <img
                      src={displayData.photoURL}
                      alt="Avatar"
                      className="w-full h-full object-cover group-hover:opacity-80 transition"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors mb-2 cursor-pointer"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>

            {/* Dados de Visualização */}
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-yellow mb-1">
                    Nome Completo
                  </label>
                  <h2 className="text-2xl font-bold text-white">
                    {displayData.name}
                  </h2>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-200  px-4 py-2 rounded-lg border border-gray-100 w-fit">
                    <Mail size={18} className="text-white" />
                    <span>{displayData.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow mb-1">
                  Sobre Mim
                </label>
                <p className="text-white leading-relaxed">
                  {displayData.bio || (
                    <span className="italic text-white">
                      Nenhuma descrição fornecida.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
