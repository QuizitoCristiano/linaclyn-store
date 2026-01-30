import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]); // Inicia vazio ou com dados da API
  const [reviews, setReviews] = useState([]);

  // Funções CRUD que o Admin vai usar
  const addProduct = (product) => {
    // Em produção, aqui seria um POST para sua API
    setProducts((prev) => [...prev, { ...product, id: crypto.randomUUID() }]);
    toast.success("Produto cadastrado!");
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.error("Produto removido.");
  };

  const moderateReview = (id, status) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <ProductContext.Provider
      value={{ products, reviews, addProduct, deleteProduct, moderateReview }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
