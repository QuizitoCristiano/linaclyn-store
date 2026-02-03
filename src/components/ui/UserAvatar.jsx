import { useState } from "react";
import { LogOut, ShieldCheck, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserAvatar({ onAdminAccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const [avatarImage, setAvatarImage] = useState(localStorage.getItem(`userAvatar_${user?.uid}`) || "");

  // --- LÓGICA DAS INICIAIS ---

  const userName = user?.name || user?.displayName || "Usuário";
  // Alteramos para aceitar o nome e garantir que ele exista antes de tratar
  const getInitials = (name) => {
    if (!name) return "U"; // "U" de Usuário como fallback padrão

    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };
  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
        // Salvamos com o UID para que cada usuário tenha sua foto no mesmo navegador
        localStorage.setItem(`userAvatar_${user?.uid}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full border-2 border-white/10 overflow-hidden hover:border-linaclyn-red transition-all focus:outline-none flex items-center justify-center"
      >
        {avatarImage ? (
          <img src={avatarImage} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-linaclyn-red flex items-center justify-center text-white text-sm font-black tracking-tighter">
            {/* Aqui usamos userName que é mais seguro, ou garantimos um texto fixo */}
            {getInitials(user?.name || user?.displayName || "Usuário")}
          </div>
        )}
      </button>


      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">

            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
              {/* Avatar pequeno dentro do menu */}
              <div className="h-10 w-10 rounded-full bg-linaclyn-red flex items-center justify-center text-white font-bold text-xs">
                {avatarImage ? (
                  <img src={avatarImage} className="rounded-full h-full w-full object-cover" />
                ) : getInitials(user.name || user.displayName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name || "Usuário"}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  {isAdmin ? "🛡️ Administrador" : "💎 Membro Premium"}
                </p>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => document.getElementById('avatarUpload').click()}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl transition-colors"
              >
                <Camera className="w-4 h-4 text-linaclyn-red" />
                Alterar Foto de Perfil
                <input id="avatarUpload" type="file" hidden accept="image/*" onChange={handleFileChange} />
              </button>

              {isAdmin && (
                <button
                  onClick={() => { onAdminAccess(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-linaclyn-red" />
                  Painel de Controle Admin
                </button>
              )}

              <div className="my-1 border-t border-white/5"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
              >
                <LogOut className="w-4 h-4" />
                Finalizar Sessão
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}