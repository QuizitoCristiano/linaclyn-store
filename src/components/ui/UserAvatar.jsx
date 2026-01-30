import { useState } from "react";
import { User, LogOut, ShieldCheck, Camera } from "lucide-react";

export default function UserAvatar({ onAdminAccess, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Atleta" };
  const [avatarImage, setAvatarImage] = useState(localStorage.getItem("userAvatar") || "");

  const handleLogout = () => {
    localStorage.clear(); // Limpa TUDO no localStorage
    window.location.href = "/login";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
        localStorage.setItem("userAvatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* Botão do Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full border-2 border-white/10 overflow-hidden hover:border-linaclyn-red transition-all focus:outline-none"
      >
        {avatarImage ? (
          <img src={avatarImage} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-linaclyn-red flex items-center justify-center text-white font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* Dropdown Menu Manual (Evita erros de biblioteca) */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Membro Premium</p>
            </div>

            <div className="p-2">
              {/* Opção Alterar Foto */}
              <button
                onClick={() => document.getElementById('avatarUpload').click()}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl transition-colors"
              >
                <Camera className="w-4 h-4 text-linaclyn-red" />
                Alterar Foto
                <input id="avatarUpload" type="file" hidden accept="image/*" onChange={handleFileChange} />
              </button>

              {/* Opção Admin */}
              <button
                onClick={() => { onAdminAccess(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-linaclyn-red" />
                Painel Admin
              </button>

              <div className="my-1 border-t border-white/5"></div>

              {/* Opção Sair */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}