import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  // --- ESTADO DO CARRINHO ---
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("lina_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- ESTADO DO CHECKOUT (NOVO) ---
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // --- ESTADO DOS FAVORITOS ---
  const [favoriteItem, setfavoriteItem] = useState(() => {
    const savedFavs = localStorage.getItem("lina_favs");
    try {
      const parsed = JSON.parse(savedFavs);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // --- ESTADOS DE INTERFACE ---
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- FUNÇÕES DE PERSISTÊNCIA ---
  useEffect(() => {
    localStorage.setItem("lina_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("lina_favs", JSON.stringify(favoriteItem));
  }, [favoriteItem]);

  // --- LÓGICA DO CARRINHO (SISTEMA LINA CLYN) ---

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info(`Aumentamos a quantidade de ${product.nome || product.name}`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.nome || product.name} adicionado à sacola!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const incrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.error("Produto removido da sacola.");
  };

  const getCartTotal = () =>
    cartItems.reduce((acc, item) => {
      const preco = typeof item.preco === 'string' ? parseFloat(item.preco) : (item.preco || item.price || 0);
      return acc + preco * item.quantity;
    }, 0);

  // Variável facilitadora para o CheckoutRouter
  const cartTotal = getCartTotal();

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("lina_cart");
  };

  // --- FUNÇÃO FINALIZAR COMPRA ---
  const handleFinalizarCompra = () => {
    if (cartItems.length === 0) {
      return toast.error("Sua sacola está vazia!");
    }
    setIsCartOpen(false); // Fecha o painel lateral
    setIsCheckingOut(true); // Ativa a tela de Checkout
    window.scrollTo(0, 0);
  };

  // --- LÓGICA DE FAVORITOS ---
  const toggleFavorite = (product) => {
    setfavoriteItem((prev) => {
      const isFavorite = prev.find((item) => item.id === product.id);
      if (isFavorite) {
        toast.info(`${product.nome} removido dos favoritos`);
        return prev.filter((item) => item.id !== product.id);
      }
      toast.success(`${product.nome} nos favoritos!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setfavoriteItem((prev) => prev.filter((item) => item.id !== id));
  };

  // --- INTERFACE CONTROL ---
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);
  const openfavoriteItem = () => setIsWishlistOpen(true);
  const closefavoriteItem = () => setIsWishlistOpen(false);
  const toggleWishlist = () => setIsWishlistOpen(!isWishlistOpen);
  const toggleIconMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <CartContext.Provider
      value={{
        // Dados
        cartItems,
        favoriteItem,
        cartTotal,
        isCheckingOut,

        // Interface
        isWishlistOpen,
        isMenuOpen,
        isCartOpen,

        // Funções Carrinho
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        getCartTotal,
        clearCart,
        handleFinalizarCompra,
        setIsCheckingOut,

        // Funções Favoritos
        toggleFavorite,
        removeFromWishlist,
        openfavoriteItem,
        closefavoriteItem,
        toggleWishlist,

        // Funções Menu/Navegação
        toggleCart,
        closeCart,
        toggleIconMenu,
        setIsMenuOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);