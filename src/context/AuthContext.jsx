import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "../services/config";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Adicionei o getDoc aqui!

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = "quizitocristiano10@gmail.com";

  // --- UM ÚNICO EFFECT PARA CONTROLAR TUDO ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Define o usuário básico do Auth
        setUser(firebaseUser);

        // 2. Busca permissões extras no Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data();

          // 3. Prova Real: É Admin se tiver o email master OU se o role for admin no banco
          if (firebaseUser.email === ADMIN_EMAIL || userData?.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Erro ao buscar role do usuário:", error);
          // Fallback apenas por email se o banco falhar
          setIsAdmin(firebaseUser.email === ADMIN_EMAIL);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Bem-vindo de volta!");
      return true;
    } catch (error) {
      toast.error("Erro no login: Verifique suas credenciais.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;


      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        name: name, // O que você já tem
        displayName: name, // Adicione isso para o Auth
        email: email,
        role: email === ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });

      toast.success("Conta criada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao registrar: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.info("Sessão encerrada.");
    } catch (error) {
      toast.error("Erro ao sair.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);