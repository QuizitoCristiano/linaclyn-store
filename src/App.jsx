import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

// Contextos
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext"; // ✅ Adicionado useCart
import { ProductProvider } from "./context/ProductContext";
import { ChatProvider } from "./context/ChatContext";

// Componentes UI e Layout
import Header from "@/components/ui/Header";
import AdminHeader from "@/AdiminProtudos/AdminHeader";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Footer } from "./components/Footer";
import { FloatingChat } from "./pages/FloatingChat";

// Páginas Cliente
import ClientHome from "@/pages/ClientHome";
import Sobre from "@/pages/Sobre";
import Servicos from "@/pages/Servicos";
import Contato from "@/pages/Contato";
import AuthPage from "./Cadastro/login&Cad";

// Páginas Admin
import Dashboard from "./AdiminProtudos/Dashboard";
import AdminProdutos from "./AdiminProtudos/Produtos";
import AdminPedidos from "./AdiminProtudos/Pedidos";
import PaginaClientes from "./AdiminProtudos/Clientes";
import AdminMensagens from "./AdiminProtudos/AdminMensagens";
import AdminFinanceiro from "./AdiminProtudos/AdminFinanceiro";
import CheckoutRouter from "./Cadastro/CheckoutRouter";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const { user, isAdmin, loading, logout } = useAuth();

  // ✅ Puxando o estado do Checkout do Contexto de Carrinho
  const { isCheckingOut, setIsCheckingOut } = useCart();

  if (loading) return <LoadingOverlay />;

  // Função para navegar e resetar estados se necessário
  const handlePageChange = (page) => {
    setIsCheckingOut(false); // Cancela o checkout se o usuário navegar para outra página pelo menu
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    // 1. LÓGICA DE LOGIN/CADASTRO
    if (currentPage === "auth") {
      return <AuthPage onLoginSuccess={() => setCurrentPage("home")} />;
    }

    // 2. LÓGICA DE ADMIN (Protegida)
    if (currentPage === "admin" || currentPage.startsWith("admin-")) {
      if (!isAdmin) {
        return <AuthPage onLoginSuccess={() => setCurrentPage("admin")} />;
      }

      return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <AdminHeader onNavigate={handlePageChange} onLogout={logout} />
          <main className="container mx-auto px-4 py-8">
            {currentPage === "admin" && <Dashboard />}
            {currentPage === "admin-products" && <AdminProdutos />}
            {currentPage === "admin-orders" && <AdminPedidos />}
            {currentPage === "admin-customers" && <PaginaClientes />}
            {currentPage === "admin-messages" && <AdminMensagens />}
            {currentPage === "admin-finance" && <AdminFinanceiro />}
          </main>
        </div>
      );
    }

    // 3. NOVO: LÓGICA DE CHECKOUT (Foco total na compra)
    if (isCheckingOut) {
      return (
        <CheckoutRouter onNavigate={(dest) => {
          if (dest === 'home') {
            setIsCheckingOut(false);
            setCurrentPage('home');
          }
        }} />
      );
    }

    // 4. FLUXO NORMAL DO CLIENTE
    return (
      <>
        <Header
          currentPage={currentPage}
          onNavigate={handlePageChange}
          onAdminAccess={() => setCurrentPage("admin")}
          onLoginClick={() => setCurrentPage("auth")}
          onLogout={logout}
          user={user}
        />

        <main className="container mx-auto px-0 sm:px-6 lg:px-8 py-8">
          {currentPage === "home" && <ClientHome />}
          {currentPage === "sobre" && <Sobre />}
          {currentPage === "servicos" && <Servicos />}
          {currentPage === "contato" && <Contato />}
        </main>

        {/* FloatingChat visível apenas para clientes */}
        {!isAdmin && <FloatingChat />}

        <Footer />
      </>
    );
  };

  return renderContent();
}

// COMPONENTE PAI (Providers)
export default function App() {
  return (
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
  );
}