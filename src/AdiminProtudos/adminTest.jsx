// ... seus imports
import { FloatingChat } from "./components/FloatingChat"; // Importe o chat aqui

function AppContent() {
    const [currentPage, setCurrentPage] = useState("home");
    const { user, isAdmin, loading, logout } = useAuth();

    if (loading) return <LoadingOverlay />;
    if (!user) return <AuthPage onLoginSuccess={() => setCurrentPage("home")} />;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const renderContent = () => {
        // SE FOR ADMIN
        if (currentPage === "admin" || currentPage.startsWith("admin-")) {
            return (
                <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                    <AdminHeader onNavigate={handlePageChange} onLogout={logout} />
                    <main className="container mx-auto px-4 py-8">
                        {currentPage === "admin" && <Dashboard />}
                        {currentPage === "admin-products" && <AdminProdutos />}
                        {currentPage === "admin-orders" && <AdminPedidos />}
                        {currentPage === "admin-customers" && <PaginaClientes />}
                        {/* Aqui você pode criar a página de responder: */}
                        {currentPage === "admin-messages" && <AdminChatList />}
                    </main>
                </div>
            );
        }

        // SE FOR CLIENTE
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