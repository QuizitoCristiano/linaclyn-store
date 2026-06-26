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
    // --- BARREIRA DE SEGURANÇA (O ATACANTE PARA AQUI) ---

    // 1. Verifica se o preço existe e é um número válido
    const precoSeguro = typeof product.preco === 'number' ? product.preco : parseFloat(product.preco);

    if (isNaN(precoSeguro) || precoSeguro <= 0) {
      console.error("🚫 Bloqueado: Tentativa de adicionar produto com preço inválido.");
      toast.error("Erro na validação do produto.");
      return; // Encerra a função e não adiciona ao carrinho
    }

    // 2. Garante que o ID e Nome não são nulos/vazios
    if (!product.id || !product.nome) {
      console.error("🚫 Bloqueado: Dados do produto incompletos.");
      return;
    }

    // --- LOGICA DE ADICIONAR (DADOS JÁ LIMPOS E VALIDADOS) ---
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info(`Aumentamos a quantidade de ${product.nome}`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      toast.success(`${product.nome} adicionado à sacola!`);
      // Salva no estado com o preço que nós validamos aqui em cima
      return [...prev, { ...product, preco: precoSeguro, quantity: 1 }];
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

  // const getCartTotal = () =>
  //   cartItems.reduce((acc, item) => {
  //     // Como validamos no addToCart, o item.preco já é garantido como número
  //     return acc + (item.preco * item.quantity);
  //   }, 0);

  // Variável facilitadora para o CheckoutRouter
  const cartTotal = getCartTotal();

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("lina_cart");
  };


  // --- FUNÇÃO FINALIZAR COMPRA (REVISADA) ---



  // const handleFinalizarCompra = async (navigate) => {
  //   if (cartItems.length === 0) {
  //     return toast.error("Sua sacola está vazia!");
  //   }

  //   try {
  //     setIsCheckingOut(true);

  //     // Verificação de segurança: o navigate existe?
  //     if (!navigate) {
  //       throw new Error("Navegação não configurada");
  //     }

  //     setIsCartOpen(false);

  //     // Pequeno delay para a animação de fechar o carrinho terminar
  //     setTimeout(() => {
  //       navigate("/checkout");
  //     }, 300);

  //   } catch (error) {
  //     console.error("Erro no redirecionamento:", error);
  //     toast.error("Erro ao redirecionar. Tente novamente.");
  //     setIsCheckingOut(false); // Destrava o botão se falhar
  //   }
  // };

  const handleFinalizarCompra = async (navigate) => {
    if (cartItems.length === 0) {
      return toast.error("Sua sacola está vazia!");
    }

    try {
      setIsCheckingOut(true);

      // 1. FORMATAR SNAPSHOT PARA O CHECKOUT
      // Aqui nós preparamos os dados que a tela de endereço vai precisar
      const checkoutData = {
        order_items: cartItems.map(item => ({
          id: item.id,
          qtd: item.quantity,
          nome: item.nome,
          preco_unitario: item.preco // Apenas para mostrar na tela final, o cálculo real será no checkout
        })),
        subtotal_visual: cartTotal, // O valor que aparece na foto que você mandou (ex: R$ 384,36)
        created_at_temp: new Date().toISOString()
      };

      if (!navigate) throw new Error("Erro interno de navegação");

      // 2. PERSISTÊNCIA DE SESSÃO
      // Usamos sessionStorage para que, se o usuário fechar a aba, os dados sensíveis sumam
      sessionStorage.setItem("lina_checkout_session", JSON.stringify(checkoutData));

      setIsCartOpen(false);

      // Transição suave para a tela de endereço (image_0efb66.png)
      setTimeout(() => {
        navigate("/checkout");
      }, 300);

    } catch (error) {
      console.error("Erro na transição:", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
      setIsCheckingOut(false);
    }
  };


  // --- LÓGICA DE FAVORITOS COM INTELIGÊNCIA DE RECOMENDAÇÃO ---
  const toggleFavorite = (product) => {
    setfavoriteItem((prev) => {
      const isFavorite = prev.find((item) => item.id === product.id);

      // Pegamos a lista de interesses (categorias que ele mais curte)
      let interests = JSON.parse(localStorage.getItem("lina_interests") || "[]");

      if (isFavorite) {
        return prev.filter((item) => item.id !== product.id);
      }

      // --- LÓGICA DINÂMICA ---
      // Não importa se é "SAPATO" ou "GERAL", o sistema captura a string real
      if (product.categoria) {
        // Remove se a categoria já existia e coloca no topo (é o interesse mais recente)
        interests = [product.categoria, ...interests.filter(cat => cat !== product.categoria)];

        // Guardamos apenas as 5 categorias mais recentes para o sistema não "viciar"
        localStorage.setItem("lina_interests", JSON.stringify(interests.slice(0, 5)));
      }

      toast.success(`${product.nome} adicionado aos favoritos!`);
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