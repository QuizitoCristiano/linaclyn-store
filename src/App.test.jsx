/* eslint-disable no-undef */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppContent } from "./App"; // Importamos apenas o conteúdo, não o App completo

// Mockamos o que é pesado e não faz parte da guarda de segurança
vi.mock("@/components/ui/LoadingOverlay", () => ({ default: () => <div data-testid="loading">Proteção Ativa...</div> }));
vi.mock("./pages/ClientHome", () => ({ default: () => <div>Home Segura</div> }));
vi.mock("./Cadastro/AuthPage", () => ({ default: () => <div>Tela de Login</div> }));

describe("🛡️ Teste de Invasão e Defesa (Protocolo Slim)", () => {

  it("🕵️ ATACANTE: Tenta forçar entrada em rota Admin. DEFENSOR: Expulsa para o Login.", async () => {
    // Usamos o MemoryRouter para simular a URL de ataque sem bugar o navegador real
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MemoryRouter>
    );

    // O guarda (ProtectedAdminRoute) deve detectar que não há usuário
    await waitFor(() => {
      // O Dashboard secreto nunca deve ser renderizado
      expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
      // O sistema deve exibir a tela de defesa (Login)
      expect(screen.getByText(/Tela de Login/i)).toBeInTheDocument();
    });
  });

  it("🍯 DEFENSOR: O Honeypot anti-bot deve estar armado no DOM.", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MemoryRouter>
    );
    
    const honeypot = screen.getByRole("textbox", { hidden: true });
    expect(honeypot).toHaveAttribute("name", "user_verification_bypass");
    expect(honeypot).toHaveStyle({ opacity: 0 });
  });
});