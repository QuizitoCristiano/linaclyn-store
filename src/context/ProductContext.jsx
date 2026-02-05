import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../services/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { toast } from "sonner";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCAR PRODUTOS EM TEMPO REAL ---
  useEffect(() => {
    // Use "produtos" (mesmo nome que você corrigiu na regra e no banco)
    const q = query(collection(db, "produtos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- ADICIONAR OU EDITAR PRODUTO ---
  const saveProduct = async (productData) => {
    try {
      const { id, ...data } = productData;

      if (id && typeof id === "string" && id.length > 15) {
        // Se tem ID longo, é EDIÇÃO
        const docRef = doc(db, "produtos", id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date().toISOString()
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Se não tem ID, é NOVO
        await addDoc(collection(db, "produtos"), {
          ...data,
          createdAt: new Date().toISOString()
        });
        toast.success("Produto cadastrado na LinaClyn!");
      }
      return true;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar no banco de dados.");
      return false;
    }
  };

  // --- DELETAR PRODUTO ---
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "produtos", id));
      toast.success("Produto removido do estoque.");
    } catch (error) {
      toast.error("Erro ao deletar produto.");
    }
  };

  return (
    <ProductContext.Provider value={{ products, saveProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);