/* eslint-disable no-undef */
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChatProvider, useChat } from "./ChatContext";

// 1. MOCKS DO FIREBASE (Sempre no topo)
vi.mock("firebase/auth", () => {
    const authMock = {
        onAuthStateChanged: vi.fn((callback) => {
            if (typeof callback === 'function') callback(null);
            return () => {};
        }),
    };
    return {
        getAuth: vi.fn(() => authMock),
        onAuthStateChanged: authMock.onAuthStateChanged,
    };
});

vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    onSnapshot: vi.fn(() => () => {}),
    query: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
}));

// 2. MOCK DO AUDIO
globalThis.Audio = vi.fn().mockImplementation(function () {
    return { play: vi.fn().mockResolvedValue(), pause: vi.fn(), load: vi.fn() };
});

// 3. COMPONENTE DE TESTE (O que estava faltando!)
const ChatTestComponent = () => {
    const { isOfficeHours, sendImageMessage } = useChat();
    return (
        <div>
            <div data-testid="office-status">{isOfficeHours() ? "aberto" : "fechado"}</div>
            <button onClick={() => {
                const file = new File([""], "test.png", { type: "image/png" });
                Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }); // 3MB
                sendImageMessage("user123", file, "Cliente").catch(e => {
                    window.alert(e.message);
                });
            }}>Testar Peso Imagem</button>
        </div>
    );
};

// 4. SUITE DE TESTES
describe("ChatContext - Segurança e Horários", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("🛡️ SEGURANÇA: Deve bloquear imagens maiores que 2MB", async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

        render(
            <ChatProvider>
                <ChatTestComponent />
            </ChatProvider>
        );

        const btn = screen.getByText("Testar Peso Imagem");
        await act(async () => {
            btn.click();
        });

        expect(alertMock).toHaveBeenCalledWith("Imagem muito pesada! Limite de 2MB.");
    });

    it("deve validar o horário comercial corretamente", () => {
        // Segunda-feira às 10h da manhã
        vi.setSystemTime(new Date(2026, 1, 16, 10, 0));

        const { unmount } = render(
            <ChatProvider>
                <ChatTestComponent />
            </ChatProvider>
        );

        expect(screen.getByTestId("office-status")).toHaveTextContent("aberto");

        unmount();
        vi.setSystemTime(new Date(2026, 1, 15, 10, 0)); // Domingo

        render(
            <ChatProvider>
                <ChatTestComponent />
            </ChatProvider>
        );

        expect(screen.getByTestId("office-status")).toHaveTextContent("fechado");
    });
});