import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Settings, Moon, Sun, Home } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export default function AdminHeader({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    toast.success("Saindo do painel administrativo...");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    setTimeout(() => {
      if (onNavigate) {
        onNavigate("login");
      } else {
        window.location.href = "/login";
      }
    }, 1000);
  };

  const navItems = [
    { name: "Dashboard", page: "admin" },
    { name: "Produtos", page: "admin-products" },
    { name: "Pedidos", page: "admin-orders" },
    { name: "Clientes", page: "admin-customers" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo e Badge - Removido cursor pointer fixo e usado flex-1 no mobile para organizar */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <h1 className="text-xl font-black italic tracking-tighter transition-all group-hover:scale-105">
              LINA<span className="text-linaclyn-red">CLYN</span>
            </h1>
            <span className="hidden xs:inline-flex px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md border border-primary/20">
              Admin
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className="text-sm font-semibold text-muted-foreground hover:text-linaclyn-red transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linaclyn-red transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">

            {/* Home - Troquei text-gray-400 por text-muted-foreground */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('home')}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              title="Voltar para a Loja"
            >
              <Home className="h-4 w-4" />
            </Button>

            {/* Theme Toggle - Ajustado para não dar "pulo" de layout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 transition-transform hover:rotate-12"
              disabled={!mounted}
            >
              {!mounted ? (
                <div className="h-4 w-4 animate-pulse bg-muted rounded-full" />
              ) : theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden h-9 w-9">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu - Refinado com arredondamento moderno */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { onNavigate(item.page); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-base font-bold text-muted-foreground hover:text-linaclyn-red hover:bg-muted rounded-xl transition-all"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}