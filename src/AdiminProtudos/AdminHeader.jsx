import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Moon, Sun, Home, LayoutDashboard, Package, ShoppingCart, MessageSquare } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { useChat } from "../context/ChatContext";

export default function AdminHeader({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const { allChats } = useChat();

  // Calcula chats que terminaram com mensagem do usuário (precisam de resposta)
  const novasMsg = Object.values(allChats).filter(chat =>
    chat.length > 0 && chat[chat.length - 1].sender === 'user'
  ).length;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    toast.success("Saindo do painel administrativo...");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setTimeout(() => {
      onNavigate ? onNavigate("login") : window.location.href = "/login";
    }, 1000);
  };

  const navItems = [
    { name: "Dashboard", page: "admin", icon: <LayoutDashboard size={18} /> },
    { name: "Produtos", page: "admin-products", icon: <Package size={18} /> },
    { name: "Pedidos", page: "admin-orders", icon: <ShoppingCart size={18} /> },
    { name: "Responder", page: "admin-messages", icon: <MessageSquare size={18} />, isChat: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <h1 className="text-xl font-black italic tracking-tighter transition-all group-hover:scale-105">
              LINA<span className="text-linaclyn-red">CLYN</span>
            </h1>
            <span className="hidden xs:inline-flex px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md border border-primary/20">
              Admin
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-linaclyn-red transition-all relative group"
              >
                {item.icon}
                {item.name}
                {/* Badge de Notificação Desktop */}
                {item.isChat && novasMsg > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-linaclyn-red text-[10px] font-bold text-white animate-pulse">
                    {novasMsg}
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linaclyn-red transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('home')} className="h-9 w-9 text-muted-foreground" title="Loja">
              <Home className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9" disabled={!mounted}>
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-700" />)}
            </Button>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Botão Mobile com Badge de Notificação se houver msg */}
            <div className="relative md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="h-9 w-9">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              {!isMenuOpen && novasMsg > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-linaclyn-red animate-ping" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { onNavigate(item.page); setIsMenuOpen(false); }}
                className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-muted-foreground hover:text-linaclyn-red hover:bg-muted rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </div>
                {item.isChat && novasMsg > 0 && (
                  <span className="bg-linaclyn-red text-white text-xs px-2 py-0.5 rounded-full">
                    {novasMsg} novos
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}