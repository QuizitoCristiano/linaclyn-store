import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Heart, Moon, Sun, LogIn } from "lucide-react";

import SearchBar from "./SearchBar";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "./UserAvatar";
import Carrinho from "./ShoppingCart";
import { WishlistSidebar } from "./WishlistView";

export default function Header({ onAdminAccess }) {
  const { user } = useAuth();
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

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Sobre", path: "/sobre" },
    { name: "Serviços", path: "/servicos" },
    { name: "Contato", path: "/contato" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            {/* 1. LOGO - Fecha o menu ao voltar pra home */}
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
              <h1 className="text-2xl font-black italic tracking-tighter transition-all group-hover:skew-x-[-10deg]">
                LINA<span className="text-linaclyn-red">CLYN</span>
              </h1>
            </Link>

            {/* 2. NAVEGAÇÃO DESKTOP */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-[11px] uppercase font-black italic tracking-widest transition-all hover:text-linaclyn-red ${isActive ? "text-linaclyn-red border-b-2 border-linaclyn-red" : "text-muted-foreground"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* 3. BUSCA DESKTOP */}
            <div className="hidden lg:flex flex-1 max-w-[250px] mx-8">
              <SearchBar onSearch={performSearch} />
            </div>

            {/* 4. AÇÕES (BOTÕES) */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button variant="ghost" size="icon" onClick={openfavoriteItem} className="relative group">
                <Heart className={`h-5 w-5 transition-transform group-hover:scale-110 ${favoriteItem.length > 0 ? 'fill-linaclyn-red text-linaclyn-red' : ''}`} />
                {favoriteItem.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-foreground text-background text-[9px] font-black rounded-full ring-2 ring-background">
                    {favoriteItem.length}
                  </span>
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleCart} className="relative group">
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-emerald-500 text-white text-[9px] font-black rounded-full animate-in zoom-in ring-2 ring-background shadow-lg shadow-emerald-500/40">
                    {totalCartItems}
                  </span>
                )}
              </Button>

              <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

              {user ? (
                <UserAvatar onAdminAccess={onAdminAccess} />
              ) : (
                <Link to="/auth">
                  <Button
                    variant="default"
                    className="bg-linaclyn-red hover:bg-red-700 text-white font-black italic text-[10px] h-10 px-5 rounded-lg gap-2 transition-all shadow-xl shadow-red-500/20 active:scale-95 uppercase tracking-tighter"
                  >
                    <LogIn size={14} />
                    <span className="hidden sm:inline">Entrar</span>
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" onClick={toggleTheme} disabled={!mounted} className="rounded-full">
                {mounted && (theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-600" />)}
              </Button>

              <Button onClick={toggleIconMenu} variant="ghost" size="icon" className="md:hidden">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 5. MENU MOBILE - Ajustado para ser compacto e funcional */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
            <div className="px-6 py-6 space-y-4">
              <SearchBar onSearch={(q) => { performSearch(q); closeMenu(); }} />

              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `text-sm font-black italic uppercase tracking-tighter transition-colors py-3 border-b border-border/50 ${isActive ? "text-linaclyn-red" : "text-muted-foreground"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

                {/* Login rápido no mobile se não estiver logado */}
                {!user && (
                  <Link to="/auth" onClick={closeMenu} className="text-sm font-black italic uppercase tracking-tighter text-linaclyn-red py-3">
                    Minha Conta (Entrar)
                  </Link>
                )}

                {/* Painel Admin no mobile */}
                {user?.isAdmin && (
                  <button
                    onClick={() => { onAdminAccess(); closeMenu(); }}
                    className="text-sm font-black italic uppercase tracking-tighter text-emerald-500 py-3 text-left"
                  >
                    Painel Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <Carrinho />
      <WishlistSidebar />
    </>
  );
}