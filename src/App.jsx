import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

// Contextos
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
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
import NotFound from "./pages/not-found";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [honeypot, setHoneypot] = useState(''); // ✅ AGORA NO LUGAR CERTO (DENTRO DO COMPONENTE)

  const { user, isAdmin, loading, logout } = useAuth();
  const { isCheckingOut, setIsCheckingOut } = useCart();

  if (loading) return <LoadingOverlay />;

  const handlePageChange = (page) => {
    setIsCheckingOut(false);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    // 1. LÓGICA DE LOGIN/CADASTRO
    if (currentPage === "auth") {
      return <AuthPage onLoginSuccess={() => setCurrentPage("home")} />;
    }

    // 2. LÓGICA DE ADMIN
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

    // 3. LÓGICA DE CHECKOUT
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

          {/* ✅ LÓGICA DO NOT FOUND: Se não for nenhuma das acima e não for admin */}
          {!["home", "sobre", "servicos", "contato", "auth", "admin"].includes(currentPage) &&
            !currentPage.startsWith("admin-") && (
              <NotFound onNavigate={handlePageChange} />
            )}
        </main>

        {!isAdmin && <FloatingChat />}
        <Footer />
      </>
    );
  };

  return (
    <div className="relative">
      {renderContent()}

      {/* ✅ ARMADILHA PARA BOTS (Totalmente invisível para humanos) */}
      <input
        type="text"
        name="user_verification_bypass" // Nome que engana o bot
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        autoComplete="off"
        style={{
          position: 'absolute',
          opacity: 0,
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          zIndex: -1,
          pointerEvents: 'none'
        }}
        tabIndex="-1"
      />
    </div>
  );
}

// COMPONENTE PAI
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