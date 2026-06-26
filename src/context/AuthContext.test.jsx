import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// 1. Componente de teste para consumir o hook
const TestComponent = () => {
    const { user, isAdmin, login } = useAuth();
    return (
        <div>
            <div data-testid="user-status">{user ? "logado" : "deslogado"}</div>
            <div data-testid="admin-status">{isAdmin ? "sim" : "não"}</div>
            <button onClick={() => login("admin@linaclyn.com.br", "123456")}>Login Test</button>
        </div>
    );
};

//cd frontend   
// --- 3. MOCK COMPLETO DO FIREBASE ---

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    // Adicione esta linha aqui embaixo:
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: "123" } })),
    onAuthStateChanged: vi.fn((auth, callback) => {
        if (typeof callback === 'function') callback(null);
        return () => { };
    }),
}));

describe("AuthContext", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve iniciar em estado de carregamento e depois mostrar 'deslogado'", async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // O AuthProvider só renderiza os filhos quando loading é false
        await waitFor(() => {
            expect(screen.getByTestId("user-status")).toHaveTextContent("deslogado");
        });
    });

    it("deve identificar corretamente um administrador pelo e-mail mestre", async () => {
        // Simulamos que o Firebase retornou um usuário admin
        onAuthStateChanged.mockImplementationOnce((auth, callback) => {
            callback({ uid: "123", email: "admin@linaclyn.com.br" });
            return () => { };
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("admin-status")).toHaveTextContent("sim");
        });
    });

    it("deve chamar a função de login do Firebase com as credenciais corretas", async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginBtn = await screen.findByRole("button", { name: /Login Test/i });

        await act(async () => {
            fireEvent.click(loginBtn);
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            "admin@linaclyn.com.br",
            "123456"
        );
    });
});