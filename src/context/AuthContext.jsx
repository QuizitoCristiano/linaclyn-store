import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Começa em true para checar o localStorage

  // 1. Único useEffect para inicializar o App
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("linaclyn_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin' || parsedUser.email === "admin@linaclyn.com");
      }
      setLoading(false); // Libera o AppContent após a checagem
    };

    checkUser();
  }, []);

  // 2. Função de Login Unificada
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Lógica de Admin Fictícia (depois você troca pela do Banco)
      const role = email === "admin@linaclyn.com" ? "admin" : "client";
      const userData = { email, name: "Membro LinaClyn", role };

      // SALVA TUDO NO LOCALSTORAGE
      localStorage.setItem("linaclyn_user", JSON.stringify(userData));

      setUser(userData);
      setIsAdmin(role === "admin");
      toast.success("Login bem-sucedido!");
      return true;
    } catch (error) {
      toast.error("Falha no login. Verifique os dados.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. Função de Cadastro
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const userData = { email, name, role: "client" };

      localStorage.setItem("linaclyn_user", JSON.stringify(userData));

      setUser(userData);
      setIsAdmin(false);
      toast.success("Conta criada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao registrar. Tente novamente.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 4. Função de Logout
  const logout = () => {
    localStorage.removeItem("linaclyn_user");
    setUser(null);
    setIsAdmin(false);
    toast.info("Você saiu do sistema.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, setLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);