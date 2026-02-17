import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Contextos
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { ChatProvider } from "./context/ChatContext";

// Componentes Layout
import Header from "@/components/ui/Header";
import AdminHeader from "@/AdiminProtudos/AdminHeader";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Footer } from "./components/Footer";
import { FloatingChat } from "./pages/FloatingChat";

// Páginas
import ClientHome from "@/pages/ClientHome";
import Sobre from "@/pages/Sobre";
import Servicos from "@/pages/Servicos";
import Contato from "@/pages/Contato";
import AuthPage from "./Cadastro/login&Cad";
import Dashboard from "./AdiminProtudos/Dashboard";
import AdminProdutos from "./AdiminProtudos/Produtos";
import AdminPedidos from "./AdiminProtudos/Pedidos";
import PaginaClientes from "./AdiminProtudos/Clientes";
import AdminFinanceiro from "./AdiminProtudos/AdminFinanceiro";
import CheckoutRouter from "./Cadastro/CheckoutRouter";
import NotFound from "./pages/not-found";
import AdminMensagens from "./AdiminProtudos/AdminMensagens";

// --- 🛡️ COMPONENTES DE ESTRUTURA ---

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingOverlay />;
  if (!user || !isAdmin) return <Navigate to="/auth" replace />;
  return children;
};

// Layout da Loja (Onde aparecem Header e Footer)
const ClientLayout = () => (
  <>
    <Header />
    <main className="container mx-auto px-0 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <FloatingChat />
    <Footer />
  </>
);

// Layout do Admin
const AdminLayout = ({ logout }) => (
  <div className="min-h-screen bg-background">
    <AdminHeader onLogout={logout} />
    <main className="container mx-auto px-4 py-8">
      <Outlet />
    </main>
  </div>
);

// --- 🚀 LÓGICA PRINCIPAL ---

export function AppContent() {
  const [honeypot, setHoneypot] = useState('');
  const { loading, logout } = useAuth();
  const { isCheckingOut } = useCart();
  const navigate = useNavigate();

  if (loading) return <LoadingOverlay />;

  // Função para o botão X da AuthPage
  const handleCloseAuth = () => {
    navigate("/"); // Se o usuário clicar no X, volta para a Home
  };

  return (
    <div className="relative">
      <Routes>
        {/* 1. MUNDO CLIENTE */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<ClientHome />} />

          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/contato" element={<Contato />} />
        </Route>

        {/* 2. PÁGINA ABSOLUTA DE LOGIN/CADASTRO */}
        {/* Passamos a função handleCloseAuth para o componente usar no botão X */}
        <Route path="/auth" element={<AuthPage onClose={handleCloseAuth} />} />

        {/* 3. MUNDO CHECKOUT */}
        {/* <Route path="/checkout/*" element={isCheckingOut ? <CheckoutRouter /> : <Navigate to="/" />} /> */}
        <Route path="/checkout/*" element={<CheckoutRouter />} />

        {/* 4. MUNDO ADMIN */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout logout={logout} />
          </ProtectedAdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProdutos />} />
          <Route path="orders" element={<AdminPedidos />} />
          <Route path="customers" element={<PaginaClientes />} />
          <Route path="messages" element={<AdminMensagens />} />
          <Route path="finance" element={<AdminFinanceiro />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Honeypot Anti-Bot */}
      <input
        type="text"
        name="user_verification_bypass"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        autoComplete="off"
        style={{ position: 'absolute', opacity: 0, top: 0, left: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }}
        tabIndex="-1"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <ProductProvider>
            <CartProvider>
              <AppContent />
              <Toaster position="top-right" richColors closeButton />
            </CartProvider>
          </ProductProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}