import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Heart, Moon, Sun, LogIn } from "lucide-react";

import SearchBar from "./SearchBar";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext"; // Importante para saber se está logado
import UserAvatar from "./UserAvatar";
import Carrinho from "./ShoppingCart";
import WishlistItem from "./WishlistView";

export default function Header({
  currentPage = "home",
  onNavigate,
  onAdminAccess,
}) {
  const { user } = useAuth(); // Verifica se o usuário existe
  const { theme, toggleTheme, mounted } = useTheme();
  const { performSearch } = useProducts();

  const {
    isMenuOpen,
    toggleCart,
    cartItems,
    favoriteItem,
    openfavoriteItem,
    toggleIconMenu,
    closeMenu,
  } = useCart();

  const navItems = [
    { name: "Home", page: "home" },
    { name: "Sobre", page: "sobre" },
    { name: "Serviços", page: "servicos" },
    { name: "Contato", page: "contato" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* 1. LOGO */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <h1 className="text-xl font-black italic tracking-tighter transition-all group-hover:scale-105">
                LINA<span className="text-linaclyn-red">CLYN</span>
              </h1>
            </div>

            {/* 2. NAVEGAÇÃO DESKTOP */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`text-sm font-medium transition-colors hover:text-linaclyn-red ${currentPage === item.page ? "text-linaclyn-red font-bold" : "text-muted-foreground"
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* 3. BARRA DE BUSCA (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-[250px] mx-4">
              <SearchBar onSearch={performSearch} />
            </div>

            {/* 4. AÇÕES (Favoritos, Carrinho, User, Tema) */}
            <div className="flex items-center space-x-2">

              {/* Favoritos */}
              <Button variant="ghost" size="icon" onClick={openfavoriteItem} className="relative">
                <Heart className={`h-5 w-5 ${favoriteItem.length > 0 ? 'fill-red-600 text-red-600' : ''}`} />
              </Button>

              {/* Carrinho */}
              <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-linaclyn-red text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>

              <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

              {/* --- LÓGICA DE USUÁRIO / LOGIN --- */}
              {user ? (
                <UserAvatar onAdminAccess={onAdminAccess} />
              ) : (
                <Button
                  onClick={() => onNavigate('auth')}
                  variant="default"
                  className="bg-linaclyn-red hover:bg-red-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 transition-all shadow-md active:scale-95"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">ENTRAR</span>
                </Button>
              )}

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} disabled={!mounted}>
                {mounted && (theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-600" />)}
              </Button>

              {/* Mobile Menu Button */}
              <Button onClick={toggleIconMenu} variant="ghost" size="icon" className="md:hidden">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 5. MENU MOBILE */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-3">
              <SearchBar onSearch={performSearch} />
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); closeMenu(); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-accent rounded-lg"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <Carrinho />
      <WishlistItem />
    </>
  );
}