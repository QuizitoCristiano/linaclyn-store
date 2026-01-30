import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Heart, Moon, Sun } from "lucide-react";

import SearchBar from "./SearchBar";
import { useTheme } from "@/hooks/useTheme";

// Importando os novos contextos separados
import { useCart } from "@/context/CartContext";
import Carrinho from "./ShoppingCart";
import { useProducts } from "@/context/ProductContext";
import UserAvatar from "./UserAvatar";
import WishlistItem from "./WishlistView";

export default function Header({
  currentPage = "home",
  onNavigate,
  onAdminAccess,
}) {
  // Puxando do CartContext
  const {

    isMenuOpen,
    addToCart,
    getCartTotal,
    setIsMenuOpen,
    cartItems,
    toggleCart,
    favoriteItem,
    toggleWishlist,
    closeMenu,
    toggleIconMenu,
    openfavoriteItem,
    closefavoriteItem,
    isWishlistOpen,


  } = useCart();

  // Puxando do ProductContext (para a busca)
  const { performSearch, isSearching, searchResults, closeSearch, navigateToProductCategory } = useProducts();

  // Hook de tema corrigido
  const { theme, toggleTheme, mounted } = useTheme();

  const navItems = [
    { name: "Home", href: "#", page: "home" },
    { name: "Sobre", href: "#", page: "sobre" },
    { name: "Serviços", href: "#", page: "servicos" },
    { name: "Contato", href: "#", page: "contato" },
    { name: "Login", href: "#", page: "login" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <h1 className="text-xl font-black italic tracking-tighter transition-all group-hover:scale-105">
                LINA<span className="text-linaclyn-red">CLYN</span>
              </h1>

            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    console.log("Navegando para:", item.page);
                    onNavigate && onNavigate(item.page);
                  }}
                  className={`text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus:bg-transparent dark:focus:bg-transparent focus:shadow-none ${currentPage === item.page
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  style={{ outline: "none", boxShadow: "none" }}
                  type="button"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-[280px] mx-4">
              <SearchBar onSearch={performSearch} />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Favorites */}
              <Button variant="ghost" size="icon" onClick={openfavoriteItem} className="relative">
                <Heart className={`h-5 w-5 transition-all ${favoriteItem.length > 0 ? 'fill-red-600 text-red-600' : 'text-zinc-600'}`} />
                {favoriteItem.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in">
                    {favoriteItem.length}
                  </span>
                )}
              </Button>

              {/* Wishlist Modal */}


              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="h-9 w-9 relative focus:outline-none focus:ring-0"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Carrinho</span>
                {/* Badge for cart items */}
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cartItems.reduce(
                      (total, item) => total + (item.quantity || 1),
                      0
                    )}
                  </span>
                )}
              </Button>

              {/* User Avatar */}
              <UserAvatar onAdminAccess={onAdminAccess} />

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 focus:outline-none focus:ring-0 hover:bg-accent transition-colors"
                disabled={!mounted}
                title={theme === "dark" ? "Alternar para tema claro" : "Alternar para tema escuro"}
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-600" />
                  )
                ) : (
                  <div className="h-4 w-4 animate-pulse bg-muted-foreground rounded" />
                )}
                <span className="sr-only">Alternar tema</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button onClick={toggleIconMenu}
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 focus:outline-none focus:ring-0"
              >

                {isMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
                <span className="sr-only">Abrir menu</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                {/* Search Bar - Mobile */}
                <div className="px-3 py-2">
                  <SearchBar onSearch={performSearch} />
                </div>

                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      console.log("Navegando para:", item.page);
                      onNavigate && onNavigate(item.page);
                      closeMenu();
                    }}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors focus:outline-none focus:ring-0 focus:bg-transparent dark:focus:bg-transparent ${currentPage === item.page
                      ? "text-primary bg-linaclyn-red-light font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    style={{ outline: "none", boxShadow: "none" }}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>



        {/* Search Results Modal */}
        {isSearching && searchResults?.length > 0 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-20 p-4">
            <div className="bg-background border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold italic">RESULTADOS</h2>
                <Button variant="ghost" size="icon" onClick={closeSearch}><X /></Button>
              </div>
              <div className="overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mapeamento de produtos aqui... similar ao seu anterior */}
              </div>
            </div>
          </div>
        )}



      </header>
      <Carrinho />
      <WishlistItem />
    </>
  );
}