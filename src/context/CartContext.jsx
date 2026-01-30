import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  // --- ESTADO DO CARRINHO ---
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("lina_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- ESTADO DOS FAVORITOS (ITENS) ---
  const [favoriteItem, setfavoriteItem] = useState(() => {
    const savedFavs = localStorage.getItem("lina_favs");
    try {
      const parsed = JSON.parse(savedFavs);
      // Garante que sempre seja um array para não quebrar o .map()
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // --- ESTADOS DE INTERFACE (MODAIS/MENUS) ---
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Adicionado caso precise

  // --- FUNÇÕES DE FAVORITOS ---
  const openfavoriteItem = () => setIsWishlistOpen(true);
  const closefavoriteItem = () => setIsWishlistOpen(false);
  const toggleWishlist = () => setIsWishlistOpen(!isWishlistOpen);

  const toggleFavorite = (product) => {
    setfavoriteItem((prev) => {
      const isFavorite = prev.find((item) => item.id === product.id);
      if (isFavorite) {
        toast.info(`${product.name} removido dos favoritos`);
        return prev.filter((item) => item.id !== product.id);
      }
      toast.success(`${product.name} adicionado aos favoritos!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setfavoriteItem((prev) => prev.filter((item) => item.id !== id));
  };

  // --- FUNÇÕES DE MENU ---
  const toggleIconMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // --- FUNÇÕES DO CARRINHO ---
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} no carrinho!`);
  };

  const getCartTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // --- PERSISTÊNCIA (LOCALSTORAGE) ---
  useEffect(() => {
    localStorage.setItem("lina_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("lina_favs", JSON.stringify(favoriteItem));
  }, [favoriteItem]);

  return (
    <CartContext.Provider
      value={{
        // Estados de Dados
        cartItems,
        favoriteItem,

        // Estados de UI
        isWishlistOpen,
        isMenuOpen,
        isCartOpen,

        // Funções
        addToCart,
        getCartTotal,
        toggleIconMenu,
        setIsMenuOpen,
        closeMenu,
        openfavoriteItem,
        closefavoriteItem,
        toggleWishlist,
        toggleFavorite,
        removeFromWishlist,
        toggleCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);