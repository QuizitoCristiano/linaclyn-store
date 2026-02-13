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

  // ✅ E-mails Mestres - Constante imutável para segurança
  const ADMIN_EMAILS = Object.freeze([
    "admin@linaclyn.com.br",
    "quizitocristiano10@gmail.com"
  ]);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Sanitização imediata do e-mail para comparação
        const safeEmail = firebaseUser.email?.toLowerCase().trim();
        setUser(firebaseUser);

        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // ✅ SEGURANÇA MÁXIMA: Verifica e-mail mestre OU permissão no banco
            const hasPrivileges = ADMIN_EMAILS.includes(safeEmail) || userData?.role === 'admin';
            setIsAdmin(hasPrivileges);
          } else {
            // Caso de login via provedor externo sem doc criado ainda
            setIsAdmin(ADMIN_EMAILS.includes(safeEmail));
          }
        } catch (error) {
          // Erro de conexão ou permissão de leitura no Firestore
          console.error("Critical Auth Check Error");
          setIsAdmin(ADMIN_EMAILS.includes(safeEmail));
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
      toast.error("Por favor, preencha as credenciais.");
      return false;
    }

    setLoading(true);
    try {
      // .trim() evita espaços acidentais que falham o login
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      toast.success("Acesso autorizado. Bem-vindo!");
      return true;
    } catch (error) {
      // ✅ ANTI-HACKER: Mensagem opaca. Não informa se o erro foi no e-mail ou na senha.
      toast.error("Credenciais inválidas ou conta não encontrada.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    // Validação de entrada robusta
    if (!name || name.trim().length < 3) {
      toast.error("Nome inválido para registro.");
      return false;
    }

    const safeEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, safeEmail, password);
      const firebaseUser = userCredential.user;

      // ✅ PROTEÇÃO DE DADOS: Criando o objeto com dados controlados pelo servidor
      const newUser = {
        uid: firebaseUser.uid,
        name: name.trim(),
        displayName: name.trim(),
        email: safeEmail,
        // Garante que ninguém consiga se registrar como admin via console
        role: ADMIN_EMAILS.includes(safeEmail) ? 'admin' : 'customer',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        status: 'active'
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      toast.success("Conta LinaClyn criada com sucesso!");
      return true;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Este endereço de e-mail já está em uso.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
      } else {
        toast.error("Falha técnica no registro. Tente mais tarde.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (!email) return toast.error("E-mail necessário.");
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
        url: window.location.origin,
      });
      toast.success("Se a conta existir, um link de redefinição foi enviado.");
      return true;
    } catch (error) {
      // Não damos pistas se o e-mail existe ou não no banco
      toast.success("Instruções enviadas para o e-mail informado.");
      return true;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.info("Sessão encerrada com segurança.");
    } catch (error) {
      toast.error("Erro ao sair.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAdmin, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);