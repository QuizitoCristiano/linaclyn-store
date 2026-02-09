import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../services/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = "quizitocristiano10@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Segurança: Prioriza o e-mail Master ou a role do banco
            setIsAdmin(firebaseUser.email === ADMIN_EMAIL || userData?.role === 'admin');
          } else {
            // Caso o documento não exista (ex: login social novo), checa apenas o e-mail
            setIsAdmin(firebaseUser.email === ADMIN_EMAIL);
          }
        } catch (error) {
          console.error("Erro ao validar permissões:", error);
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
    if (!email || !password) {
      toast.error("Preencha todos os campos!");
      return false;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Bem-vindo de volta!");
      return true;
    } catch (error) {
      // Mensagem genérica para não dar pistas a hackers se o e-mail ou a senha está errado
      toast.error("Acesso negado. Verifique e-mail e senha.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    if (!name || name.trim().length < 3) {
      toast.error("Por favor, digite seu nome completo.");
      return false;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      // Sanitização e Gravação Segura
      const newUser = {
        uid: firebaseUser.uid,
        name: name.trim(),
        displayName: name.trim(),
        email: email.trim().toLowerCase(),
        role: email.trim().toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: serverTimestamp() // Mudança para data do servidor
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      toast.success("Conta criada na LinaClyn!");
      return true;
    } catch (error) {
      // Tratamento de erro específico para e-mail já existente
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Este e-mail já está cadastrado.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (!email) return toast.error("Digite seu e-mail.");
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: window.location.origin,
        handleCodeInApp: true,
      });
      toast.success("E-mail de recuperação enviado!");
      return true;
    } catch (error) {
      toast.error("Erro ao processar solicitação.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.info("Você saiu da conta.");
    } catch (error) {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAdmin, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);