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
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { toast } from "sonner";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCAR PRODUTOS EM TEMPO REAL ---
  useEffect(() => {
    const q = query(collection(db, "produtos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(list);
      setLoading(false);
    }, (error) => {
      console.error("Erro no Snapshot:", error);
      toast.error("Erro ao carregar produtos.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- ADICIONAR OU EDITAR PRODUTO ---
  const saveProduct = async (productData) => {
    // 1. Validação Preventiva de Segurança
    if (!productData.nome || productData.nome.trim().length < 2) {
      toast.error("O nome do produto é obrigatório.");
      return false;
    }

    if (!productData.preco || Number(productData.preco) <= 0) {
      toast.error("O preço deve ser maior que zero.");
      return false;
    }

    try {
      const { id, ...data } = productData;

      // 2. Sanitização (Garante integridade dos tipos no banco)
      const cleanData = {
        ...data,
        nome: data.nome.trim(),
        preco: Number(data.preco),
        estoque: data.estoque ? Number(data.estoque) : 0,
        // Evita que campos 'undefined' quebrem o Firebase
        categoria: data.categoria || "Geral",
        imagemUrl: data.imagemUrl || ""
      };

      if (id) {
        // EDIÇÃO
        const docRef = doc(db, "produtos", id);
        await updateDoc(docRef, {
          ...cleanData,
          updatedAt: serverTimestamp()
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        // NOVO
        await addDoc(collection(db, "produtos"), {
          ...cleanData,
          createdAt: serverTimestamp()
        });
        toast.success("Produto cadastrado na LinaClyn!");
      }
      return true;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Falha na comunicação com o banco de dados.");
      return false;
    }
  };

  // --- DELETAR PRODUTO ---
  const deleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      await deleteDoc(doc(db, "produtos", id));
      toast.success("Produto removido do estoque.");
    } catch (error) {
      console.error("Erro ao deletar:", error);
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