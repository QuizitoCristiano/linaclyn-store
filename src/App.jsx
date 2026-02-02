import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

import Header from "@/components/ui/Header";
import AdminHeader from "@/AdiminProtudos/AdminHeader";
import ClientHome from "@/pages/ClientHome";
import Sobre from "@/pages/Sobre";
import Servicos from "@/pages/Servicos";
import Contato from "@/pages/Contato";
import AuthPage from "./Cadastro/login&Cad";
import LoadingOverlay from "@/components/ui/LoadingOverlay"; // Importe seu overlay de carga
import Dashboard from "./AdiminProtudos/Dashboard";
import { Footer } from "./components/Footer";
import AdminProdutos from "./AdiminProtudos/Produtos";
import AdminPedidos from "./AdiminProtudos/Pedidos";
import PaginaClientes from "./AdiminProtudos/Clientes";
import { FloatingChat } from "./pages/FloatingChat";


function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const { user, isAdmin, loading, logout } = useAuth();

  if (loading) return <LoadingOverlay />;


  if (!user) {
    return <AuthPage onLoginSuccess={() => setCurrentPage("home")} />;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    // LÓGICA DE ADMIN: Se a página for "admin" ou começar com "admin-"
    // ... dentro de renderContent()
    if (currentPage === "admin" || currentPage.startsWith("admin-")) {
      return (
        // MUDANÇA AQUI: Trocamos 'bg-gray-50' por 'bg-background' e adicionamos 'text-foreground'
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

          {/* O Header agora vai conseguir "pintar" o fundo corretamente */}
          <AdminHeader onNavigate={handlePageChange} onLogout={logout} />

          <main className="container mx-auto px-4 py-8">
            {currentPage === "admin" && <Dashboard />} {/* Certifique-se que o nome é Dashboard ou AdminDashboard conforme seu import */}
            {currentPage === "admin-products" && <AdminProdutos />}
            {currentPage === "admin-orders" && <AdminPedidos />}
            {currentPage === "admin-customers" && <PaginaClientes />}
          </main>
        </div>
      );
    }

    // FLUXO NORMAL DO CLIENTE
    return (
      <>
        <Header
          currentPage={currentPage}
          onNavigate={handlePageChange}
          onAdminAccess={() => setCurrentPage("admin")}
          onLogout={logout}
        />
        <main className="container mx-auto px-0 sm:px-6 lg:px-8 py-8">
          {currentPage === "home" && <ClientHome />}
          {currentPage === "sobre" && <Sobre />}
          {currentPage === "servicos" && <Servicos />}
          {currentPage === "contato" && <Contato />}
        </main>


        {/* O CHAT SÓ APARECE PARA O CLIENTE (E SE NÃO FOR ADMIN) */}
        {!isAdmin && <FloatingChat userId={user.uid} />}
        <Footer />
      </>
    );
  };

  return renderContent();
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AppContent />
          {/* Adicionamos 'richColors' para que o erro fique vermelho e o sucesso verde */}
          <Toaster position="top-right" richColors closeButton />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}